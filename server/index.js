const cors = require('cors');
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const settings = require("../config.json");

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
  next()
});
app.get('/', (req, res, next)=>{
  next()
})

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit("messages", msg);
    });
});

server.listen(settings.portServer, settings.server, ()=>{
    console.log("Server rodando na porta: " + settings.portServer)
})