const express = require("express");
const uploadFile = require("../middleware/multer.middleware");
const {
  registerUser,
  loginuser,
  logout,
} = require("../Controller/User.controller");
const verifyJWT = require("../middleware/Auth.middleware");
const router = express.Router();

router.route("/register").post(uploadFile.single("avatar"), registerUser);
router.route("/login").post(loginuser);
router.route("/logout").post(verifyJWT, logout);

module.exports = router;
