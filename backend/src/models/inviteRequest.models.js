const mongoose = require("mongoose");
const inviteRequestSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);
module.exports = FriendRequest = mongoose.model(
  "FriendRequest",
  inviteRequestSchema
);
