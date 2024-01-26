const userModel = require("../models/user.model");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");
const { uploadonCloud } = require("../utils/Cloudinary");

const registerUser = async (req, res) => {
  try {
    const { username, email, fullName, password } = req.body;

    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new APIerror(400, "All Fields required");
    }

    const existingUser = await userModel.findOne({
      $or: [{ username: username, email: email }],
    });

    if (existingUser) throw new APIerror(400, "User already exists");

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      throw new APIerror(400, "Avatar file does not exist");
    }

    const avatarCloud = await uploadonCloud(avatarLocalPath);

    if (!avatarCloud) throw new APIerror(500, "Error while uploading");

    const userCreation = await userModel.create({
      fullName: fullName,
      avatar: avatarCloud.url,
      email,
      username: username.toLowerCase(),
      password,
      avatarPublicId: avatarCloud.public_id,
    });
    const createdUser = await User.findById(userCreation._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new APIerror(
        500,
        "Something went wrong while registering the user"
      );
    }
    return res
      .status(200)
      .json(new APIResponse(200, { createdUser }, "Success"));
  } catch (error) {
    if (error instanceof APIerror) {
      return res
        .status(error.statusCode)
        .json(new APIResponse(error.statusCode, null, error.message));
    } else {
      return res
        .status(500)
        .json(new APIResponse(500, null, "Internal Server Error"));
    }
  }
};

module.exports = { registerUser };
