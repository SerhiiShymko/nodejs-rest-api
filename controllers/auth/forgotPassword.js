const { catchAsync } = require('../../utils');
const { userService } = require('../../services/userServices');

/**
 * Reset password request
 */
const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    return res.status(200).json({
      msg: 'Password reset instruction send to email',
    });
  }

  const otp = user.createPasswordResetToken();

  await user.save();

  console.log('otp>>>>>', otp);

  // send otp by email

  res.status(200).json({
    msg: 'Password reset instruction send to email',
  });
});

module.exports = forgotPassword;
