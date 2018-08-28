require("../../lib/log")
var fs = require("fs")
var path = require("path")
var web3 = require("../../lib/web3")
var config = require("../../config")
var account = require("../account")
var sendback = require("./sendback")
var db = require("./etherrecharge.db")
var block = require("../../lib/block")
var currencydb = require("../../Currency.db")
var Event = require("events")
var Promise = require("bluebird")
const utils = require("ethereumjs-util")
const BN = utils.BN

/*
get some events
EXAMPLE
getEvents.on('newIncome', (income) => {...});
        .on('confirmationUpdate',(transaction) => {...})
*/
let getEvents = new Event()
exports.Events = getEvents

var _getTransactionsOnOneBlock = (number) => {
  return new Promise((resolve, reject) => {
    console.info(`watch ether income on block ${number}`)
    let transactions = []
    let tempTxsObj = {}
    web3.eth.getBlock(number)
      .then(ret => {
        return Promise.map(ret.transactions, function (hash) {
          return web3.eth.getTransaction(hash)
        })
      })
      .then(ret => {
        let addresses = []
        ret.forEach((tx) => {
          if (tx.to && tx.hash && tx.value != 0) {
            tempTxsObj[tx.to.toLowerCase()] = tx
            addresses.push(tx.to.toLowerCase())
          }
        })
        return account.selectExistedAddresses(addresses)
      })
      .then(addresses => {
        addresses.forEach((address) => {
          transactions.push(tempTxsObj[address])
        })
        resolve(transactions)
      })
      .catch(err => reject(err))
  })
}


var _getTransactions = (lastCheckedHeight, currentHeight) => {
  return new Promise((resolve, reject) => {
    let it = new Array()
    for (var i = lastCheckedHeight; i <= currentHeight; i++)
      it.push(i)
    Promise.map(it, (blockNumber) => {
        return _getTransactionsOnOneBlock(blockNumber)
      })
      .then(ret => {
        var res = []
        ret.forEach((i) => res = res.concat(i))
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

/* culculate blockheight return 0-20*/
var _culConfirmations = (currentHeight, blockNumber) => {
  var res = currentHeight - blockNumber
  var con = config.confirmations
  if (res > con) res = con
  if (res < 0) res = 0
  return res
}

var _discoverNewTransactions = () => {
  return new Promise((resolve, reject) => {
    console.info(`discovering new ether transactions`)
    var currentHeight = 0
    var lastCheckedHeight = 0
    block.getCurrentHeight()
      .then(ret => {
        currentHeight = ret
        return currencydb.checkHeight("ether")
      })
      .then(height => {
        lastCheckedHeight = height + 1
        //if (currentHeight - lastCheckedHeight > 500)
        //  currentHeight = lastCheckedHeight + 500
        return _getTransactions(lastCheckedHeight, currentHeight)
      })
      .then(transactions => {
        var incomes = []
        transactions.forEach((tx) => {
          var income = {}
          income.transactionHash = tx.hash
          income.confirmations =
            _culConfirmations(currentHeight, tx.blockNumber)
          income.sender = tx.from.toLowerCase()
          income.localReceiver = tx.to.toLowerCase()
          income.blockHash = tx.blockHash
          income.blockNumber = tx.blockNumber
          income.value = new BN(tx.value, 10).toString(10)
          income.amount = web3.utils.fromWei(tx.value)
          incomes.push(income)
          getEvents.emit("newRecharge", income)
          console.success(`new ether income has been discovered!
          transactionHash: ${income.transactionHash}
          sender: ${income.sender}
          localReceiver: ${income.localReceiver}
          amount: ${income.amount}
          confirmations: ${income.confirmations}`)
        })
        return db.add(incomes)
      })
      .then(ret => {
        return currencydb.updateHeight("ether", currentHeight)
      })
      .then(ret => resolve())
      .catch(err => reject(err))
  })
}


/*
update confirmations
1. get block's hash that back from checkedHeight 22 confirmations
2. find txs which block hash is block's hash
3. culcalate the confirmations of the block txs
5. update the tx that need to be changes
6  emit the update
*/
var _updateConfirmationsOfOneBlock = (blockNumber) => {
  return new Promise((resolve, reject) => {
    var blockHash = null
    var currentHeight = null
    var confirmations = null
    var update = null
    block.getBlock(blockNumber)
      .then(ret => {
        blockHash = ret.hash
        return block.getCurrentHeight()
      })
      .then(ret => {
        currentHeight = ret
        confirmations = _culConfirmations(currentHeight, blockNumber)
        return db.updateConfirmationByBlockHash(confirmations, blockHash)
      })
      .then(ret => {
        update = ret
        return db.findIncomesByBlockHash(blockHash)
      })
      .then(ret => {
        if (update.ok == 1 && update.nModified > 0)
          ret.forEach((tx) => {
            getEvents.emit("confirmationUpdate", tx)
            console.success(`new ether income confirmations has been updated
          transactionHash: ${tx.transactionHash}
          sender: ${tx.sender}
          localReceiver: ${tx.localReceiver}
          amount: ${tx.amount}
          confirmations: ${tx.confirmations}`)
            if (tx.confirmations >= 20) sendback.addAddress(tx.localReceiver)
          })
      })
      .catch(err => reject(err))
  })
}


var _updateConfirmations = () => {
  return new Promise((resolve, reject) => {
    var checkedHeight = null
    var confirmations = config.confirmations
    currencydb.checkHeight("ether")
      .then(ret => {
        checkedHeight = ret
        let indexes = []
        for (var i = checkedHeight - confirmations - 2; i < checkedHeight; i++)
          indexes.push(i)
        return new Promise.map(indexes, index => {
          _updateConfirmationsOfOneBlock(index)
        })
      })
      .then(ret => {
        resolve()
      })
      .catch(err => reject(err))
  })
}

/*
update  new transaction when new block discovered
*/
let func1 = () => {
  _updateConfirmations()
    .finally(ret => {
      setTimeout(func1, 1000)
    })
}
func1()

let func2 = () => {
  return _discoverNewTransactions()
    .finally(ret => {
      setTimeout(func2, 1000)
    })
}
func2()

// block.newBlock.on('newBlock', (blockHeader) => {
//   _discoverNewTransactions().catch(err => console.error(err))
//   _updateConfirmations().catch(err => console.error(err))
// });
sendback.start()
sendback.Events.on("newSendback", ret => {
  getEvents.emit("newSendback", ret)
})
sendback.Events.on("confirmedSendback", ret => {
  getEvents.emit("confirmedSendback", ret)
})