/*
以太坊系列币种处理新增交易
*/
var Rpc = require('./Rpc')
var db = require('../Database/db')
var zmq = require('../Zeromq/zmqServer')
var config = require('../config.js')
var log = require('../Logs/log.js')("EthereumSerises/TransactionDealer")
var config = require('../config').currencies
/*
筛选出所有交易中向本地充值的交易
txs=>txs
[ { blockHash: '0x798ba5a7086f08030c0a32c1a69536b8854daa49a6850e4c10e05347dbf85c99',
    blockNumber: 1639,
    from: '0xc2b9ed5c6e493cdf88f977125cb3f6d57dc8ed84',
    gas: 90000,
    gasPrice: { [String: '18000000000'] s: 1, e: 10, c: [Array] },
    hash: '0x1e7a105eb679b10520e59154f8530461d95487557fd3467a3d8fbf8354a47ad0',
    input: '0x',
    nonce: 0,
    to: '0xff68ccf645a0b11e8b2613d67f26459a5da62a9f',
    transactionIndex: 0,
  ...},... ]
*/
var selectLocalTxs = (name, txs) => {
  return new Promise ( (resolve, reject) => {
    var selectedTxsArray = []
    if(txs.length < 1) resolve(selectedTxsArray)
    var loop = (i) => {
      const promise = new Promise( (resolve, reject) => {
        db.checkHasAddress(name, txs[i].to)
        .then(ret => {
          if(ret) selectedTxsArray.push(txs[i])
          resolve();
        })
        .catch(err=>reject(err))
      })
      .then( () => {
        (i < txs.length-1) ? loop(i+1) : resolve(selectedTxsArray)
      })
      .catch(err=>reject(err))
    }
    loop(0)
  })
}

/*
通过zmq发送所有新交易
*/
var zmqSendReceivedTxs = (rpc, txs, confirmations) => {
  return new Promise ( (resolve, reject) => {
    if(!txs[0]) {
      resolve()
      return
    }
    function loop(i) {
      const promise = new Promise( (resolve, reject) => {
        var tx = {
          name:             rpc.name,
          category:         "receive",
          address:          txs[i].to,
          amount:           rpc.fromWei( txs[i].value, 'ether').toString(),
          confirmations:    confirmations,
          txid:             txs[i].hash,
        }
        db.addIncomeLog(tx.name, tx.txid, tx.address, "main", tx.amount)
        .catch(err=>{})
        //发送消息
        zmq.sendReceivedTxs(tx)
        .catch( err=>log.err(err) )
        //如果达到确认数传回主账户 --这里改成了冷钱包账户
        if(confirmations>=config[rpc.name].confirmationsLimit) {
          rpc.sendToMainAccount(txs[i].to, config[rpc.name].incomeLimit)
          .then( (ret)=>{
            log.info(rpc.name
              + " has been switched to main account, txid is "
              + ret)
          })
          .catch( err=>log.err(err) )
        }
        resolve()
      })
      .then( () => {
        (i < txs.length-1) ? loop(i+1) : resolve()
      })
      .catch( err => { return reject(err) })
    }
    loop(0)
  })
}

/*
处理单个区块上的交易信息
name(币种),height（区块高）
*/
var dealWithOneBlock = (rpc, height, lastHeight) => {
  return new Promise ( (resolve, reject) => {
    log.info(rpc.name + " dealing with block " + height)
    //查询该高度上所有交易
    rpc.getTxByBlock(height)
    .then(txs=>{
      //筛选出充值到本地的交易
      return selectLocalTxs(rpc.name, txs)
    })
    .then(txs=>{
      //整合交易信息并通过消息队列发送
      return zmqSendReceivedTxs(rpc, txs, lastHeight-height)
    })
    .then(()=>{resolve()})
    .catch(err=>log.err(err))
  })
}


/*
从已记录高度到当前高度块之间的所有交易
name
*/
var dealWithUncheckedBlocks = (rpc, checkedHeight, lastHeight) => {
  return new Promise ( (resolve, reject) => {
    if(checkedHeight>=lastHeight)  return resolve()
    var loop = (height) => {
      dealWithOneBlock(rpc, height, lastHeight)
      .then( () => {
        (height < lastHeight-1) ? loop(height+1) : resolve()
      })
      .catch(err=>reject(err))
    }
    loop(checkedHeight)
  })
}

/*
处理交易
*/
var dealer = (rpc) => {
  return new Promise ( (resolve, reject) => {
    var checkedHeight = null;
    var lastHeight = null;
    //获取币种已记录高度
    db.getCheckedHeight(rpc.name)
    .then( height => {
      checkedHeight = height
      //获取当前高度
      return rpc.getHeight()
    })
    .then( height =>{
      lastHeight = height
      //处理高度差之间的所有交易
      var cfmts = config[rpc.name].confirmationsLimit
      // console.log(rpc.name + " " + checkedHeight + " " + lastHeight )
      return dealWithUncheckedBlocks(rpc, checkedHeight-cfmts, lastHeight)
    })
    .then(()=>{
      //更新已记录高度
      return db.updateCheckedHeight(rpc.name, lastHeight)
    })
    .catch(err=>reject(err))
  })
}


/*
循环函数
*/
var dealerLooper = (rpc, duration) => {
  return new Promise ( (resolve, reject) => {
    dealer(rpc).catch(err=>log.err(err))
    setInterval(
      ()=>{
        dealer(rpc).catch(err=>log.err(err))
      },
      duration || 5000
    )
    resolve()
  })
}

exports.start = () => {
  return new Promise ( (resolve, reject) => {
    log.info('Starting to deal with incoming transactions of ethereum series...')
    var seq = [];
    for(var key in config) {
      if (config[key].category == 'ethereum') {
        log.info ('Start dealing with ' + key )
        var rpc = new Rpc(key)
        seq.push ( dealerLooper (rpc, config[key].txCheckDuration) )
      }
    }
    Promise.all(seq)
    .then ( () => resolve() )
    .catch( err => reject(err))
  })
}
