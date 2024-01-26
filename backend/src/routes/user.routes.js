const express = require("express");
const uploadFile = require("../middleware/multer.middleware");
const { registerUser } = require("../Controller/User.controller");
const router = express.Router();

router.route("/register").post(uploadFile.single("avatar"), registerUser);

module.exports = router;
