const app = require("./app.js");
const server = require("http").createServer(app);
const connectDB = require("./db/index.js");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
connectDB();
io.on("connection", (socket) => {
  socket.on("setup", (userdata) => {
    // socket.broadcast.emit("chat", chat);
    socket.join(userdata.recipientId);
    socket.emit("connected");
  });
  socket.on("joinedChat", (room) => {
    socket.join(room);
  });
  socket.on("newMessage", (newMessageRecived) => {
    let chat = newMessageRecived;
    console.log(chat);
  });
});

server.listen(4000, () => {
  console.log("Server listening on port " + 4000);
});
