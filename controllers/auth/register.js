const { catchAsync } = require('../../utils');
const { registerUser } = require('../../services/userServices');
const Email = require('../../services/emailService');

const register = catchAsync(async (req, res) => {
  const { user, token, verificationToken } = await registerUser(req.body);

  try {
    await new Email(
      user,
      `http://localhost:3000/api/verify/${verificationToken}`
    ).sendHello();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    user,
    token,
    verificationToken,
  });
});

module.exports = register;
