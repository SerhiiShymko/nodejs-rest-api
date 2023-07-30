// const jwt = require('jsonwebtoken');
const { catchAsync, usersValidators, AppError } = require('../utils');
const userServices = require('../services/userServices');
const { checkToken } = require('../services/jwtService');
const { updateSubscription } = require('../services/contactServices');

exports.checkRegisterUserData = catchAsync(async (req, res, next) => {
  const { error, value } = usersValidators.registerUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await userServices.contactExists({ email: value.email });

  req.body = value;

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1];
  const userId = checkToken(token);

  const currentUser = await userServices.getUserById(userId);

  if (!currentUser || !currentUser.token || currentUser.token !== token) {
    throw new AppError(401, 'Not authorized');
  }

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

exports.updateSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { subscription } = req.body;

  const updatedUser = await updateSubscription(id, subscription);
  res.status(200).json(updatedUser);
});
