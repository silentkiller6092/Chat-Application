const express = require("express");
const router = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/users", router);
module.exports = app;
