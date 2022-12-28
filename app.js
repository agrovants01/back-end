const express = require("express");

require("dotenv").config();

const app = express();

const Server = require("./model/server");
const server = new Server();
app.use(express.static("public"));
server.listen();
