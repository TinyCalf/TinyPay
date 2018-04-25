var log = require("./Logs/log")('check')
var config = require("./config")


//TODO：测试node版本
//TODO:测试zmq是否可以启动
/*
测试mongodb
*/
var checkMongo = () => {
  return new Promise( (resolve, reject) => {
    log.print("Checking mongodb...")
    const mongoose = require("mongoose");
    const host = require("./config.js").db.host;
    mongoose.connect(host, {useMongoClient:true});
    var db = mongoose.connection;
    db.on('error', err=>{mongoose.connection.close();reject("MongoDB cannot be reached!")});
    db.once('open',()=>{mongoose.connection.close();resolve("MongoDB is online!")});
  })
}

/*
测试所有注册的货币的 RPC 是否可用
*/
var currs = config.currencies
var bitcoinrpc = require("./BitcoinSeries/RPCMethods")
var Ethereumrpc = require("./EthereumSeries/Rpc")
var checkRPC = () => {
  return new Promise ( (resolve, reject) => {
    var names = []
    for (var key in currs) names.push(key)
    //console.log(names)
    function loop(i) {
      const promise = new Promise( (resolve, reject) => {
        log.info("Checking " + names[i] + " RPC...");
        switch(currs[names[i]].category) {
          case "bitcoin": {
            bitcoinrpc.getBalance(names[i])
            .then(ret=>resolve(ret))
            .catch(err=>reject(err))
            break;
          }
          case "ethereum": {
            var rpc = new Ethereumrpc(names[i])
            rpc.getAccounts()
            .then(ret=>resolve(ret))
            .catch(err=>reject(err))
            break
          }
          default:reject("nothing")
        }
      })
      .then( ret => {
        (i < names.length-1) ? loop(i+1) : resolve()
        log.success(names[i] + " connected!")
      })
      .catch( err => {
        (i < names.length-1) ? loop(i+1) : resolve()
        log.err(names[i] + " RPC cannot be reached!")
        log.err(err)

      })
    }
    loop(0);
  })
}




//测试mongo
checkMongo().then(ret=>{
  return checkRPC()
}).catch(err=>log.err(err))
//测试所有注册的货币的 RPC
.then(ret=>{
  log.info("completed! check above if there is an err.")
  process.exit(0)
})
.catch(err=>log.err(err))
