const express = require("express");
const verifyJWT = require("../middleware/Auth.middleware");
const makeGroup = require("../Controller/Group.controller");
const router = express.Router();

router.route("/createGroup").post(verifyJWT, makeGroup);

module.exports = router;
