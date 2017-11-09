var rpc = require('./RPCMethods');
var db = require('../Database/db');
var zmq = require('../Zeromq/zmqServer');

console.log('Starting to deal with incoming transactions...')

/*
批量发送接受到的交易
*/
var _zmqSendReceivedTxs = (txs) => {
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
    var transactions = null //记录获取到的交易
    //var height = null //记录查询最后块的高度
    //获取币种已记录高度
    db.getCheckedHeight(name)
    .then( height => {
      //查询区块链上该高度之后的相关交易
      return rpc.getTxsSinceBlock(name,height+1)
    })
    .then( txs => {
      transactions = txs.result.transactions
      var lastblock = txs.result.lastblock
      //查询当前区块对应的高度
      return rpc.getHeightByBlockHash(name,lastblock)
    })
    .then ( (height) => {
      //更新已记录高度
      return db.updateCheckedHeight('btc',height+1)
    })
    .then ( () => {
      //发送获取到的交易信息
      return _zmqSendReceivedTxs(transactions)
    })
    .then ( ()=>resolve())
    .catch ( err => {
      reject(err);
    })
  })
}


//开始每隔一段时间查看新的区块链子信息
const btcDuration = 5 * 60 * 1000 // 5分钟
const ltcDuration = 2 * 60 * 1000 // 2分钟
const bccDuration = 2 * 60 * 1000 // 2分钟

console.log('Start dealing BTC..');
_dealer('btc').catch(err=>console.log(err))
setInterval(
  ()=>{
    _dealer('btc').catch(err=>console.log(err))
  },
  btcDuration
)

console.log('Start dealing LTC..');
setInterval(
  ()=>{
    _dealer('ltc').catch(err=>console.log(err))
  },
  ltcDuration
)

console.log('Start dealing BCC..');
setInterval(
  ()=>{
    _dealer('bcc').catch(err=>console.log(err))
  },
  bccDuration
)

//db.updateCheckedHeight('btc',1000)
