const express = require('express');

const controller = require('../../controllers/contacts');
const {
  checkContactById,
  checkCreateContactById,
  checkUpdateContactById,
  checkUpdateContactFavorite,
} = require('../../middlewares/contactsMiddlewares');
const { protect, allowFor } = require('../../middlewares/authMiddlewares');
const current = require('../../controllers/auth/current');
const userRolesEnum = require('../../constans/userRolesEnum');

const router = express.Router();

router.use(protect);

router.get('/current', current);

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
