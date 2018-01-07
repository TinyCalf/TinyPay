var rpc = require('./RPCMethods')
var db = require('../Database/db')
var zmq = require('../Zeromq/zmqServer')
var config = require('../config.js').currencies
var log = require('../Logs/log.js')("TransactionDealer")


//{"name":"rbtc","category":"receive","address":"mh9oXQSwPg8Fb4W3cyHBtP2UHjFq4Se9Nx"
//,"amount":9,"confirmations":10
//,"txid":"a19f9ed983ec170a6f69d048217596839068fb01f1fd5df9f48eea3bc161e0fb"}

/*
批量发送接受到的交易 TODO:node 8 以后还没有测试
*/
var _zmqSendReceivedTxs = (name, txs) => {
  return new Promise ( (resolve, reject) => {
    if(!txs[0]) {
      resolve()
      return
    }
    function loop(i) {
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
        db.addIncomeLog(tx.name, tx.txid, "main", tx.address, tx.amount)
        .catch(err=>{})
      })
      .then( () => {
        (i < txs.length-1) ? loop(i+1) : resolve()
      })
    }
    loop(0)
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
      return rpc.getTxsSinceBlock(name,height-config[name].confirmationsLimit)
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
    .then ( ()=>{
      //检查该币是否超过上限,超过则转入冷钱包账户
      if(config[name].coldwallet && config[name].coldwallet != "") {
        rpc.getBalance(name)
        .then(balance=>{
          if(balance>config[name].maxStore){
            rpc.sendTransaction(name, "", config[name].coldwallet, parseInt(balance))
            .then(ret=>{
              console.log(ret)
              db.addOutcomeLog(name, ret, "main", config[name].coldwallet, Math.floor(balance)).catch(err=>{console.log(err)})
              log.info("send to main account " + config[name].coldwallet + " with  " + Math.floor(balance) + " " + name)
              resolve()
            })
            .catch(err=>log.err(err))
          }
        })
        .catch(err=>log.err(err))
      } else {
        return resolve()
      }
    })
    .catch ( err => {
      reject(err);
    })
  })
}

/*
循环函数
*/
var _dealerLooper = (name) => {
  return new Promise ( (resolve, reject) => {
    log.info('Start dealing with ' + name )
    _dealer(name).catch(err=>log.err(err))
    setInterval(
      ()=>{
        _dealer(name).catch(err=>log.err(err))
      },
      config[name].txCheckDuration
    )
    resolve()
  })
}

exports.start = () => {
  return new Promise ( (resolve, reject) => {
    log.info('Starting to deal with incoming transactions of bitcoin series...')
    var seq = [];
    for (var key in config) {
      if(config[key].category === "bitcoin" )
        seq.push ( _dealerLooper (key) )
    }
    Promise.all(seq)
    .then ( () => resolve() )
    .catch( err => reject(err))
  })
}
