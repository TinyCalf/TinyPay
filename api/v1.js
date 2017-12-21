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
获取主节点基本信息
CURL:
  curl http://127.0.0.1:1990/v1/getinfo
RET:
{
  "err":0,
  "msg":[
    {"name":"btc","accout":"n1KcLBAY9yeyh14r2hg2fJ7z5JuvbQRgpn","balance":5599.9999232},
    {"name":"bcc","accout":"mzy1hroNApXSyCqFKKxC6KEteqQ1QDjYgr","balance":6099.999808},
    {"name":"ltc","accout":"n2ejCd6VAQa5VCFvRHhqSSTu5hg6tGmZCp","balance":9024.97552},
    {"name":"utc","accout":"mzKcK34QEYaonsRCMHzPmNb3ej99KRxP2f","balance":0},
    {"name":"tch","accout":"mmrkSivFKDWTvga6M22RY1YkgnQb73gWK2","balance":0},
    {"name":"eth","accout":"0x29800baedfb23c6a1a23239c08850c83a6193fec","balance":"17574"}
  ]
}
*/
app.get('/v1/getinfo',function(req,res){
  if(!judgeIp(req.ip))
    return res.send({err:-1000,msg:'you are not allowed!'})
  var msg = [];
  var currencies = config.currencies
  var keys = []
  for(var key in currencies) keys.push(key)
  function loop(i) {
    const promise = new Promise( (resolve, reject) => {
      var nowcoin = currencies[keys[i]]
      var obj = {}
      obj.name = key
      switch(nowcoin.category) {
        case "bitcoin": {
          BitcoinRPC.getnewaddress(keys[i])
          .then(ret=>{
            obj.name = keys[i]
            obj.accout = ret
            return BitcoinRPC.getBalance(keys[i])
          })
          .then(ret=>{
            obj.balance = ret
            msg.push(obj)
            return resolve()
          })
          break
        }
        case "ethereum": {
          var rpc = new EthereumRPC(keys[i])
          rpc.getMainAccount()
          .then ( ret => {
            obj.name = keys[i]
            obj.accout = ret
            return rpc.getBalance(ret)
          })
          .then ( ret=> {
            obj.balance = ret
            msg.push(obj)
            return resolve()
          })
        }
      }
    })
    .then( () => {
      (i < keys.length-1) ? loop(i+1) : res.send({err:0,msg:msg})
    })
  }
  loop(0)
});


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
  -X POST -d '{"name":"etc","to":"0x7e369de308d913d6a4177527bd307583f6405427","amount":"100"}'
*/
app.post('/v1/sendtransaction',function(req,res){
  if(!judgeIp(req.ip))
    return res.send({err:-1000,msg:'you are not allowed!'})
  if(!req.body.name || !req.body.to || !req.body.amount)
    return res.send({err:-900,msg:'lack of params'})
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
        db.addOutcomeLog(name, txid, "main", to, amount).catch(err=>{})
        return res.send({err:0 ,msg:txid})
      })
      .catch ( err=> {
        log.err(err)
        res.send({err:err.code ,msg:err.message})
      })
      break
    }
    case 'ethereum':{
      var rpc = new EthereumRPC(name)
      rpc.sendTransaction(to, amount)
      .then( txid => {
        log.info("sent " + amount + " " + name + " to " + to, "txid is " + txid)
        db.addOutcomeLog(name, txid, "main", to, amount).catch(err=>{})
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
