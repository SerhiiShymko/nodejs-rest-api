// const { Types } = require("mongoose");

const User = require("../models/userModel");
const { AppError } = require("../utils");

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
