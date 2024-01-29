const express = require("express");
const verifyJWT = require("../middleware/Auth.middleware");
const makeGroup = require("../Controller/Group.controller");
const {
  addToGroup,
  removefromGroup,
  removeGroup,
} = require("../Controller/groupMembers.controller");
const router = express.Router();

router.route("/createGroup").post(verifyJWT, makeGroup);
router.route("/addMember/:username/:groupID").post(verifyJWT, addToGroup);
router
  .route("/removeMember/:username/:groupID")
  .delete(verifyJWT, removefromGroup);
router.route("/removeGroup/:groupID").delete(verifyJWT, removeGroup);
module.exports = router;
