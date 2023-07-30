const User = require('../../models/userModel');
const { catchAsync } = require('../../utils');

const logout = catchAsync(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(200).json({
    msg: 'Logout successful',
  });
});

module.exports = logout;
