const { Router } = require("express");

const authController = require("../../controllers/auth");
const authMiddlewares = require("../../middlewares/authMiddlewares");

const router = Router();

// signup - register new user
router.post(
  "/register",
  authMiddlewares.checkRegisterUserData,
  authController.register
);

router.post("login", authController.login);

module.exports = router;
