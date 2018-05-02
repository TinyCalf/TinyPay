require("../log")
var Ethereum = require("../Ethereum")
var config = require("../Config")
var db = require("./Database/Callbackqueue.db")
var request = require("request")

var findOneAndSend = () => {
  db.findOneUnreceived()
  .then(ret=>{
    if(!ret) return
    console.info(`callback queue sending new message id:${ret.id}`)
    var options = {
      uri: config.www.callbackUri,
      method: 'POST',
      timeout: 20000,
      json: {
        type:ret.type,
        msg:JSON.parse(ret.message)
      }
    };
    request(options, function (error, response, body) {
      if(error) return console.error(error)
      //has got response, indicating that this message is solved
      db.markReceived(ret._id).catch(err=>console.error(err))
      console.info(`new message received by client id:${ret.id}`)
    });
  })
  .catch(err=>console.error(err))
}
setInterval(findOneAndSend, 5000)

Ethereum.Transaction.king.getEvents
.on('outcomeSuccess', (income) => {
  console.info(`callback queue has new outcomeSuccess message`)
  /*
{ recordTime: 2018-05-02T08:55:41.000Z,
  recordTimestamp: 1525251341346,
  gasPrice: 4000000000,
  localSender: '0xEE6A7a60f2f8D1e45A15eebb91EEc41886d4FA08',
  transactionHash: '0x67623df4971a9c898a2987749bbac64a4644f2b091004f7d3669388d020b420f',
  success: false,
  amounts: [ '20', '30' ],
  values: [ '20000000000000000000', '30000000000000000000' ],
  receivers:
   [ '0x212e754b95f99799aab5686ab21cf45a5f7e4000',
     '0x18aa1fe4446719d60a3b8b848e9d8eed37b18718' ],
  confirmations: 0,
  __v: 0 }
  */
  db.add(JSON.stringify(income), "outcomeSuccess").catch(console.error)
})


Ethereum.Transaction.erc20income.getEvents
.on('newIncome', (income) => {
  console.info(`callback queue has new newIncome message`)
  /*
{ alias: 'king',
  symbol: 'KING(KingCoin)',
  transactionHash: '0x67623df4971a9c898a2987749bbac64a4644f2b091004f7d3669388d020b420f',
  confirmations: 0,
  sender: '0xEE6A7a60f2f8D1e45A15eebb91EEc41886d4FA08',
  localReceiver: '0x18aa1FE4446719D60A3b8b848e9d8eEd37B18718',
  blockHash: '0xc58f9e744dbc80641cdf5c3bd1a94313145516638bce2d9f0edae49bb88fb896',
  blockNumber: 3153013,
  value: '30000000000000000000',
  amount: '30' }

  */
  db.add(JSON.stringify(income), "newIncome").catch(console.error)
})
.on('confirmationUpdate',(transaction) => {
  console.info(`callback queue has new confirmationUpdate message`)
  /*
{ alias: 'king',
  symbol: 'KING(KingCoin)',
  transactionHash: '0x67623df4971a9c898a2987749bbac64a4644f2b091004f7d3669388d020b420f',
  confirmations: 3,
  sender: '0xEE6A7a60f2f8D1e45A15eebb91EEc41886d4FA08',
  localReceiver: '0x212e754b95F99799AaB5686ab21Cf45A5F7E4000',
  blockHash: '0xc58f9e744dbc80641cdf5c3bd1a94313145516638bce2d9f0edae49bb88fb896',
  blockNumber: 3153013,
  value: '20000000000000000000',
  amount: '20' }

  */
  db.add(JSON.stringify(transaction), "confirmationUpdate").catch(console.error)
})
