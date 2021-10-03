const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require("body-parser");
const settings = require('./config.json')

let clientes = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/chat", (req, res) => {
  console.log(clientes.indexOf(req.query.name) == -1)
  if (clientes.indexOf(req.query.name) == -1) {
    res.render("chat", {
      name: req.query.name
    })
  }else{
    res.send("Usuário já logado")
  }
});


io.on('connection', (socket) => {
  let name = socket.handshake.query.name;
  console.log(name);
  clientes.push(name);
  console.log(clientes)

  socket.broadcast.emit("newConnection", name)
  socket.on('chat message', (data) => {
    console.log(data)
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log(`${name} desconectou`)
    socket.broadcast.emit('userDisconnect', name)
    let indice = clientes.indexOf(name);
    clientes.slice(indice, indice);
  })

});


server.listen(3000, () => {
  console.log("listening on " + 3000);
});
