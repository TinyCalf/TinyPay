var BitcoinSeriesTxsDealer = require('./BitcoinSeries/TransactionDealer.js')
var EthereumSeriesTxsDealer = require('./EthereumSeries/TransactionDealer.js')
var log = require('./Logs/log.js')('index')

/*
启动比特币系列消息队列
*/
BitcoinSeriesTxsDealer.start()
.catch ( (err)=>log.err(err) )

/*
启动以太放系列消息队列
*/
EthereumSeriesTxsDealer.start()
.catch ( (err)=>log.err(err) )

/*
启动 api v1
*/
var apiv1 = require("./api/v1")
