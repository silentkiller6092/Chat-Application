const { default: mongoose } = require("mongoose");
const FriendRequestSent = require("../models/inviteSent.models");
const userModel = require("../models/user.model");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");

// inviterID is the user who will receive the friend request.
// requestedID  is the user who is sending the friend request.
const sendRequest = async (req, res) => {
  const { username } = req.params;
  try {
    const ownerid = req.user._id;
    const findid = await userModel.findOne({ username: username });
    const requestedID = findid._id.toString();

    if (!requestedID) {
      return res
        .status(400)
        .json(new APIerror(400, "This user does not exist."));
    }

    // Check if there is an existing request with the same requestedID and a "pending" status
    const existingRequest = await FriendRequestSent.findOne({
      "requests.requestedID": requestedID,
      "requests.inviterID": ownerid,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json(new APIerror(400, null, "Request already sent."));
    }

    // If no existing request is found, push a new request with a "pending" status
    const sentRequest = await FriendRequestSent.updateOne(
      { inviterID: ownerid },
      {
        $push: {
          requests: {
            status: "pending",
            requestedID: requestedID,
            inviterID: ownerid,
          },
        },
      },
      {
        upsert: true,
        new: true,
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

// Check all requests received by the logged-in user.

const totalOwnerPendingRequestes = async (req, res) => {
  try {
    const findid = await FriendRequestSent.aggregate([
      {
        $match: {
          "requests.requestedID": new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $unwind: "$requests",
      },
      {
        $match: {
          "requests.requestedID": new mongoose.Types.ObjectId(req.user._id),
          "requests.status": "pending",
        },
      },
    ]);

    if (!findid || findid.length === 0) {
      return res
        .status(404)
        .json(
          new APIerror(404, null, "No requests received by the owner found.")
        );
    }

    return res.status(200).json(new APIResponse(200, findid, "Success"));
  } catch (e) {
    return res.status(500).json(new APIerror(500, null, e.message));
  }
};

const acceptRequest = async (req, res) => {
  const { username } = req.params;
  try {
    const ownerid = req.user._id;

    // Find the user by username
    const findUser = await userModel.findOne({ username: username });

    if (!findUser) {
      throw new APIerror(404, "User not found");
    }

    const requestedUserID = findUser._id.toString();
    // Update the status to "accepted" for the specified request
    const updateResult = await FriendRequestSent.updateOne(
      {
        inviterID: new mongoose.Types.ObjectId(requestedUserID),
        "requests.requestedID": ownerid,
      },
      {
        $set: {
          "requests.$.status": "accepted",
        },
      }
    );
    if (!updateResult) {
      throw new APIerror(404, "Already accepted");
    }

    return res.status(200).json(new APIResponse(200, updateResult));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const rejectRequest = async (req, res) => {
  const { username } = req.params;
  try {
    const ownerid = req.user._id;

    // Find the user by username
    const findUser = await userModel.findOne({ username: username });

    if (!findUser) {
      throw new APIerror(404, "No Request Recive by username");
    }

    const requestedUserID = findUser._id.toString();
    const updateResult = await FriendRequestSent.updateOne(
      {
        inviterID: new mongoose.Types.ObjectId(req.user._id),
        "requests.requestedID": requestedUserID,
      },
      {
        $set: {
          "requests.$.status": "pending",
        },
      }
    );

    if (!updateResult) {
      return res
        .status(400)
        .json(new APIerror(400, "Request not found or already accepted."));
    }

    return res.status(200).json(new APIResponse(200, updateResult));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};
const blockRequest = async (req, res) => {
  const { username } = req.params;
  try {
    const ownerid = req.user._id;

    // Find the user by username
    const findUser = await userModel.findOne({ username: username });

    if (!findUser) {
      throw new APIerror(400, "User doesnt exist");
    }

    const requestedUserID = findUser._id.toString();

    // Update the status to "accepted" for the specified request
    const updateResult = await FriendRequestSent.updateOne(
      {
        inviterID: new mongoose.Types.ObjectId(req.user._id),
        "requests.requestedID": requestedUserID,
      },
      {
        $set: {
          "requests.$.status": "rejected",
        },
      }
    );

    if (!updateResult) {
      return res
        .status(400)
        .json(new APIerror(400, "Request not found or already accepted."));
    }

    return res.status(200).json(new APIResponse(200, updateResult));
  } catch (e) {
    return res
      .status(500)
      .json(new APIerror(500, e.message || "Something went wrong"));
  }
};

const acceptedOwnerRequest = async (req, res) => {
  try {
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
          "requests.status": "accepted", // Corrected the status spelling
        },
      },
    ]);

    if (!findid || findid.length === 0) {
      throw new APIerror(404, "No Request yet");
    }

    // Array to store user details corresponding to each requestedID
    const users = [];

    // Iterate over each item in findid array
    for (const item of findid) {
      const requestedID = item.requests.requestedID;
      // Query the database to find user details based on requestedID
      const user = await userModel
        .findById(requestedID)
        .select("-password -avatarPublicId -createdAt -updatedAt -email");

      if (user) {
        // Push user details to users array
        users.push(user);
      }
    }

    // Return the users array as part of the response
    return res.status(200).json(new APIResponse(200, users, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

//Check all requests sent by the logged-in user (owner).
const OwnerRequestPending = async (req, res) => {
  try {
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
          "requests.status": "pending",
        },
      },
    ]);

    if (!findid || findid.length === 0) {
      return res
        .status(404)
        .json(new APIerror(404, null, "No requests sent by the owner found."));
    }

    return res.status(200).json(new APIResponse(200, findid, "Success"));
  } catch (e) {
    return res.status(500).json(new APIerror(500, null, e.message));
  }
};

module.exports = {
  sendRequest,
  totalOwnerPendingRequestes,
  acceptRequest,
  rejectRequest,
  blockRequest,
  acceptedOwnerRequest,
  OwnerRequestPending,
};
