const fs = require("fs");
const path = require("path");
// const sanitizeHtml = require("sanitize-html");
const express = require("express");
const app = express();

let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'mingwan',
  password : '11111111',
  database : 'opentutorials'
});

const template = require("./lib/template");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));

app.get("/", (req, res) => {
  //let html = template.HTML();
  //res.send(html);
  res.render("test.html");
});

app.get("/create", (req, res) => {
  res.render("createTest.html");
});

app.listen(3001, () => console.log("Example"));
