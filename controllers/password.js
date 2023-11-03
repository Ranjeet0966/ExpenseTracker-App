const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require("uuid");
const ForgotPasswordRequests = require("../models/forgotpassword");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");
const User = require("../models/sign-up");

exports.generateForgotPasswordLink = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const uuid = uuidv4();
      await user.createForgotpassword({
        id: uuid,
        isActive: true,
      });
      const url = `http://localhost:4000/password/resetpassword/${uuid}`;

      const client = Sib.ApiClient.instance;

      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "chaithanyakumar167@gmail.com",
        name: "expense app",
      };

      const receivers = [{ email: email }];
      await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "forgot password",
        htmlContent: `<h3>click below link to reset password</h3>
            <a href=${url}>click here</a>`,
      });
      res.status(200).json({ message: "success" });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotpasswordrequest = await ForgotPasswordRequests.findByPk(id);
    if (forgotpasswordrequest.isActive == true) {
      forgotpasswordrequest.update({ isActive: false });

      res.status(200).send(`<html>
      <script>
          function formsubmitted(e){
              e.preventDefault();
              console.log('called')
          }
      </script>

      <form action="/password/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
      </form>
     </html>`);
      res.end();
    } else {
      throw new Error("link expired");
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { id } = req.params;
    const resetpasswordrequest = await ForgotPasswordRequests.findOne({
      where: { id: id },
    });

    const user = await User.findOne({
      where: { id: resetpasswordrequest.userId },
    });

    if (user) {
      const saltRounds = 10;
      bcrypt.hash(newpassword, saltRounds, async (err, hash) => {
        // Store hash in your password DB.
        if (err) {
          throw new Error(err);
        }
        await user.update({ password: hash });
        res
          .status(201)
          .json({ message: "Successfuly update the new password" });
      });
      //   bcrypt.genSalt(saltRounds, async (err, salt) => {
      //     if (err) {
      //       throw new Error(err);
      //     }
      //   });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};
