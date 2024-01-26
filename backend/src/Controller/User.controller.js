const userModel = require("../models/user.model");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");
const { uploadonCloud } = require("../utils/Cloudinary");
const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (e) {
    throw new APIerror(500, "Something went wrong");
  }
};

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
    return res
      .status(500)
      .json(new APIerror(500, "Internal Server Error" || error.message));
  }
};

const loginuser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    if (!(email || username)) throw new APIerror(400, "Fields can't be empty");
    const userCHek = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (!userCHek) throw new APIerror(404, "User does not exist");
    const isPasswordCorrt = await userCHek.ispasswordCorrect(password);
    if (!isPasswordCorrt) throw new APIerror(400, "Incorrect password");
    const loggedinuser = await userModel
      .findById(userCHek._id)
      .select("-password -refreshToken");
    const { accessToken, refreshToken } =
      await generateAccessTokenandRefreshToken(userCHek._id.toString());

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .cookie("accessToken", await accessToken, options)
      .cookie("refreshToken", await refreshToken, options)
      .json(new APIResponse(200, loggedinuser));
  } catch (e) {
    return res
      .status(500)
      .json(new APIerror(500, null, "Internal Server Error" || error.message));
  }
};

module.exports = { registerUser, loginuser };
