/*
以太坊系列币种处理新增交易
*/
var rpc = require('./RPCMethods')
var db = require('../Database/db')
var zmq = require('../Zeromq/zmqServer')
var config = require('../config.js')
var log = require('../Logs/log.js')("EthereumSerises/TransactionDealer")



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
var _selectLocalTxs = (name, txs) => {
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
      //把所有交易中，to的地址为数据库中保存过的地址的交易找出来
      //先吧to的地址集合成单个数组方便数据库查询
      //以太放的订单信息中，拥有transactionIndex，正好与数组index匹配

    })
    .catch(err=>log.err(err))
  })
}


// dealWithOneBlock("eth",1639)
