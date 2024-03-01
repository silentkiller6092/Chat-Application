const express = require("express");
const {
  sendRequest,

  acceptRequest,
  rejectRequest,
  blockRequest,
  totalOwnerPendingRequestes,
  acceptedOwnerRequest,
  OwnerRequestPending,
  getRequestDetail,
  following,
  folllowers,
} = require("../Controller/inviteSent.controller");
const verifyJWT = require("../middleware/Auth.middleware");
const { route } = require("./user.routes");
const router = express.Router();
router.route("/sendRequests/:username").post(verifyJWT, sendRequest);
router.route("/getrequestes").get(verifyJWT, totalOwnerPendingRequestes);
router.route("/acceptRequest/:username").post(verifyJWT, acceptRequest);
router.route("/rejectRequest/:username").post(verifyJWT, rejectRequest);
router.route("/blockRequest/:username").post(verifyJWT, blockRequest);
router.route("/accecptedRequestes").get(verifyJWT, acceptedOwnerRequest);
router.route("/pendingRequest").get(verifyJWT, OwnerRequestPending);
router.route("/requestStatus/:username").get(verifyJWT, getRequestDetail);
router.route("/following/:username").get(verifyJWT, following);
router.route("/followers/:username").get(verifyJWT, folllowers);
module.exports = router;
