// const sanitizeHtml = require("sanitize-html");
const bodyParser = require("body-parser");
const express = require("express");
const crypto = require('crypto');
const path = require("path");
const fs = require("fs");
const app = express();

const mysql = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'mingwan',
  password : '11111111',
  database : 'opentutorials'
});
connection.connect();

const template = require("./lib/template");
const { request } = require("http");
const { postDescriptionContent } = require("./lib/template");

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
    connection.query(`SELECT * FROM post ORDER BY id DESC`, function(error, postLists, fields) {
      if (error) throw error;
      // let content = template.mainContent(req.boardList, postList);
      // let category = template.list(req.boardList);
      // let html = template.HTML(category, content, css);
      // res.send(html);

      res.render("mainContent", 
        {
          boardList: req.boardList,
          postList : postLists
        });
  });
});

app.get("/create/:boardName", (req, res) => {
    // let css = "/css/createTest.css";
    // let content = template.createContent(req.params.boardName);
    // let category = template.list(req.boardList);
    // let html = template.HTML(category, content, css);
    // res.send(html);

    res.render("createContent", {
      boardList: req.boardList,
      boardName: req.params.boardName,
    });
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
  let query = `SELECT COUNT(id) FROM post WHERE board=?`;
  connection.query(query, [req.params.boardName], function(error, count, fields) {
    req.postCount = count[0]['COUNT(id)'];
    next();
  });
});

app.get("/board/:boardName/:page", (req, res) =>{
  let query = `SELECT * FROM post WHERE board=? ORDER BY id DESC LIMIT ?, 20`;
    connection.query(query, [req.params.boardName, (req.params.page-1) * 20],function(error, postList, fields) {
      if (error) throw error;
      // let css = "/css/post.css";
      // let content = template.postContent(req.params.boardName, postList, req.postCount);
      // let category = template.list(req.boardList);
      // let html = template.HTML(category, content, css);
      // res.send(html);

      res.render("postContent", {
        boardList:req.boardList,
        boardName:req.params.boardName,
        postList:postList,
        postCount:req.postCount,
      });
  });
});

app.get("/board/:boardName/description/:id", (req, res) =>{
  let query = `SELECT * FROM post WHERE id=?`
  connection.query(query,[req.params.id], function(error, post, fields) {
    if (error) throw error;
    // let css = "/css/description.css";
    // let content = template.postDescriptionContent(post);
    // let category = template.list(req.boardList);
    // let html = template.HTML(category, content, css);
    // res.send(html);

    res.render("postDescriptionContent", {
      boardList:req.boardList,
      post:post,
    })
  });
});

app.get("/update/:id", (req, res) =>{
  let query = `SELECT * FROM post WHERE id=?`;
  connection.query(query, [req.params.id], function(error, post, fields) {
    if(error) throw error;
    // let css = "/css/createTest.css";
    // let content = template.updateContent(post[0]);
    // let category = template.list(req.boardList);
    // let html = template.HTML(category, content, css);
    // res.send(html);
    res.render("updateContent", {
      boardList:req.boardList,
      content:post[0],
    })
  });
});

app.post("/processUpdate/:boardName/:id", (req, res) =>{
  let query = `UPDATE post SET title=?, description=? WHERE id=?`
  connection.query(query, [req.body.title, req.body.description, req.params.id], function(error, post, fields) {
    res.redirect(`/board/${req.params.boardName}/1`);
  });
});

app.post("/processDelete", (req, res) =>{
  let query = `DELETE FROM post WHERE id=?`;
  connection.query(query, [req.body.id], function(error, post, fields) {
    res.redirect(`/board/${req.body.boardName}/1`);
  });
});

app.get("/register", (req, res) =>{
  // let css = "/css/register.css";
  // let content = template.registerContent();
  // let category = template.list(req.boardList);
  // let html = template.HTML(category, content, css);
  // res.send(html);
  res.render("registerContent", {
    boardList:req.boardList,
  });
});

app.post("/processRegister", (req, res) =>{
  let {id, password, email, name} = req.body;

  //비동기 처리로 수정 필요
  let salt=``;
  let realpass = ``;
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
      realpass += key.toString('base64');
      salt += buf.toString('base64');

      if(template.checkEmail(email)){
        let query = `INSERT INTO user(id, password, name, email, salt) VALUES('${id}', '${realpass}', '${name}', '${email}', '${salt}')`;
         connection.query(query, function(error){
          if(error) throw(error);
          res.redirect(`/register`);
        });
      }else{
        res.redirect('/');
      }
    });
  });
});

app.post("/processLogin", (req, res) =>{
  let id = req.body.id;
  let password = req.body.password;

  connection.query(`SELECT id FROM user where id=?`, [id], function(error, data){
    if(data){
      //id존재
      connection.query(`SELECT password, salt FROM user where id=?`, [id], function(error, passwordData) {
          crypto.pbkdf2(password, passwordData[0].salt, 100000, 64, 'sha512', (err, key) => {
            if(passwordData[0].password == key.toString('base64')) {
              //로그인 성공
              console.log("로그인 성공");
              res.redirect("/");
            }else{
              //비밀번호 불일치
              res.redirect("/");
            }
        });
      });
    }else{
      //id미존재
      res.redirect("/");
    }
  });
});

app.listen(3001, () => console.log("Example"));