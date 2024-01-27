const mongoose = require("mongoose");
const groupMembersSchema = new mongoose.model(
  {
    Group: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    Members: {
      type: mongoose.Types.ObjectId,
      ref: "PrivateChatModel.privatePeoples",
    },
  },
  { timestamps: true }
);
module.exports = GroupMembers = mongoose.model(
  "GroupMembers",
  groupMembersSchema
);
