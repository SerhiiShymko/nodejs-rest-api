const express = require('express');

const controller = require('../../controllers/contacts');
const auth = require('../../controllers/auth');
const {
  checkContactById,
  checkCreateContactById,
  checkUpdateContactById,
  checkUpdateContactFavorite,
  uploadUserAvatar,
} = require('../../middlewares/contactsMiddlewares');
const { protect, allowFor } = require('../../middlewares/authMiddlewares');
const userRolesEnum = require('../../constans/userRolesEnum');
const { checkUserPassword } = require('../../services/userServices');

const router = express.Router();

router.use(protect);

router.get('/current', auth.current);
router.patch('/update', uploadUserAvatar, controller.updateUser);
router.patch('/update-password', checkUserPassword, controller.updatePassword);

router.use(allowFor(userRolesEnum.BUSINESS, userRolesEnum.PRO));
router
  .route('/')
  .post(checkCreateContactById, controller.addContact)
  .get(controller.getAllContacts);

router.use('/:id', checkContactById);
router
  .route('/:id')
  .get(controller.getContactById)
  .put(checkUpdateContactById, controller.updateContact)
  .delete(controller.removeContact);
router
  .route('/:id/favorite')
  .patch(checkUpdateContactFavorite, controller.updateContactFavorite);

module.exports = router;
