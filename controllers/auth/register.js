const jwt = require("jsonwebtoken");

const { catchAsync } = require("../../utils");
const User = require("../../models/userModel");
const userRolesEnum = require("../../constans/contactRolesEnum");

/**
 * JWT sign service method.
 * @param {string} id -user ID
 * @returns {string} - jwt
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const register = catchAsync(async (req, res) => {
  const newUserData = {
    ...req.body,
    role: userRolesEnum.USER,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  res.status(201).json({
    user: newUser,
    token,
  });
});

module.exports = register;
