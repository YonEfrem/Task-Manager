const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");

require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(require("cors")());

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("updateTasks", () => {
    io.emit("refreshTasks");
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
