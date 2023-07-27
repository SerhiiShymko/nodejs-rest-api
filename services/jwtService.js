const jwt = require("jsonwebtoken");

/**
 * JWT sign service method.
 * @param {string} id -user ID
 * @returns {string} - jwt
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

module.exports = signToken;
