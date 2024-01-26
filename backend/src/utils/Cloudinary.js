const cloudinary = require("cloudinary");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});
const uploadonCloud = async (localPath) => {
  try {
    if (!localPath) return "File nor Found";
    const response = await cloudinary.uploader.upload(localPath, {
      responseType: "auto",
    });
    fs.unlinkSync(localPath);
    return response;
  } catch (e) {
    fs.unlinkSync(localPath);
  }
};

const deleteonCloud = async (publicid) => {
  try {
    if (!publicid) return "Public id not found";
    const deletresponse = await cloudinary.uploader.destroy(publicid, {
      resource_type: "video",
    });
    return deletresponse;
  } catch (e) {
    return e.message;
  }
};
module.exports = { uploadonCloud, deleteonCloud };
