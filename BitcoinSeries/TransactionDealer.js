var rpc = require('./RPCMethods')
var db = require('../Database/db')
var zmq = require('../Zeromq/zmqServer')
var config = require('../config.js').BitcoinSeries
var log = require('../Logs/log.js')("TransactionDealer")


/*
批量发送接受到的交易
*/
var _zmqSendReceivedTxs = (name, txs) => {
  return new Promise ( (resolve, reject) => {
    if(!txs[0]) {
      resolve()
      return
    }
    (function loop(i) {
      const promise = new Promise( (resolve, reject) => {
        if(txs[i].category !== 'receive') {
          resolve()
          return
        }
        var tx = {
          name:             name,
          category:         txs[i].category,
          address:          txs[i].address,
          amount:           txs[i].amount,
          confirmations:    txs[i].confirmations,
          txid:             txs[i].txid,
        }
        zmq.sendReceivedTxs(tx).then( ()=>resolve() )

      })
      .then( () => {
        (i < txs.length-1) ? loop(i+1) : resolve()
      })
    })(0)
  })
}

/*
处理交易信息
*/
var _dealer = (name) => {
  return new Promise ( (resolve, reject) => {
    var transactions = [] //记录获取到的交易
    //var height = null //记录查询最后块的高度
    //获取币种已记录高度
    db.getCheckedHeight(name)
    .then( height => {
      //查询区块链上该高度之后的相关交易
      return rpc.getTxsSinceBlock(name,height-1)
    })
    .then( ret => {
      var txs = ret.result.transactions
      //排除所有确认数等于0的
      for ( var i = 0 ; i < txs.length ; i ++ ) {
        if(txs[i].confirmations > 0)
        transactions.push(txs[i]);
      }
      var lastblock = ret.result.lastblock
      //查询当前区块对应的高度
      return rpc.getHeightByBlockHash(name,lastblock)
    })
    .then ( (height) => {
      //更新已记录高度
      return db.updateCheckedHeight(name,height+1)
    })
    .then ( () => {
      //发送获取到的交易信息
      return _zmqSendReceivedTxs(name, transactions)
    })
    .then ( ()=>resolve())
    .catch ( err => {
      reject(err);
    })
  })
}


// //开始每隔一段时间查看新的区块链子信息
// const btcDuration = 5 * 60 * 1000 // 5分钟
// const ltcDuration = 2 * 60 * 1000 // 2分钟
// const bccDuration = 2 * 60 * 1000 // 2分钟
//
// console.log('Start dealing BTC..');
// _dealer('btc').catch(err=>console.log(err))
// setInterval(
//   ()=>{
//     _dealer('btc').catch(err=>console.log(err))
//   },// .then( ()=>{console.log("success")})
// // .catch ( (err)=>{console.log(err)})
//   btcDuration
// )
//
// console.log('Start dealing LTC..');
// setInterval(
//   ()=>{
//     _dealer('ltc').catch(err=>console.log(err))
//   },
//   ltcDuration
// )
//
// console.log('Start dealing BCC..');
// setInterval(
//   ()=>{
//     _dealer('bcc').catch(err=>console.log(err))
//   },
//   bccDuration
// )

/*

*/
var _dealerLooper = (currency) => {
  return new Promise ( (resolve, reject) => {
    log.info('Start dealing with ' + currency.name )
    _dealer(currency.name).catch(err=>log.err(err))
    setInterval(
      ()=>{
        _dealer(currency.name).catch(err=>log.err(err))
      },
      currency.txCheckDuration
    )
    resolve()
  })
}

exports.start = () => {
  return new Promise ( (resolve, reject) => {
    log.info('Starting to deal with incoming transactions of bitcoin series...')
    var seq = [];
    for (var i = 0 ; i < config.length ; i++) {
      seq.push ( _dealerLooper (config[i]) )
    }
    Promise.all(seq)
    .then ( () => resolve() )
    .catch( err => reject(err))
  })
}










//db.updateCheckedHeight('btc',1000)
