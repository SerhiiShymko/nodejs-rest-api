const { catchAsync } = require('../../utils');
const { registerUser } = require('../../services/userServices');
const Email = require('../../services/emailService');

const register = catchAsync(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  try {
    await new Email(user, 'localhost:3000').sendHello();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    user,
    token,
  });
});

module.exports = register;
