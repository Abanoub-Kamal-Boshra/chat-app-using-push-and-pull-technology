const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  } 
});

io.on('connection', (socket) => {

  io.emit('group chat clients', socket.id);

  socket.on('connect specific client', (socketId, mySocketId) => {
    io.to(socketId).emit(mySocketId);
    // console.log('call with: ', socketId);
  });

  socket.on('chat specific client', (socketId, msg) => {
    io.to(socketId).emit(msg);
    // console.log('call with: ', socketId);
  });

  socket.on('server group chat message', (msg) => {
    io.emit('group chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});