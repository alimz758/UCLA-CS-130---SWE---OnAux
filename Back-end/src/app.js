//importing modules
const express = require("express");
const user = require("./user/index");
const session = require("./session/index");



const app = express();
app.use(express.json());
app.use(user);
app.use(session);

module.exports = app;