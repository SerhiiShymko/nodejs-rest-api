const catchAsync = require('../../utils/catchAsync');
const { loginUser } = require('../../services/userServices');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const loginData = { email, password };

  const { user, token } = await loginUser(loginData);

  res.status(200).json({
    user,
    token,
  });
});

module.exports = login;
