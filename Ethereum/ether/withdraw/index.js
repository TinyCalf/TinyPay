var fs = require("fs")
var path = require("path")
var Event = require("events")
var Promise = require("bluebird");

require("../../lib/log")
var db = require("./etherwithdraw.db.js")
var config = require("../../config")
var parity = require("../../lib/parity")
var block = require("../../lib/block")
var wallet = require("../../lib/wallet")
var web3 = require("../../lib/web3")
var account = require("../account")


/*
get some events
EXAMPLEk
getEvents.on('outcomeSuccess', (income) => {...});
*/
let getEvents = new Event()
exports.Events = getEvents




// { blockHash: null,
//   blockNumber: null,
//   chainId: '0x3',
//   condition: null,
//   creates: null,
//   from: '0xEE6A7a60f2f8D1e45A15eebb91EEc41886d4FA08',
//   gas: 100000,
//   gasPrice: '4000000000',
//   hash: '0xd6c3b3366fefbbfeae1f933375d5687379949590820810cabbd49eaee6d39cd7',
//   input: '0x',
//   nonce: 29,
//   publicKey: '0xf72b0c62099a654ff6076b2612a2182a6c169422daa05c0928bd09bb03af7f252231f548352ebd068618295b370cd113976e89766d4bf3b1b3f5154dccff3a81',
//   r: '0x1c2bac60af0d99f3d77e618f06feb6fde6cb9582235ebd2cf58d50acf9792312',
//   raw: '0xf8681d84ee6b2800830186a094c66bbb755a375b7bb2ff142eea8967246722a2b68405f76b888029a01c2bac60af0d99f3d77e618f06feb6fde6cb9582235ebd2cf58d50acf9792312a039b15be765878ae263561a5bbef1168e61710a047f7dbb8525690f114355b754',
//   s: '0x39b15be765878ae263561a5bbef1168e61710a047f7dbb8525690f114355b754',
//   standardV: '0x0',
//   to: '0xC66Bbb755a375B7BB2FF142EEa8967246722A2B6',
//   transactionIndex: null,
//   v: '0x29',
//   value: '100101000' }
let _transferEther = (from, to, value) => {
  return new Promise((resolve, reject) => {
    parity.nextNonce(from)
      .then(nonce => {
        web3.eth.sendTransaction({
            from: from,
            to: to,
            value: value,
            nonce: nonce,
            gas: config.ether.gas,
            gasPrice: config.ether.gasPrice,
          })
          .on('transactionHash', function (hash) {
            web3.eth.getTransaction(hash)
              .then(tx => resolve(tx))
              .catch(err => reject(err))
          })
          .on('error', (err) => {
            if (err.message == "Returned error: Transaction gas price is too low. There is another transaction with same nonce in the queue. Try increasing the gas price or incrementing the nonce." ||
              err.message == "Returned error: Transaction with the same hash was already imported.")
              reject(new Error("SEND_TOO_OFTEN"))
            else
              reject(err)
          });
      })
      .catch(err => reject(err))
  })
}

exports.lauchTransaction = (to, amount) => {
  return new Promise((resolve, reject) => {
    if (!(typeof amount == 'string')) {
      return resolve(new Error("amount should be String"))
    }
    let hash = null
    let t = {}
    _transferEther(wallet.mainAddress, to, web3.utils.toWei(amount))
      .then(tx => {
        console.success(`sent out new transaction of ether:
        hash: ${tx.hash}`)
        hash = tx.hash
        t.transactionHash = tx.hash
        t.localSender = tx.from.toLowerCase()
        t.receiver = tx.to.toLowerCase()
        t.value = tx.value
        t.amount = amount
        t.gasPrice = tx.gasPrice
        return db.add(t)
      })
      .then(ret => {
        t.transactionHash = ret.transactionHash
        resolve(t)
      })
      .catch(err => reject(err))
  })
}

// this.transferEtherInEther(
// "0x1fd84e7863c4d4057cc9f23ad14becdf705ac87f","5.01")
// .then(console.log).catch(console.log)

/*
1. check if succeed
2 if succeed insert into db
3 if succeed emit Event
*/
let _checkOutcomeOnBlock = (outcome) => {
  return new Promise((resolve, reject) => {
    var tx = {}
    web3.eth.getTransactionReceipt(outcome.transactionHash)
      .then(ret => {
        if (!ret) return resolve()
        tx.gasUsed = ret.gasUsed
        tx.etherUsed =
          web3.utils.fromWei(web3.utils.toBN(ret.gasUsed)
            .mul(web3.utils.toBN(outcome.gasPrice)).toString());
        tx.blockHash = ret.blockHash
        tx.blockNumber = ret.blockNumber
        return web3.eth.getBlock(tx.blockNumber)
      })
      .then(block => {
        tx.blockTimestamp = block.timestamp
        tx.blockTime = Date(block.timestamp)
        tx.transactionHash = outcome.transactionHash
        return db.confirmSuccess(tx)
      })
      .then(ret => {
        console.success(`ether outcome transfer successfully
        transactionHash: ${outcome.transactionHash}`)
        return db.findTransactionByHash(outcome.transactionHash)
      })
      .then(ret => {
        let obj = {}
        obj.recordTime = ret.recordTime
        obj.recordTimestamp = ret.recordTimestamp
        obj.gasPrice = ret.gasPrice
        obj.amount = ret.amount
        obj.value = ret.value
        obj.receiver = ret.receiver
        obj.localSender = ret.localSender
        obj.transactionHash = ret.transactionHash
        obj.success = ret.success
        obj.confirmations = ret.confirmations
        obj.gasUsed = ret.gasUsed
        obj.etherUsed = ret.etherUsed
        obj.blockHash = ret.blockHash
        obj.blockNumber = ret.blockNumber
        obj.blockTimestamp = ret.blockTimestamp
        obj.blockTime = ret.blockTime
        return db.findTransactionByHash(ret.transactionHash)
      })
      .then(ret => {
        resolve(ret)
        getEvents.emit("confirmedNewTx", ret)
      })
      .catch(err => reject(err))
  })
}
// this.transferEtherInEther("0xc66bbb755a375b7bb2ff142eea8967246722a2b6","0.001").then(console.log).catch(console.log)

/*
1.find all uncomfirmed transactions
2.check on the block to see if has been confirmed
3.emit confirmed transactions
*/
let _dealWithUnconfirmedTransactions = () => {
  return new Promise((resolve, reject) => {
    db.findUnconfirmedTransactions()
      .then(txs => {
        var checks = []
        txs.forEach(tx => {
          checks.push(_checkOutcomeOnBlock(tx))
        })
        return Promise.all(checks)
      })
      .then(ret => resolve())
      .catch(err => reject(err))
  })
}

block.newBlock.on('newBlock', (blockHeader) => {
  _dealWithUnconfirmedTransactions().catch(console.error)
});