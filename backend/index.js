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

let flag = 0;
let clientIds = [];

io.on('connection', (socket) => {

  //solve douple connecting for same user with two socket ids                                                                                     
  if(flag%2 ==0){
    socket.broadcast.emit('group chat clients', socket.id);
    clientIds.push(socket.id);
  }
  flag++;
  if(flag == 1001){
    flag = 0;
  }
  io.to(socket.id).emit('init clients list',clientIds);

  // handle another requests
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
    clientIds = clientIds.filter(client => client !== socket.id);
    io.emit('init clients list',clientIds);
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});