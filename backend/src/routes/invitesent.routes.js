const express = require("express");
const {
  sendRequest,

  acceptRequest,
  rejectRequest,
  blockRequest,
  totalOwnerPendingRequestes,
  acceptedOwnerRequest,
  OwnerRequestPending,
} = require("../Controller/inviteSent.controller");
const verifyJWT = require("../middleware/Auth.middleware");
const router = express.Router();
router.route("/sendRequests/:username").post(verifyJWT, sendRequest);
router.route("/getrequestes").get(verifyJWT, totalOwnerPendingRequestes);
router.route("/acceptRequest/:username").post(verifyJWT, acceptRequest);
router.route("/rejectRequest/:username").post(verifyJWT, rejectRequest);
router.route("/blockRequest/:username").post(verifyJWT, blockRequest);
router.route("/accecptedRequestes").get(verifyJWT, acceptedOwnerRequest);
router.route("/pendingRequest").get(verifyJWT, OwnerRequestPending);
module.exports = router;
