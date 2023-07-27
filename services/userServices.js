// const { Types } = require("mongoose");

const userRolesEnum = require("../constans/userRolesEnum");
const User = require("../models/userModel");
const { AppError } = require("../utils");
const signToken = require("./jwtService");

/**
 * Check if contact exists services.
 * @param {Object} filter
 * @returns {Promise<void>}
 */
exports.contactExists = async (filter) => {
  const contactExists = await User.exists(filter);

  if (contactExists)
    throw new AppError(409, "Contact with this email exists..");
};

/**
 * Create user and sign JWT
 * @param {Object} userData
 * @returns {Object}
 */
exports.registerUser = async (userData) => {
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
 * @param {Object} loginData
 * @returns {Object}
 */
exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new AppError(401, "Not authorized");

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) throw new AppError(401, "Not authorized");

  user.password = undefined;

  const token = signToken(user.id);

  return { user, token };
};
