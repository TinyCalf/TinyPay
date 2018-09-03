require("../log")
const bodyParser = require('body-parser')
const express = require("express");
var app = express();
//var v1 = require('./v1');
let ether = require("./ether")
let bitcoin = require("./bitcoin")
//var config = require("../Config")
require("./callback")


//设置跨与访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(bodyParser.json())

//app.use('/v1', v1);

app.use('/ether', ether)
app.use('/bitcoin', bitcoin)

app.use((err, req, res, next) => {
  console.error(err)
  switch (err.message) {
  case "":
  default:
    res.send({
      err: "UNKNOWN_ERROR",
      msg: "unknow error"
    })
  }
})

app.listen(3333);
console.success("tinypay api listening on " + 3333);
exports.app = app