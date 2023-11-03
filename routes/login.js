const logInController = require("../controllers/login");
const express = require("express");
const router = express.Router();

router.post("/login", logInController.postLogIn);

module.exports = router;