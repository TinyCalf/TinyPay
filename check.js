var log = require("./Logs/log")('check')


/*
测试mongodb
*/
new Promise( (resolve, reject) => {
  log.info("Checking mongodb...")
  const mongoose = require("mongoose");
  const host = require("./config.js").db.host;
  mongoose.connect(host, {useMongoClient:true});
  var db = mongoose.connection;
  db.on('error', err=>{mongoose.connection.close();reject(err)});
  db.once('open',()=>{mongoose.connection.close();resolve()});
})
.then(()=>{
  log.info("mongodb is online!")

})
.catch(err=>{
  log.err(err)
  log.err("mongodb is not connected!")
  mongoose.connection.close()
})



/*
测试所有注册的货币的 RPC 是否可用
*/
