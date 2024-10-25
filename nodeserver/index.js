// Node Server which will handle socket io connections.
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",  // Replace with your client's URL if different
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on("connection", socket => {
    socket.on("new-user-joined", name => {
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});