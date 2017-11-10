var db = require ('../Database/db')
var config = require('../config').BitcoinSeries;
var log = require('../Logs/log.js')("BitcoinSeriesInit")

/*
初始化所有比特比系列币种的数据库 (已经创建的则不会操作)
*/
var initDatabase = () => {
  return new Promise ( (resolve, reject) => {
    log.info("Start initializing database...");
    var seq = [];
    for (var i = 0 ; i < config.length ; i++) {
      seq.push ( db.createNewCurrency(config[i].name) )
    }
    Promise.all(seq)
    .then ( () => resolve() )
    .catch( err => reject() )
    log.info("Database initialized");
  });
}

exports.init = initDatabase

//
// initDatabase()
// .then( ()=>{console.log("success")})
// .catch ( (err)=>{console.log(err)})
