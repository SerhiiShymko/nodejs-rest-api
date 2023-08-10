const { catchAsync } = require('../../utils');
const {
  getUserByEmail,
  createPasswordResetToken,
} = require('../../services/userServices');

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

  // const verificationLink = `http://localhost:3000/users/verify/${newVerificationToken}`;

  // Відправка листа з посиланням для верифікації на вказаний email

  res.status(200).json({
    message: 'Verification email sent',
  });
});

module.exports = resendVerificationEmail;
