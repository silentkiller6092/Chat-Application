const express = require("express");
const userrouter = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const grouprouter = require("./routes/group.routes");
const sendrequestrouter = require("./routes/invitesent.routes");
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/users", userrouter);
app.use("/api/v1/group", grouprouter);
app.use("/api/v1/sendRequest", sendrequestrouter);
module.exports = app;
