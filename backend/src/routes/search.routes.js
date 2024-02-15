const express = require("express");
const searchUser = require("../Controller/Search.controller");
const verifyJWT = require("../middleware/Auth.middleware");
const router = express.Router();
router.route("/:userName").post(searchUser);
router.route("/searchUser/:userName").post(verifyJWT, searchUser);
module.exports = router;
