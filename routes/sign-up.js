const signUpController = require("../controllers/sign-up");
const express = require("express");
const router = express.Router();

router.post("/sign-up", signUpController.postSignUp);

module.exports = router;