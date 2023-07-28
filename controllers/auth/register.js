const { catchAsync } = require('../../utils');
const userServices = require('../../services/userServices');

const register = catchAsync(async (req, res) => {
  const { user, token } = await userServices.registerUser(req.body);

  res.status(201).json({
    user,
    token,
  });
});

module.exports = register;
