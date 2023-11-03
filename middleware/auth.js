const jwt = require("jsonwebtoken");
const SignUp = require("../models/sign-up");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const { userId } = jwt.verify(token, "1234567890");
    console.log('userID >>>>', userId);
    const user = await SignUp.findByPk(userId);
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

