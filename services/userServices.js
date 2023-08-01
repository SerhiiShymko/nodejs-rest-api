// const { Types } = require('mongoose');

const userRolesEnum = require('../constans/userRolesEnum');
const User = require('../models/userModel');
const { AppError } = require('../utils');
const { signToken } = require('./jwtService');

/**
 * Get user by id service.
 * @param {string} id
 * @returns {Promise<User>}
 */
exports.getUserById = id => User.findById(id);

/**
 * Check if contact exists services.
 * @param {Object} filter
 * @returns {Promise<void>}
 */
exports.contactExists = async filter => {
  const contactExists = await User.exists(filter);

  if (contactExists) {
    throw new AppError(409, 'Contact with this email exists..');
  }
};

/**
 * Create user and sign JWT
 * @param {Object} userData
 * @returns {Object}
 */
exports.registerUser = async userData => {
  const newUserData = {
    ...userData,
    role: userRolesEnum.USER,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  return { user: newUser, token };
};

/**
 * Check user login data and sign token.
 * @param {Object} loginData - Об'єкт з полями `email` та `password`.
 * @returns {Object}
 */
exports.loginUser = async loginData => {
  const { email, password } = loginData;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new AppError(401, 'Not authorized');

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) throw new AppError(401, 'Not authorized');

  user.password = undefined;

  const token = signToken(user.id);
  await User.findByIdAndUpdate(user._id, { token });

  return { user, token };
};

exports.checkUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('password');

  if (!(await user.checkPassword(currentPassword, user.password))) {
    throw new AppError(401, 'Current pasword wrong');
  }

  user.password = newPassword;

  await user.save();
};
