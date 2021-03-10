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


  //let html = template.HTML();
  //res.send(html);
app.get("/", (req, res) => {
  let css = "/css/design.css";
  connection.query('SELECT * FROM board', function (error, results, fields) {
    if (error) throw error;
    connection.query(`SELECT * FROM post`, function(error, postList, fields) {
      if (error) throw error;
      let content = template.mainContent(results, postList);
      let category = template.list(results);
      let html = template.HTML(category, content, css);
      res.send(html);
    });
  });
});

app.get("/create/:boardName", (req, res) => {
  let css = "/css/createTest.css";
  connection.query('SELECT * FROM board', function (error, results, fields) {
    if (error) throw error;
    let content = template.createContent(req.params.boardName);
    let category = template.list(results);
    let html = template.HTML(category, content, css);
    res.send(html);
  });
});

//여기를 하세요
app.post("/processCreate/:boardName", (req, res) =>{
  let now = template.getDate(new Date());
  connection.query(`INSERT INTO post VALUES (NULL, '${req.body.title}', '${req.body.description}', "익명",'${now}', '${req.params.boardName}')`,
   function (error, results, fields) {
     if(error) throw error;
     res.redirect(`/board/${req.params.boardName}`)
   });
});

app.get("/board/:boardName", (req, res) =>{
  let css = "/css/post.css";
  connection.query('SELECT * FROM board', function (error, board, fields) {
    if (error) throw error;
    connection.query(`SELECT * FROM post WHERE board='${req.params.boardName}'`, function(error, postList, fields) {
      if (error) throw error;
      let content = template.postContent(req.params.boardName, postList);
      let category = template.list(board);
      let html = template.HTML(category, content, css);
      res.send(html);
    })
  });
});

app.listen(3001, () => console.log("Example"));
