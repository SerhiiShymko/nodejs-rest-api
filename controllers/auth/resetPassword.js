const { catchAsync } = require('../../utils');
const { userService } = require('../../services/userServices');

const resetPassword = catchAsync(async (req, res) => {
  const updateUser = await userService.resetPassword(
    req.params.otp,
    req.body.password
  );

  res.status(200).json({
    user: updateUser,
  });
});

module.exports = resetPassword;
