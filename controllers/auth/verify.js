const { catchAsync } = require('../../utils');
const verifyCode = require('../../services/userServices');

const verify = catchAsync(async (req, res) => {
  const { user } = await verifyCode(req.params);

  res.status(200).json({
    message: 'Verification successful',
    user,
  });
});

module.exports = verify;
