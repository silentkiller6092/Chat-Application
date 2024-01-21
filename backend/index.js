const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());

const io = socketIO(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // Adjust the origin to your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client Connection established");

  socket.on("message", (message) => {
    console.log(`Received ${message}`);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening on", port);
});
