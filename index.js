const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require("body-parser");
const settings = require('./config.json')

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let clients = [];

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/chat", (req, res) => {
  res.render("chat", {
    name: req.query.name
  })
});


io.on('connection', (socket) => {
  // clients.push(socket)
  // let name = socket.handshake.query.name;
  // clients.push({name: name})
  socket.on('chat message', (data) => {
    console.log(data)
    io.emit('chat message', data);
  });
});


server.listen(settings.portServer, settings.server, () => {
  console.log("listening on "+settings.portServer);
});
