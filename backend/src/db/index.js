const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/ChatApplication`
    );
    console.log(`connected to ${connectionInstance.connection.host}`);
  } catch (e) {
    console.log("Error while connecting to MongoDB", e.message);
    process.exit(1);
  }
};
module.exports = connectDB;
