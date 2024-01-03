const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projectData')
const connectDB = require("./config/db");
const dotenv = require('dotenv')

dotenv.config()
connectDB();
const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

app.use('/auth', authRoutes)
app.use('/project', projectRoutes)
app.use('/search', projectRoutes)

const http = require('http').Server(app);
const cors = require('cors');
let users=[];
app.use(cors());
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data })
})
const PORT = process.env.PORT
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
        origin: "http://localhost:3000",
        // credentials: true,
    },
});
io.on('connection', (socket) => {
    console.log("Connected to socket.io");
    socket.on('joined',({user})=>{
        users.push(user);
        console.log(`${user.name} has joined `);
        socket.broadcast.emit('userJoined',{user: user?.category, message:users});
        // socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
  })
})
    // })
    // .catch(err => console.log('Connection Error:', err))