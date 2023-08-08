const { Router } = require('express');

const authController = require('../../controllers/auth');
const authMiddlewares = require('../../middlewares/authMiddlewares');

const router = Router();

router.post(
  '/register',
  authMiddlewares.checkRegisterUserData,
  authController.register
);

router.post('/login', authController.login);

router.post('/logout', authMiddlewares.protect, authController.logout);

router.patch('/users/:id/subscription', authMiddlewares.updateSubscription);

router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password', authController.resetPassword);

module.exports = router;
