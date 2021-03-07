const fs = require("fs");
const path = require("path");
// const sanitizeHtml = require("sanitize-html");
const express = require("express");
const app = express();

const template = require("./lib/template");

app.use(express.static("public"));

app.get("/", (req, res) => {
  let html = template.HTML();
  res.send(html);
});

app.listen(3001, () => console.log("Example"));
