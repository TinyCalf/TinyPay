const BitcoinRPC = require('../BitcoinSeries/RPCMethods')
const EthereumRPC = require('../EthereumSeries/Rpc')
const bodyParser = require('body-parser')
const express = require("express");
var app = express();
const config = require('../config.js')
const log = require("../Logs/log")("apiv1")
var ipaddr = require('ipaddr.js'); // ip转换用

//设置跨与访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParser.json())

/*
判断ip来源是否在白名单中
*/
var judgeIp = (ip) => {
  var whitelist = config.apiv1.whitelist
  for (var i = 0 ; i < whitelist.length ; i++) {
    if(
      ipaddr.process(ip).toString() == ipaddr.process(whitelist[i]).toString()
    ){
      return true
    }
  }
  return false
}

/*
获取钱包地址 btc | bcc | ltc | eth | etc
CURL:
  curl http://127.0.0.1:1990/v1/getnewaddress?name=btc
RET:
  {"err":0,"msg":"13Cyy5MTWpfXjEmtf2uMif2EEq1eRgYFsj"}
*/
app.get('/v1/getnewaddress',function(req,res){
  if(!judgeIp(req.ip))
    return res.send({err:-1000,msg:'you are not allowed!'})
  var name = req.query.name
  if(!config.currencies[name]) {
    res.send({err:-100,msg:'no such currency configured!'})
    return
  }
  switch (config.currencies[name].category){
    case 'bitcoin':{
      BitcoinRPC.getnewaddress(name)
      .then( addr => {
        log.info(name + " getnewaddress " + addr)
        res.send({err:0 ,msg:addr})
      })
      .catch ( err=> {
        log.err(err)
        res.send({err:-300 ,msg:err})
      })
      break
    }
    case 'ethereum':{
      var rpc =new EthereumRPC(name)
      rpc.getNewAccount()
      .then( addr => {
        log.info(name + " getnewaddress " + addr)
        res.send({err:0 ,msg:addr})
      })
      .catch ( err=> {
        log.err(err)
        res.send({err:-300 ,msg:err})
      })
      break
    }
    case 'indie':{

    }
    default: {
      var msg = 'incorrect category in server!'
      log.err(msg)
      res.send({err:-200,msg:msg})
      return
    }
  }
});



/*
发送
POST:
  name, btc | bcc | ltc | eth | etc
  to,   发送到的地址
  amount 数量
RES:
  txid
CURL:
  curl http://127.0.0.1:1990/v1/sendtransaction \
  -H "Content-Type: application/json" \
  -X POST -d '{"name":"rbtc","to":"mvxwWn74CWRxx99nJC3QxXsgYsDH68pvPN","amount":"1"}'
RES:
  {"err":0,"msg":"243538f6c233fdd16cfff0a798d0a0cddec672587260e01c88cb56967e0d97be"}
  {"err":0,"msg":"0x17a8074ccc2437f2732fd3c8ca33d90da47c06fb12cdbbe41253d4b39e56f745"}
CURL:
  curl http://127.0.0.1:1990/v1/sendtransaction \
  -H "Content-Type: application/json" \
  -X POST -d '{"name":"etc","to":"0x1237b5d3023960c66bed5996fa2fb69c8eed6ed0","amount":"100"}'
*/
app.post('/v1/sendtransaction',function(req,res){
  if(!judgeIp(req.ip))
    return res.send({err:-1000,msg:'you are not allowed!'})
  var name = req.body.name
  var to = req.body.to
  var amount = req.body.amount
  if(!config.currencies[name])
    return res.send({err:-100,msg:'no such currency configured!'})
  var outcomeLimit = config.currencies[name].outcomeLimit;
  var incomeLimit = config.currencies[name].incomeLimit;
  if(amount > outcomeLimit)
    return res.send({err:-500,msg:"amout out of limit!"})
  if(amount < incomeLimit)
    return res.send({err:-600,msg:"amout less than limit"})
  //区分币种
  switch (config.currencies[name].category){
    case 'bitcoin':{
      BitcoinRPC.sendTransaction(name, "", to, amount)
      .then( txid => {
        log.info("sent " + amount + " " + name + " to " + to, "txid is " + txid)
        res.send({err:0 ,msg:txid})
      })
      .catch ( err=> {
        log.err(err)
        res.send({err:-300 ,msg:err.toString()})
      })
      break
    }
    case 'ethereum':{
      var rpc = new EthereumRPC(name)
      rpc.sendTransaction(to, amount)
      .then( txid => {
        log.info("sent " + amount + " " + name + " to " + to, "txid is " + txid)
        res.send({err:0 ,msg:txid})
      })
      .catch ( err=> {
        log.err(err)
        res.send({err:-300 ,msg:err.toString()})
      })
      break
    }
    case 'indie':{

    }
    default: {
      var msg = 'incorrect category in server!'
      log.err(msg)
      res.send({err:-200,msg:msg})
      return
    }
  }
});

app.listen(config.apiv1.port);
log.info("API V1 listening on " + config.apiv1.port);

//抛出app实例给测试脚本用
exports.app = app
