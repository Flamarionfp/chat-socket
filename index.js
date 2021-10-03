const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require("body-parser");
const settings = require("./config.json");

let clientes = [];

function isClientLogged(name){
  return clientes.indexOf(name) >= 0
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index", {msg: ''});
});

app.get("/chat", (req, res) => {
  console.log(clientes.indexOf(req.query.name) == -1);
  if (!isClientLogged(req.query.name)) {
    res.render("chat", {
      name: req.query.name,
    });
  } else {
    res.render('index', {
      msg: 'Usuário já logado!'
    })
  }
});

io.on("connection", (socket) => {
  let name = socket.handshake.query.name;
  
  if(!isClientLogged(name)){
    clientes.push(name);
    console.log(`${name} conectou`);
    socket.broadcast.emit("newConnection", name);
  }else{
    socket.disconnect(true);
  }
  console.log(clientes);

  

  socket.on("chat message", (data) => {
    console.log(data);
    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    console.log(`${name} desconectou`);
    socket.broadcast.emit("userDisconnect", name);
    let indiceName = clientes.indexOf(name);
    clientes.splice(indiceName, 1);
    console.log(clientes);
  });
});

//Just on Development
function removeAllClients() {
  let x;
  while (clientes.length < x) {
    clientes.pop();
    x++;
  }
}

server.listen(settings.portServer, () => {
  console.log("listening on " + settings.portServer);
});
