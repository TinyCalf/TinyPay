var BitcoinSeriesinit = require('./BitcoinSeries/init.js')
var BitcoinSeriesTxsDealer = require('./BitcoinSeries/TransactionDealer.js')
var log = require('./Logs/log.js')('index')

BitcoinSeriesinit.init()
.then ( ()=>{
  return BitcoinSeriesTxsDealer.start()
})
.then ( ()=>{

})
.catch ( (err)=>log.err(err) )
