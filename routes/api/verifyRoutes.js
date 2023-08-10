const { Router } = require('express');
const verifyController = require('../../controllers/verify');

const router = Router();

router.post('/verify', verifyController.resendVerificationEmail);
router.get('/verify/:verificationToken', verifyController.verify);

module.exports = router;
