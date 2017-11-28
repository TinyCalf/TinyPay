/*
所有项目构建初始化的方法 包括初始化数据库
*/

var db = require ('./Database/db')
var config = require('./config').currencies;
var log = require('./Logs/log.js')("build")

/*
初始化所有币种的高度数据库 (已经创建的则不会操作)
*/
var initCurrencyDatabase = () => {
  return new Promise ( (resolve, reject) => {
    log.info("Start initializing database...");
    var seq = [];
    for (var key in config) {
      seq.push ( db.createNewCurrency(key, config[key].confirmationsLimit) )
    }
    Promise.all(seq)
    .then ( () => {
      log.info("All currencies' database initialized!")
      resolve()
    })
    .catch( err => {
      reject(err);
    })

  });
}


initCurrencyDatabase()
.then( ()=> console.log("good!")  )
.catch( err=>log.err(err) )

//exports.init = initDatabase

//
// initDatabase()
// .then( ()=>{console.log("success")})
// .catch ( (err)=>{console.log(err)})
