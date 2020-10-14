//importing modules
const express = require("express");
const user = require("./user/index");

const app = express();
app.use(express.json());
app.use(user);

module.exports = app;