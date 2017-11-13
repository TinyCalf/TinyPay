var BitcoinSeriesTxsDealer = require('./BitcoinSeries/TransactionDealer.js')
var log = require('./Logs/log.js')('index')

BitcoinSeriesTxsDealer.start()
.then ( ()=>{

})
.catch ( (err)=>log.err(err) )





/*
启动 api v1
*/
var apiv1 = require("./api/v1")
