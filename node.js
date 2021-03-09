const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
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
connection.connect();

const template = require("./lib/template");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (req, res) => {
  //let html = template.HTML();
  //res.send(html);
  let css = "/css/design.css";
  connection.query('SELECT * FROM board', function (error, results, fields) {
    if (error) throw error;
    let content = template.mainContent(results);
    let category = template.list(results);
    let html = template.HTML(category, content, css);
    res.send(html);
  });
  // res.render("test.html");
});

app.get("/create/:boardName", (req, res) => {
  let css = "/css/createTest.css";
  connection.query('SELECT * FROM board', function (error, results, fields) {
    if (error) throw error;
    let content = template.createContent(req.params.boardName);
    let category = template.list(results);
    let html = template.HTML(category, content, css);
    console.log(html);
    res.send(html);
  });
});

//여기를 하세요
app.post("/processCreate/:boardName", (req, res) =>{
  let today = new Date(); 
  let now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  connection.query(`INSERT INTO post (id, title, description, writer, date, board) VALUES (NULL, ${req.body.title}, ${req.body.description}, "익명",${now}, ${req.params.boardName})`,
   function (error, results, fields) {

   });
});

app.get("/board/:boardName", (req, res) =>{
  let css = "/css/post.css";
  connection.query('SELECT * FROM board', function (error, results, fields) {
    if (error) throw error;
    let content = template.postContent(req.params.boardName);
    let category = template.list(results);
    let html = template.HTML(category, content, css);
    res.send(html);
  });
});

app.listen(3001, () => console.log("Example"));
