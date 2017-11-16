/*
以太坊系列币种处理新增交易
*/
var rpc = require('./RPCMethods')
var db = require('../Database/db')
var zmq = require('../Zeromq/zmqServer')
var config = require('../config.js')
var log = require('../Logs/log.js')("EthereumSerises/TransactionDealer")
var config = require('../config').currencies
const web3_extended = require('web3_extended');



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
var zmqSendReceivedTxs = (name, txs) => {
  return new Promise ( (resolve, reject) => {
    if(!txs[0]) {
      resolve()
      return
    }
    function loop(i) {
      const promise = new Promise( (resolve, reject) => {
        var tx = {
          name:             name,
          category:         "receive",
          address:          txs[i].to,
          amount:           web3_extended.fromWei( txs[i].value, 'ether'),
          txid:             txs[i].hash,
        }
        zmq.sendReceivedTxs(tx).then( ()=>resolve() )

      })
      .then( () => {
        (i < txs.length-1) ? loop(i+1) : resolve()
      })
    }
    loop(0)
  })
}

/*
处理单个区块上的交易信息
name(币种),height（区块高）
*/
var dealWithOneBlock = (name, height) => {
  /*先假设只有eth*/
  name = "eth"
  return new Promise ( (resolve, reject) => {
    //查询该高度上所有交易
    rpc.getTxByBlock(height)
    .then(txs=>{
      //筛选出充值到本地的交易
      return selectLocalTxs(name, txs)
    })
    .then(txs=>{
      //整合交易信息并通过消息队列发送
      return zmqSendReceivedTxs(name, txs)
    })
    .catch(err=>log.err(err))
  })
}


/*
从已记录高度到当前高度块之间的所有交易
name
*/
var dealWithUncheckedBlocks = (name, checkedHeight, lastHeight) => {
  return new Promise ( (resolve, reject) => {
    if(checkedHeight>=lastHeight)  return resolve()
    var loop = (height) => {
      dealWithOneBlock(name,height)
      .then( () => {
        (height < lastHeight) ? loop(height+1) : resolve()
      })
      .catch(err=>reject(err))
    }
    loop(checkedHeight)
  })
}

/*
处理交易
*/
var dealer = (name) => {
  return new Promise ( (resolve, reject) => {
    var checkedHeight = null;
    var lastHeight = null;
    //获取币种已记录高度
    db.getCheckedHeight(name)
    .then( height => {
      checkedHeight = height
      //获取当前高度
      return rpc.getHeight()
    })
    .then( height =>{
      lastHeight = height
      //处理高度差之间的所有交易
      return dealWithUncheckedBlocks(name, checkedHeight, lastHeight)
    })
    .then(()=>{
      //更新已记录高度
      return db.updateCheckedHeight(name, lastHeight)
    })
    .catch(err=>reject(err))
  })
}


/*
循环函数
*/
var dealerLooper = (currency) => {
  return new Promise ( (resolve, reject) => {
    log.info('Start dealing with ' + currency.name )
    dealer(currency.name).catch(err=>log.err(err))
    setInterval(
      ()=>{
        dealer(currency.name).catch(err=>log.err(err))
      },
      currency.txCheckDuration
    )
    resolve()
  })
}

exports.start = () => {
  return new Promise ( (resolve, reject) => {
    log.info('Starting to deal with incoming transactions of ethereum series...')
    var seq = [];
    for (var i = 0 ; i < config.length ; i++) {
      if (config[i].category = 'ethereum') {
        seq.push ( _dealerLooper (config[i]) )
      }
    }
    Promise.all(seq)
    .then ( () => resolve() )
    .catch( err => reject(err))
  })
}

this.start()
