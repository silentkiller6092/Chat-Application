const app = require("express")();
const server = require("http").createServer(app);
const connectDB = require("./src/db/index.js");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
connectDB();
io.on("connection", (socket) => {
  console.log("Estalishing connection");
  socket.on("chat", (chat) => {
    io.emit("chat", chat);
  });
});
server.listen(3000, () => {
  console.log("Server listening on port " + 3000);
});
