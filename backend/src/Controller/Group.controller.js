const Group = require("../models/Group.models");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");

const makeGroup = async (req, res) => {
  const { groupName, isAdmin, groupDescription } = req.body;
  try {
    if (!groupName) {
      return res
        .status(404)
        .json(new APIerror(404, null, "GroupName is required"));
    }

    const ownerID = req.user._id;
    const createGroup = await Group.create({
      groupName,
      isAdmin,
      owner: ownerID,
      groupDescription,
    });
    if (!createGroup) throw new APIerror(400, null, "Unable to create group");
    return res.status(200).json(new APIResponse(200, createGroup));
  } catch (e) {
    return res
      .status(500)
      .json(new APIerror(500, null, "Something went wrong" || e.message));
  }
};
module.exports = makeGroup;
