const { catchAsync } = require('../../utils');
// const verifyToken = require('../../services/userServices');
const User = require('../../models/userModel');

const verify = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  user.verify = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({
    message: 'Verification successful',
  });
});

module.exports = verify;
