const APIerror = require("../utils/ApiError");

const addToGroup = async (req, res) => {
  try {
  } catch (e) {
    return res
      .status(500)
      .json(new APIerror(500, null, "Something went wrong" || e.message));
  }
};
