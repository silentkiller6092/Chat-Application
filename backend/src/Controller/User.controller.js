const userModel = require("../models/user.model");
const APIResponse = require("../utils/APiResponse");
const APIerror = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const { uploadonCloud } = require("../utils/Cloudinary");
const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (error) {
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

    if (existingUser) {
      throw new APIerror(401, "User Already Exists");
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      throw new APIerror(404, "Avatar Required");
    }

    const avatarCloud = await uploadonCloud(avatarLocalPath);

    if (!avatarCloud) {
      throw new APIerror(500, "Error while uploading");
    }

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
      throw new APIerror(404, "Unable to create user");
    }

    return res
      .status(200)
      .json(new APIResponse(200, { createdUser }, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const loginuser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email && !username) throw new APIerror(400, "Fields can't be empty");
    const userCheck = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (!userCheck) throw new APIerror(404, "User does not exist");
    const isPasswordCorrect = await userCheck.ispasswordCorrect(password);
    if (!isPasswordCorrect) throw new APIerror(400, "Incorrect password");

    const loggedinuser = await userModel
      .findById(userCheck._id)
      .select("-password -refreshToken");

    const { accessToken, refreshToken } =
      await generateAccessTokenandRefreshToken(userCheck._id);

    const optionsAccessToken = {
      sameSite: "None",
      httpOnly: true,
      secure: true,
    };
    const optionsRefreshToken = {
      sameSite: "None",
      httpOnly: true,
      secure: true,
    };
    if (process.env.NODE_ENV === "production") {
      optionsAccessToken.secure = true;
      optionsRefreshToken.secure = true;
    }
    const expirationTimeAccessToken = new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000
    );
    optionsAccessToken.expires = expirationTimeAccessToken;
    const expirationTimeRefreshToken = new Date(
      Date.now() + 20 * 24 * 60 * 60 * 1000
    );
    optionsRefreshToken.expires = expirationTimeRefreshToken;

    res.cookie("accessToken", accessToken, optionsAccessToken);
    res.cookie("refreshToken", refreshToken, optionsRefreshToken);

    return res.json(new APIResponse(200, loggedinuser));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const cookiesLogin = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new APIerror(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOEKN_SECRET
    );
    const user = await userModel.findById(decodedToken?._id);
    if (!user) {
      throw new APIerror(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new APIerror(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } =
      await generateAccessTokenandRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new APIResponse(
          200,
          { accessToken, refreshToken: refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    const userLogout = await userModel.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new APIResponse(200, userLogout, "Success"));
  } catch (e) {
    return res.status(500).json(new APIerror(500, null, e.message));
  }
};

const currentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) throw new APIerror(401, "Not logged in");
    const userDetails = await userModel.findById(userId);

    return res
      .status(200)
      .json(new APIResponse(200, { userDetails }, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) throw new APIerror(401, "Not logged in");
    const userDetails = await userModel.find({ username: username });

    return res
      .status(200)
      .json(new APIResponse(200, { userDetails }, "Success"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new APIerror(error.statusCode || 500, null, error.message));
  }
};
const updateDeatils = async (req, res) => {
  // TODO: add the controller to add update details feature
};
module.exports = {
  registerUser,
  loginuser,
  logout,
  currentUser,
  getUserByUsername,
  cookiesLogin,
};
