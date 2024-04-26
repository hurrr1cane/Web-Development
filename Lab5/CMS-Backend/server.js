require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 8080;

const {connectionHandler} = require("./service/socketService");

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });



connectDB();

// Cross Origin Resource Sharing
app.use(cors());

// built-in middleware for json
app.use(express.json());


// Routes
app.use("/api/students", require("./routes/api/students"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/rooms", require("./routes/api/messenger"));
io.on("connection", (socket) => connectionHandler(socket, io));

// Error handling for 404
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
