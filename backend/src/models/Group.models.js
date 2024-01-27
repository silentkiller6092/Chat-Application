const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "GroupMembers",
      },
    ],
    groupDescription: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = Group = mongoose.model("Group", groupSchema);
