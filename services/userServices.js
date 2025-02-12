// const { Types } = require('mongoose');
const crypto = require('crypto');
const uuid = require('uuid').v4;

const userRolesEnum = require('../constans/userRolesEnum');
const User = require('../models/userModel');
const { AppError, userNameHandler } = require('../utils');
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
  const { name, ...restUserData } = userData;
  const verificationToken = uuid();

  const newUserData = {
    ...restUserData,
    name: userNameHandler(name),
    role: userRolesEnum.USER,
    verificationToken,
  };
  // const verifyEmail = {
  //   to: email,
  //   subject: 'Verify email',
  //   html: `<a
  //       target="_blank"
  //       href="http://localhost:3000/api/verify/${verificationCode}"
  //     >
  //       Click verify email
  //     </a>`,
  // };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  return { user: newUser, token, verificationToken };
};

/**
 * Check user login data and sign token.
 * @param {Object} loginData - Об'єкт з полями `email` та `password`.
 * @returns {Object}
 */
exports.loginUser = async loginData => {
  const { email, password } = loginData;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !password) throw new AppError(401, 'Not authorized');

  if (!user.verify) throw new AppError(401, 'Email not verified');

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

/**
 *
 * @param {string} email
 * @returns {Promise<User>}
 */
exports.getUserByEmail = email => User.findOne({ email });

exports.resetUserPassword = async (otp, password) => {
  const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError(400, 'Token is invalid..');

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  user.password = undefined;

  return user;
};

// exports.verifyCode = async verificationCode => {
//   const user = await User.findOne({ verificationCode });

//   if (!user) throw new AppError(404, 'User not found');

//   user.verify = true;
//   user.verificationCode = null;

//   await user.save();
// };
