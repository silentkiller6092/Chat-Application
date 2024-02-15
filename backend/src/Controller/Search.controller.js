const userModel = require("../models/user.model");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");
const searchUser = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) throw new APIerror(404, "Username is required");
    const users = await userModel.find({
      $or: [
        { fullName: { $regex: userName.substring(0, 3), $options: "i" } },
        { fullName: { $regex: userName.substring(1, 4), $options: "i" } },
        { fullName: { $regex: userName.substring(2), $options: "i" } },
        { username: { $regex: userName.substring(0, 3), $options: "i" } },
        { username: { $regex: userName.substring(1, 4), $options: "i" } },
        { username: { $regex: userName.substring(2), $options: "i" } },
        { email: { $regex: userName.substring(0, 3), $options: "i" } },
        { email: { $regex: userName.substring(1, 4), $options: "i" } },
        { email: { $regex: userName.substring(2), $options: "i" } },
      ],
    });
    return res.status(200).json(new APIResponse(200, users, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};
module.exports = searchUser;
