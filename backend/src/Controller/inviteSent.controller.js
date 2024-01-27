const { default: mongoose } = require("mongoose");
const FriendRequestSent = require("../models/inviteSent.models");
const userModel = require("../models/user.model");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");

const sendRequest = async (req, res) => {
  const { username } = req.params;
  try {
    const ownerid = req.user._id;
    const findid = await userModel.findOne({ username: username });
    const requestid = findid._id.toString();
    if (!requestid) {
      return res
        .status(400)
        .json(new APIerror(400, "This user does not exist."));
    }
    const sentRequest = await FriendRequestSent.updateOne(
      { inviterID: ownerid },
      {
        $push: {
          requests: {
            status: "pending",
            requestedID: requestid,
            inviterID: ownerid,
          },
        },
      },
      {
        upsert: true,
      }
    );
    if (!sentRequest) {
      return res
        .status(500)
        .json(new APIerror(500, "Some error occurred while sending request."));
    }
    return res.status(200).json(new APIResponse(200, sentRequest, "Success"));
  } catch (e) {
    return res.status(500).json(new APIerror(500, null, e.message));
  }
};

const getRequestes = async (req, res) => {
  try {
    const findid = await FriendRequestSent.find(
      { "requests.requestedID": new mongoose.Types.ObjectId(req.user._id) },
      {
        requests: {
          $elemMatch: {
            requestedID: new mongoose.Types.ObjectId(req.user._id),
          },
        },
      }
    );
    if (!findid)
      return res.status(500).json(new APIerror(404, "no request found"));
    return res.status(200).json(new APIResponse(200, findid, "Success"));
  } catch (e) {
    return res.status(500).json(new APIerror(500, null, e.message));
  }
};
module.exports = { sendRequest, getRequestes };
