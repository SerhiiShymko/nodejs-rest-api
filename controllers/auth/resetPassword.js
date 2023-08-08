const { catchAsync } = require('../../utils');
const { resetUserPassword } = require('../../services/userServices');

const resetPassword = catchAsync(async (req, res) => {
  const updatedUser = await resetUserPassword(
    req.params.otp,
    req.body.password
  );

  res.status(200).json({
    user: updatedUser,
  });
});

module.exports = resetPassword;
