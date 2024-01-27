const express = require("express");
const {
  sendRequest,
  getRequestes,
} = require("../Controller/inviteSent.controller");
const verifyJWT = require("../middleware/Auth.middleware");
const router = express.Router();
router.route("/sendRequests/:username").post(verifyJWT, sendRequest);
router.route("/getrequestes").get(verifyJWT, getRequestes);

module.exports = router;
