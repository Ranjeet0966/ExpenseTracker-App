const express = require("express");
const userAuthentication = require("../middleware/auth");
const premiumController = require("../controllers/premium");
const router = express.Router();

router.get(
  "/showleaderboard",
  userAuthentication.authenticate,
  premiumController.showLeaderBoard
);

router.get(
  "/download",
  userAuthentication.authenticate,
  premiumController.downloadExpenses
);

router.get(
  "/alldownloadhistory",
  userAuthentication.authenticate,
  premiumController.getAllDownloadHistory
);

module.exports = router;