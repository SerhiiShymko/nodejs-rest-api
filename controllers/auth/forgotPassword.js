const nodemailer = require('nodemailer');

const { catchAsync } = require('../../utils');
const { getUserByEmail } = require('../../services/userServices');
const Email = require('../../services/emailService');

/**
 * Reset password request
 */
const forgotPassword = catchAsync(async (req, res) => {
  const user = await getUserByEmail(req.body.email);

  if (!user) {
    return res.status(200).json({
      msg: 'Password reset instruction send to email',
    });
  }

  const otp = user.createPasswordResetToken();

  await user.save();

  console.log('otp>>>>>', otp);

  // send otp by email
  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/reset-password/${otp}`;

    await new Email(user, resetUrl).sendRestorePassword();
  } catch (error) {
    console.log(error);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
  }

  // const emailTransport = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'user',
  //     pass: 'passwd',
  //   },
  // });

  // const emailTransport = nodemailer.createTransport({
  //   host: 'sandbox.smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // const emailConfig = {
  //   from: 'Admin <admin@example.com>',
  //   to: user.email,
  //   subject: 'Password reset instruction',
  //   text: resetUrl,
  // };

  // await emailTransport.sendMail(emailConfig);

  res.status(200).json({
    msg: 'Password reset instruction send to email',
  });
});

module.exports = forgotPassword;
