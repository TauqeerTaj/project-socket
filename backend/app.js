const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projectData");
const messageRoutes = require("./routes/messages")
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();
connectDB();
const app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/project", projectRoutes);
app.use("/search", projectRoutes);
app.use("/messages", messageRoutes);

const http = require("http").Server(app);
const cors = require("cors");
let users = [{}];
app.use(cors());
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
const PORT = process.env.PORT;
const CORS_PORT = process.env.CORS_PORT
// const MongoConnect = process.env.MongoURI
const server = http.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
// mongoose.connect(MongoConnect)
//     .then(result => {
// const server = http.listen(PORT);
// const socketIO = require('./socket').init(server);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: CORS_PORT,
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userJoined", {
      message: ` ${users[socket.id]} has joined`,
    });
    //   socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
  });

  socket.on("message", ({ message, id }) => {
    console.log("messageid:", message);
    // io.to(id).emit('sendMessage',message);
    socket.broadcast.emit("sendMessage", message);
  });

  socket.on("disconn", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]}  has left`,
    });
    console.log(`user left`);
  });
});
// })
// .catch(err => console.log('Connection Error:', err))
