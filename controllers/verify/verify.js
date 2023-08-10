const { catchAsync } = require('../../utils');
const verifyToken = require('../../services/userServices');

const verify = catchAsync(async (req, res) => {
  const { user } = await verifyToken(req.params);

  res.status(200).json({
    message: 'Verification successful',
    user,
  });
});

module.exports = verify;
