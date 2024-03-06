const express = require("express");
const router = express.Router();
const uploadFile = require("../middleware/multer.middleware");
const {
  registerUser,
  loginuser,
  logout,
  currentUser,
  getUserByUsername,
  cookiesLogin,
} = require("../Controller/User.controller");
const verifyJWT = require("../middleware/Auth.middleware");

router.route("/register").post(uploadFile.single("avatar"), registerUser);
router.route("/login").post(loginuser);
router.route("/logout").post(verifyJWT, logout);
router.route("/getCurrentUser").get(verifyJWT, currentUser);
router.route("/user/:username").get(verifyJWT, getUserByUsername);
router.route("/autologin").post(verifyJWT, cookiesLogin);

module.exports = router;
