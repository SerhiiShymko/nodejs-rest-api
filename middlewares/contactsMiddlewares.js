const { AppError, catchAsync, contactsValidators } = require('../utils');
const contactService = require('../services/contactServices');
const ImageService = require('../services/imageService');
const userService = require('../services/userServices');

/**
 * Check user exists in db by id middleware.
 */
exports.checkContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await contactService.contactExistsById(id);

  next();
});

exports.checkCreateContactById = catchAsync(async (req, res, next) => {
  const { error, value } = contactsValidators.createContactDataValidator(
    req.body
  );

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid contact data..');
  }

  await contactService.contactExists({ email: value.email });

  req.body = value;

  next();
});

exports.checkUpdateContactById = catchAsync(async (req, res, next) => {
  const { error, value } = contactsValidators.updateContactDataValidator(
    req.body
  );

  await contactService.contactExists({
    email: value.email,
    _id: { $ne: req.params.id },
  });

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid contact data..');
  }

  req.body = value;

  next();
});

exports.checkUpdateContactFavorite = catchAsync(async (req, res, next) => {
  const { error, value } = contactsValidators.updateContactDataValidator(
    req.body
  );

  await contactService.contactExists({
    email: value.email,
    _id: { $ne: req.params.id },
  });

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid contact data..');
  }

  req.body = value;

  next();
});

// MULTER example
// config multer storage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cbk) => {
//     cbk(null, 'public/img');
//   },
//   filename: (req, file, cbk) => {
//     const extension = file.mimetype.split('/')[1]; // jpeg/jpg/png/gif

//     cbk(null, `${req.user.id}-${uuid()}.${extension}`);
//   },
// });

// // config multer filter
// const multerFilter = (req, file, cbk) => {
//   // 'image/*'
//   if (file.mimetype.startsWith('image/')) {
//     cbk(null, true);
//   } else {
//     cbk(new AppError(400, 'Please upload image only!'), false);
//   }
// };

// exports.uploadUserAvatar = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: {
//     fileSize: 1 * 1024 * 1024,
//   },
// }).single('avatar');

exports.uploadUserAvatar = ImageService.initUploadMiddleware('avatar');

exports.checkPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // validate new password

  await userService.checkPassword(req.user.id, currentPassword, newPassword);
});
