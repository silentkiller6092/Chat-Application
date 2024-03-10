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
    const requestedUsername = findid.username;
    if (!requestedID) {
      throw new APIerror(404, "User not found");
    }
    const existingRequest = await FriendRequestSent.findOne({
      "requests.requestedID": requestedID,
      "requests.inviterID": ownerid,
    });

    if (existingRequest) {
      throw new APIerror(408, "Request already sent");
    }
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
      throw new APIerror(401, "Some Error occurred while Sedning request");
    }

    const responseData = {
      username: requestedUsername,
      ...sentRequest,
    };

    return res.status(200).json(new APIResponse(200, responseData, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const totalOwnerPendingRequestes = async (req, res) => {
  try {
    const findid = await FriendRequestSent.aggregate([
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
      throw new APIerror(400, "No Pednding request");
    }
    const users = [];

    // Iterate over each item in findid array
    for (const item of findid) {
      const requestedID = item.requests.requestedID;
      // Query the database to find user details based on requestedID
      const user = await userModel
        .findById(requestedID)
        .select("-password -avatarPublicId -updatedAt ");

      if (user) {
        // Push user details to users array
        users.push(user);
      }
    }
    return res.status(200).json(new APIResponse(200, findid, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
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
    const updateResult = await FriendRequestSent.updateOne(
      {
        inviterID: new mongoose.Types.ObjectId(requestedUserID),
        "requests.requestedID": new mongoose.Types.ObjectId(ownerid),
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

// Get followings
const following = async (req, res) => {
  const { username } = req.params;
  try {
    const findUser = await userModel.findOne({ username: username });

    if (!findUser) {
      throw new APIerror(404, "User not found");
    }
    const requestedUserID = findUser._id.toString();
    const updateResult = await FriendRequestSent.aggregate([
      {
        $unwind: {
          path: "$requests",
        },
      },
      {
        $match: {
          "requests.requestedID": new mongoose.Types.ObjectId(requestedUserID),
          "requests.status": "accepted",
        },
      },
    ]);

    if (!updateResult) {
      throw new APIerror(404, "Already accepted");
    }
    const updatedData = await FriendRequestSent.findOne({
      "requests.requestedID": requestedUserID,
    });
    return res.status(200).json(new APIResponse(200, updateResult));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

// Get followers
const folllowers = async (req, res) => {
  const { username } = req.params;
  try {
    const findUser = await userModel.findOne({ username: username });

    if (!findUser) {
      throw new APIerror(404, "User not found");
    }
    const requestedUserID = findUser._id.toString();
    const updateResult = await FriendRequestSent.aggregate([
      {
        $unwind: {
          path: "$requests",
        },
      },
      {
        $match: {
          "requests.inviterID": new mongoose.Types.ObjectId(requestedUserID),
          "requests.status": "accepted",
        },
      },
    ]);

    if (!updateResult) {
      throw new APIerror(404, "Already accepted");
    }
    const updatedData = await FriendRequestSent.findOne({
      "requests.requestedID": requestedUserID,
    });
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
      throw new APIerror(400, "Already Requeste Rejected by user");
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
      throw new APIerror(400, "Request Not Found or Already Blocked");
    }

    return res.status(200).json(new APIResponse(200, updateResult));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const acceptedOwnerRequest = async (req, res) => {
  try {
    const findid = await FriendRequestSent.aggregate([
      {
        $match: {
          "requests.requestedID": new mongoose.Types.ObjectId(req.user._id), // Match where the requestedID matches the current user's ID
          "requests.status": "accepted", // Match where the request status is "accepted"
        },
      },
      {
        $unwind: "$requests",
      },
      {
        $match: {
          "requests.requestedID": new mongoose.Types.ObjectId(req.user._id), // Match where the requestedID matches the current user's ID
          "requests.status": "accepted", // Match where the request status is "accepted"
        },
      },
    ]);

    if (!findid || findid.length === 0) {
      throw new APIerror(400, "No Request yet");
    }

    // Array to store user details corresponding to each requestedID
    const users = [];

    // Iterate over each item in findid array
    for (const item of findid) {
      const requestedID = item.requests.inviterID;
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
      throw new APIerror(400, "You haven't made any requests");
    }
    const users = [];
    for (const item of findid) {
      const requestedID = item.requests.requestedID;
      // Query the database to find user details based on requestedID
      const user = await userModel
        .findById(requestedID)
        .select("-password -avatarPublicId -updatedAt");
      if (user) {
        users.push(user);
      }
    }
    return res.status(200).json(new APIResponse(200, users, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};
const currentUserFollwer = async (req, res) => {
  try {
    const findid = await FriendRequestSent.aggregate([
      {
        $match: {
          inviterID: new mongoose.Types.ObjectId(req.user._id),
          "requests.status": "accepted", // This matches documents where any request has status "accepted"
        },
      },
      {
        $unwind: "$requests",
      },
      {
        $match: {
          "requests.status": "accepted", // This matches individual requests with status "accepted"
        },
      },
    ]);
    if (!findid || findid.length === 0) {
      throw new APIerror(400, "No Request Received");
    }
    const users = [];
    for (const item of findid) {
      const requestedID = item.requests.requestedID;
      // Query the database to find user details based on requestedID
      const user = await userModel
        .findById(requestedID)
        .select("-password -avatarPublicId -updatedAt");
      if (user) {
        users.push(user);
      }
    }
    return res.status(200).json(new APIResponse(200, users, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const getRequestDetail = async (req, res) => {
  const { username } = req.params;
  try {
    // Find the user by username
    const findUser = await userModel.findOne({ username: username });

    if (!findUser) {
      throw new APIerror(404, "User not found");
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
          "requests.requestedID": new mongoose.Types.ObjectId(requestedUserID),
        },
      },
    ]);

    if (!findid) {
      throw new APIerror(404, "Already accepted");
    }

    return res.status(200).json(new APIResponse(200, findid, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
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
  getRequestDetail,
  following,
  folllowers,
  currentUserFollwer,
};
