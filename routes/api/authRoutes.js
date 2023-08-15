const { Router } = require('express');

const authController = require('../../controllers/auth');
const authMiddlewares = require('../../middlewares/authMiddlewares');

const router = Router();

router.post(
  '/register',
  authMiddlewares.checkRegisterUserData,
  authController.register
);

router.get('/verify/:verificationToken', authController.verify);

router.post('/verify', authController.resendVerificationEmail);

router.post('/login', authController.login);

router.post('/logout', authMiddlewares.protect, authController.logout);

router.patch('/:id/subscription', authMiddlewares.updateSubscription);

router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password/:otp', authController.resetPassword);

module.exports = router;
