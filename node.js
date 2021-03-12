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
const { request } = require("http");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));


//middleware
app.get('*', (req, res, next) =>{
  connection.query('SELECT * FROM board', function (error, results, fields) {
    if(error) throw error;
    req.boardList = results;
    next();
  });
});


  //let html = template.HTML();
  //res.send(html);
app.get("/", (req, res) => {
  let css = "/css/design.css";
    connection.query(`SELECT * FROM post ORDER BY id DESC`, function(error, postList, fields) {
      if (error) throw error;
      let content = template.mainContent(req.boardList, postList);
      let category = template.list(req.boardList);
      let html = template.HTML(category, content, css);
      res.send(html);
  });
});

app.get("/create/:boardName", (req, res) => {
    let css = "/css/createTest.css";
    let content = template.createContent(req.params.boardName);
    let category = template.list(req.boardList);
    let html = template.HTML(category, content, css);
    res.send(html);
});

//여기를 하세요
app.post("/processCreate/:boardName", (req, res) =>{
  let now = template.getDate(new Date());
  connection.query(`INSERT INTO post VALUES (NULL, '${req.body.title}', '${req.body.description}', "익명",'${now}', '${req.params.boardName}')`,
   function (error, results, fields) {
     if(error) throw error;
     res.redirect(`/board/${req.params.boardName}/1`);
   });
});

app.get("/board/:boardName/:page", (req, res, next) =>{
  connection.query(`SELECT COUNT(id) FROM post WHERE board='${req.params.boardName}'`, function(error, count, fields) {
    req.postCount = count[0]['COUNT(id)'];
    next();
  });
});

app.get("/board/:boardName/:page", (req, res) =>{
    let css = "/css/post.css";
    connection.query(`SELECT * FROM post WHERE board='${req.params.boardName}' ORDER BY id DESC LIMIT ${(req.params.page-1) * 20}, 20`, function(error, postList, fields) {
      if (error) throw error;
      let content = template.postContent(req.params.boardName, postList, req.postCount);
      let category = template.list(req.boardList);
      let html = template.HTML(category, content, css);
      res.send(html);
  });
});

app.get("/board/:boardName/description/:id", (req, res) =>{
  let css = "/css/description.css";
  connection.query(`SELECT * FROM post WHERE id='${req.params.id}'`, function(error, post, fields) {
    if (error) throw error;
    let content = template.postDescriptionContent(post);
    let category = template.list(req.boardList);
    let html = template.HTML(category, content, css);
    res.send(html);
  });
});

app.get("/update/:id", (req, res) =>{
  connection.query(`SELECT * FROM post WHERE id='${req.params.id}'`, function(error, post, fields) {
    if(error) throw error;
    let css = "/css/createTest.css";
    let content = template.updateContent(post[0]);
    let category = template.list(req.boardList);
    let html = template.HTML(category, content, css);
    res.send(html);
  });
});

app.post("/processUpdate/:boardName/:id", (req, res) =>{
  let query = `UPDATE post SET title='${req.body.title}', description='${req.body.description}' WHERE id=${req.params.id}`
  connection.query(query, function(error, post, fields) {
    res.redirect(`/board/${req.params.boardName}/1`);
  });
});

app.post("/processDelete", (req, res) =>{
  let query = `DELETE FROM post WHERE id=${req.body.id}`;
  connection.query(query, function(error, post, fields) {
    res.redirect(`/board/${req.body.boardName}/1`);
  });
});

app.listen(3001, () => console.log("Example"));