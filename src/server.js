const express = require('express');
const server = express();
const routes = require("./routes");
const path = require("path");

// Mudar a localizção da pasta views
server.set('views', path.join(__dirname, 'views'))
// Setar a view engine
server.set('view engine', 'ejs');

console.log("Diretório: " + __dirname);

// Trazer CSS e JS - estaticos
server.use(express.static("public"));

// Usar o req.body
server.use(express.urlencoded({extended: true }));

// routes
server.use(routes);

server.listen(3000, () => console.log(">> Servidor rodando na porta 3000..."))