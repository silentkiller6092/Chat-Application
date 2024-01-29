const GroupModels = require("../models/Group.models");
const GroupMembersModel = require("../models/GroupMembers.model");
const FriendRequestSent = require("../models/inviteSent.models");
const userModel = require("../models/user.model");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");
const mongoose = require("mongoose");
const addToGroup = async (req, res) => {
  const { username, groupID } = req.params;
  try {
    const findUser = await userModel.findOne({ username: username });

    if (!findUser) {
      return res
        .status(400)
        .json(new APIerror(400, null, "This user does not exist."));
    }

    const requestedUserID = findUser._id.toString();
    const findid = await FriendRequestSent.aggregate([
      {
        $match: {
          inviterID: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $unwind: "$requests",
      },
      {
        $match: {
          "requests.inviterID": new mongoose.Types.ObjectId(req.user._id),
          "requests.requestedID": requestedUserID,
          "requests.status": "accepted",
        },
      },
    ]);
    if (findid) {
      const addGroup = await GroupMembersModel.updateOne(
        { Group: groupID },
        {
          $set: { owner: req.user._id }, // Set owner if Group matches
          $addToSet: {
            Members: {
              memberID: requestedUserID,
            },
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      return res.status(200).json(new APIResponse(200, addGroup, "Success"));
    } else {
      return res
        .status(400)
        .json(new APIerror(400, "This member is not part of your Friend"));
    }
  } catch (e) {
    return res
      .status(500)
      .json(new APIerror(500, null, e.message || "Something went wrong"));
  }
};

const removefromGroup = async (req, res) => {
  const { username, groupID } = req.params;
  try {
    const findUser = await userModel.findOne({ username: username });
    if (!findUser) {
      return res
        .status(400)
        .json(new APIerror(400, null, "This user does not exist."));
    }

    const requestedUserID = findUser._id.toString();

    const result = await GroupMembersModel.updateOne(
      {
        Group: groupID,
        "Members.memberID": requestedUserID,
      },
      {
        $pull: {
          Members: { memberID: requestedUserID },
        },
      }
    );
    if (!result)
      return res.status(404).json(new APIerror(404, null, "Unable to remove"));
    return res
      .status(200)
      .json(new APIResponse(200, result, "Successfully removed"));
  } catch (e) {
    return res
      .status(500)
      .json(new APIerror(500, null, e.message || "Something went wrong"));
  }
};

const removeGroup = async (req, res) => {
  const { groupID } = req.params;
  try {
    const deleteGroup = await GroupModels.deleteOne({
      _id: new mongoose.Types.ObjectId(groupID),
    });

    if (deleteGroup.deletedCount == 1) {
      const deleteMembers = await GroupMembersModel.deleteMany({
        Group: new mongoose.Types.ObjectId(groupID),
      });
      return res
        .status(200)
        .json(new APIResponse(200, deleteMembers, "Success"));
    } else {
      return res
        .status(404)
        .json(new APIerror(404, null, "Group Doesnt exists"));
    }
  } catch (e) {
    return res
      .status(500)
      .json(new APIerror(500, null, e.message || "Something went wrong"));
  }
};
module.exports = { addToGroup, removefromGroup, removeGroup };
