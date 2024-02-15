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
  socket.on("chat", (chat) => {
    io.emit("chat", chat);
  });
});
server.listen(4000, () => {
  console.log("Server listening on port " + 4000);
});
