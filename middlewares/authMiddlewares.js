const jwt = require('jsonwebtoken');
const { catchAsync, usersValidators, AppError } = require('../utils');
const userService = require('../services/userServices');
const User = require('../models/userModel');

exports.checkRegisterUserData = catchAsync(async (req, res, next) => {
  const { error, value } = usersValidators.registerUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await userService.contactExists({ email: value.email });

  req.body = value;

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1];

  if (!token) throw new AppError(401, 'Not authorized');

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error.message);

    throw new AppError(401, 'Not authorized');
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) throw new AppError(401, 'Not authorized');

  req.user = currentUser;

  next();
});

/**
 * Roles quard middleware
 * allowFor (business, pro, starter)
 * use ONLY after 'protect'
 * @param {String} subscriptions
 * @returns {Function}
 */
exports.allowFor =
  (...subscriptions) =>
  (req, res, next) => {
    if (subscriptions.includes(req.user.subscription)) return next();

    next(new AppError(403, 'You are not allowed to perform this action'));
  };
