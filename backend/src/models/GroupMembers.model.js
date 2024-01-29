const mongoose = require("mongoose");

const groupMembersSchema = new mongoose.Schema(
  {
    Group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Members: [
      {
        isAdmin: {
          type: Boolean,
          default: false,
        },
        memberID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FriendRequestSent.requests.requestedID",
        },
      },
    ],
  },
  { timestamps: true }
);

const GroupMembers = mongoose.model("GroupMembers", groupMembersSchema);

module.exports = GroupMembers;
