const jwt = require("jsonwebtoken");

const { catchAsync } = require("../../utils");
const Contact = require("../../models/contactsModel");
const userRolesEnum = require("../../constans/contactRolesEnum");

const signToken = (id) => {};

const signup = catchAsync(async (req, res) => {
  const newUserData = {
    ...req.body,
    role: userRolesEnum.USER,
  };

  const newUser = await Contact.create(newUserData);

  newUser.password = undefined;
});

const signip = (req, res) => {};

module.exports = { signup, signip };
