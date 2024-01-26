const usermodel = require("../models/user.model");

const APIerror = require("../utils/ApiError");
const jwt = require("jsonwebtoken");

const verifyJWT = async function (req, res, next) {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new APIerror(400, "Unauthenticated request");
    }
    const decodeToekn = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await usermodel
      .findById(decodeToekn._id)
      .select("-password -refreshToken");
    if (!user) throw new APIerror(400, "Invalid token");
    req.user = user;
    next();
  } catch (e) {
    return res.status(403).json(new APIerror(400, null, e.message));
  }
};
module.exports = verifyJWT;
