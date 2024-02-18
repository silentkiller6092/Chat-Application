const app = require("./app.js");
const server = require("http").createServer(app);
const connectDB = require("./db/index.js");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
connectDB();
let users = [];
let userRooms = {}; // Object to store user-room associations

io.on("connection", (socket) => {
  socket.on("addUser", (userID) => {
    const existingUser = users.find((user) => user.userID === userID);
    if (existingUser) {
      existingUser.socketID = socket.id;
    } else {
      const user = { userID: userID, socketID: socket.id };
      users.push(user);
    }
    io.emit("getUser", users);
  });

  socket.on("new User", (userID, currentUser) => {
    const sortedIds = [userID, currentUser].sort().join("_");
    const roomName = `room_${sortedIds}`;
    userRooms[userID] = roomName; // Associate user with room
    socket.join(roomName);
  });

  socket.on("sendMessage", (message) => {
    const roomName = userRooms[message.recipientId];
    if (roomName && roomName === userRooms[message.recipientId]) {
      io.to(roomName).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketID !== socket.id);
    io.emit("getUser", users);
  });
});

server.listen(4000, () => {
  console.log("Server listening on port " + 4000);
});
