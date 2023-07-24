const { Router } = require("express");

const authController = require('../../controllers/auth/')
const authMiddlewars =require('../../middlewares/authMidlewars')

const route = Router();


// signup - register new user
router.post("/signup");

// signin - login user
router.post("/login");
