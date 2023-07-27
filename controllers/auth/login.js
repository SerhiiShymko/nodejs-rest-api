const catchAsync = require("../../utils/catchAsync");
const userServices = require("../../services/userServices");

const login = catchAsync(async (req, res) => {
  const { user, token } = await userServices.loginUser(req.body);

  res.status(200).json({
    user,
    token,
  });
});

module.exports = login;
