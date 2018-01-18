  console.log(
'    ____  _ __                                    \n' +
'   / __ )(_) /_____ _____  ____ _____  ____ _____ \n' +
'  / __  / / __/ __ `/ __ \\/ __ `/ __ \\/ __ `/ __ \\\n' +
' / /_/ / / /_/ /_/ / /_/ / /_/ / /_/ / /_/ / /_/ /\n' +
'/_____/_/\\__/\\__, /\\____/\\__, /\\____/\\__, /\\____/ \n' +
'            /____/      /____/      /____/ v1.1.0\n\n' +
'数字货币支付方案 -- tiny-calf.com\n'
)

var BitcoinSeriesTxsDealer = require('./BitcoinSeries/TransactionDealer.js')
var EthereumSeriesTxsDealer = require('./EthereumSeries/TransactionDealer.js')
var ERC20TxsDealer = require('./EthereumSeries/ERC20TransactionDealer.js')
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
启动ERC20系列消息队列
*/
ERC20TxsDealer.start()
.catch ( (err)=>log.err(err) )

/*
启动 api v1
*/
var apiv1 = require("./api/v1")
