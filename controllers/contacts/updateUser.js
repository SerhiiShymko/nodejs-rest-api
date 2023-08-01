const ImageService = require('../../services/imageService');
const { catchAsync } = require('../../utils');

const updateUser = catchAsync(async (req, res) => {
  const { user, file } = req;

  if (file) {
    user.avatar = await ImageService.save(file, null, 'images', user.id);
  }

  Object.keys(req.body).forEach(key => {
    user[key] = req.body[key];
  });

  const updatedUser = await user.save();

  res.status(200).json({
    user: updatedUser,
  });
});

module.exports = updateUser;
