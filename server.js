const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require("body-parser");
const settings = require("./config.json");
require("dotenv").config();

const { PORT_SERVER } = process.env;

let clientes = [];

function isClientLogged(name) {
  return clientes.indexOf(name) >= 0;
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index", { msg: "" });
});

app.get("/chat", (req, res) => {
  console.log(clientes.indexOf(req.query.name) == -1);
  if (!isClientLogged(req.query.name)) {
    res.render("chat", {
      name: req.query.name,
    });
  } else {
    res.render("index", {
      msg: "Usuário já logado!",
    });
  }
});

io.on("connection", (socket) => {
  let name = socket.handshake.query.name;
  if (!isClientLogged(name)) {
    clientes.push(name);
    socket.broadcast.emit("newConnection", name);
    io.emit("online-users", clientes);
  } else {
    socket.disconnect(true);
  }
  console.log(clientes);

  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("userDisconnect", name);
    let indiceName = clientes.indexOf(name);
    clientes.splice(indiceName, 1);
    console.log(clientes);
  });
});

server.listen(PORT_SERVER, () => {
  console.log(`Listening on ${PORT_SERVER}`);
});
