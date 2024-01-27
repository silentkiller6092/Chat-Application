const mongoose = require("mongoose");
const FriendRequestSentModel = new mongoose.Schema({
  requests: [
    {
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      requestedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  inviterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = FriendRequestSent = mongoose.model(
  "FriendRequestSent",
  FriendRequestSentModel
);
