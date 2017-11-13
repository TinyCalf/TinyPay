/*
所有项目构建初始化的方法 包括初始化数据库
*/

var db = require ('./Database/db')
var config = require('./config').BitcoinSeries;
var log = require('./Logs/log.js')("build")

/*
初始化所有比特比系列币种的数据库 (已经创建的则不会操作)
*/
var initBitcoinSeriseDatabase = () => {
  return new Promise ( (resolve, reject) => {
    log.info("Start initializing database...");
    var seq = [];
    for (var i = 0 ; i < config.length ; i++) {
      seq.push ( db.createNewCurrency(config[i].name) )
    }
    Promise.all(seq)
    .then ( () => {
      log.info("Bitcoin series's database initialized!")
      resolve()
    })
    .catch( err => {
      reject(err);
    })

  });
}


initBitcoinSeriseDatabase()
.then( ()=> console.log("good!")  )
.catch( err=>log.err(err) )

//exports.init = initDatabase

//
// initDatabase()
// .then( ()=>{console.log("success")})
// .catch ( (err)=>{console.log(err)})
