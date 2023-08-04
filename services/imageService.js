const multer = require('multer');
// const sharp = require('sharp');
const jimp = require('jimp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const { AppError } = require('../utils');

class ImageService {
  static InitUploadMiddleware(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith('image/')) {
        cbk(null, true);
      } else {
        cbk(new AppError(400, 'Please upload image only!'), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, options, ...pathSegments) {
    if (file.size > (options?.limit || 1 * 1024 * 1024)) {
      throw new AppError(400, 'File is too large');
    }

    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

    await fse.ensureDir(fullFilePath);
    // sharp
    // await sharp(file.buffer)
    //   .resize(options || { height: 250, width: 250 })
    //   .toFormat('jpeg')
    //   .jpeg({ quality: 90 })
    //   .toFile(path.join(fullFilePath, fileName));

    // jimp
    const avatar = await jimp.read(file.buffer);
    await avatar
      .cover(options.width || 250, options.heigth || 250)
      .quality(90)
      .writeAsync(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;

/** Jimp
 const avatar = await jimp.read(file.buffer)'
 await avatar
    .cover(options.width || 250, options.heigth || 250)
    .quality(90)
    .writeAsync(path.join(fullFilePath, fileName));
 */
