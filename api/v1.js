const btcrpc = require('../BitcoinSeries/RPCMethods')
const bodyParser = require('body-parser')
const express = require("express");
var app = express();
const config = require('../config.js')
const log = require("../Logs/log")("apiv1")

//设置跨与访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// app.use(bodyParser)


//获取钱包地址 btc | bcc | ltc
app.get('/v1/getnewaddress',function(req,res){
  var name = req.query.name
  var currency = config.currencies.find(x => {return x.name === name } )
  if(!currency) {
    res.send({err:-100,msg:'no such currency configured!'})
    return
  }
  switch (currency.category){
    case 'bitcoin':{
      btcrpc.getnewaddress(currency.name)
      .then( addr => {
        log.info(currency.name + " getnewaddress " + addr)
        res.send({err:0 ,msg:addr})
      })
      .catch ( err=> {
        log.err(err)
        res.send({err:-300 ,msg:err})
      })
      break
    }
    case 'ethereum':{

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
//curl http://127.0.0.1:1990/v1/getnewaddress?name=btc
//{"err":0,"msg":"13Cyy5MTWpfXjEmtf2uMif2EEq1eRgYFsj"}





app.listen(config.apiv1.port);
log.info("API V1 listening on " + config.apiv1.port);
