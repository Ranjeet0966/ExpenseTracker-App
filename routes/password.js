const passwordController = require("../controllers/password");
const express = require("express");
const router = express.Router();

router.post("/forgotpassword", passwordController.generateForgotPasswordLink);

router.get("/resetpassword/:id", passwordController.resetPassword);

router.get("/updatepassword/:id", passwordController.updatePassword);

module.exports = router;