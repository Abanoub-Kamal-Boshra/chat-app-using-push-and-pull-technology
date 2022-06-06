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

  console.log('user connected ', socket.id);
  socket.broadcast.emit('group chat clients', socket.id);

  socket.on('connect specific client', (socketId, mySocketId) => {
    io.to(socketId).emit('connect specific client',mySocketId);
  });

  socket.on('chat specific client', (socketId, mySocketId, msg) => {
    io.to(socketId).emit('chat specific client message',msg);
    io.to(mySocketId).emit('chat specific client message',msg);
  });

  socket.on('server group chat message', (msg) => {
    io.emit('group chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});