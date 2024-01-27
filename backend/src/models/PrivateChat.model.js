const mongoose = require("mongoose");

const privateChatSchema = new mongoose.Schema(
  {
    inviterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendRequestSent.inviterID",
    },
    acceptedInvitations: [
      {
        requestedID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FriendRequestSent.requests.requestedID",
        },
      },
    ],
  },
  { timestamps: true }
);

const PrivateChat = mongoose.model("PrivateChat", privateChatSchema);

module.exports = PrivateChat;
