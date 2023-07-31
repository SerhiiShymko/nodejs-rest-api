const { catchAsync } = require('../../utils');
const { registerUser } = require('../../services/userServices');

const register = catchAsync(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  res.status(201).json({
    user,
    token,
  });
});

module.exports = register;
