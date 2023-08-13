const { catchAsync } = require('../../utils');
const {
  getUserByEmail,
  createPasswordResetToken,
} = require('../../services/userServices');
const Email = require('../../services/emailService');

const { PORT, BASE_URL } = process.env;

const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'missing required field email',
    });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  if (user.verify) {
    return res.status(400).json({
      message: 'Verification has already been passed',
    });
  }

  const newVerificationToken = await createPasswordResetToken();
  user.verificationToken = newVerificationToken;

  await user.save();

  const verificationLink = `${BASE_URL}:${PORT}/api/auth/verify/${newVerificationToken}`;

  try {
    await new Email(user, verificationLink).sendHello();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    message: 'Verification email sent',
  });
});

module.exports = resendVerificationEmail;
