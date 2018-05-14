require("../../log")
var fs = require("fs")
var path = require("path")
var web3 = require("../web3")
var config = require("../../Config")
var account = require("../Account")
var db = require("../Database/EtherIncome.db")
var block = require("../Block")
var currencydb = require("../Database/Currency.db")
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
var getEvents = new Event()
exports.getEvents = getEvents

var _getTransactionsOnOneBlock = (number) => {
  return new Promise ( (resolve,reject)=>{
    console.info(`watch ether income on block ${number}`)
    let transactions = []
    let tempTxsObj = {}
    web3.eth.getBlock(number)
    .then(ret=>{
      return Promise.map(ret.transactions, function(hash) {
        return web3.eth.getTransaction(hash)
      })
    })
    .then(ret=>{
      let addresses = []
      ret.forEach( (tx) => {
        if(tx.to && tx.hash && tx.value!=0){
          tempTxsObj[tx.to.toLowerCase()] = tx
          addresses.push(tx.to.toLowerCase())
        }
      })
      return account.getEtherAddressesByAddresses(addresses)
    })
    .then(addresses=>{
      addresses.forEach( (address)=>{
        transactions.push(tempTxsObj[address])
      })
      resolve(transactions)
    })
    .catch(err=>reject(err))
  })
}


var _getTransactions = (lastCheckedHeight, currentHeight) => {
  return new Promise ( (resolve, reject)=>{
    let it = new Array()
    for(var i = lastCheckedHeight; i<=currentHeight;i++)
      it.push(i)
    Promise.map(it, (blockNumber)=>{
      return _getTransactionsOnOneBlock(blockNumber)
    })
    .then(ret=>{
      var res = []
      ret.forEach( (i)=>res = res.concat(i))
      resolve(res)
    })
    .catch(err=>reject(err))
  })
}

/* culculate blockheight return 0-20*/
var _culConfirmations = (currentHeight,blockNumber) => {
      var res = currentHeight - blockNumber
      var con = config.ethereum.confirmations
      if(res > con) res = con
      if(res < 0) res = 0
      return res
}

var _discoverNewTransactions = () => {
  return new Promise ( (resolve, reject) => {
    console.info(`discovering new ether transactions`)
    var currentHeight = 0
    var lastCheckedHeight = 0
    block.getCurrentHeight()
    .then(ret=>{
      currentHeight = ret
      return currencydb.checkHeight("ether")
    })
    .then(height=>{
      lastCheckedHeight = height + 1
      if(currentHeight - lastCheckedHeight > 500)
      currentHeight = lastCheckedHeight + 500
      return _getTransactions(lastCheckedHeight, currentHeight)
    })
    .then(transactions=>{
      var incomes = []
      transactions.forEach( (tx)=>{
        var income = {}
        income.alias = "ether"
        income.symbol = "ether"
        income.transactionHash = tx.hash
        income.confirmations = _culConfirmations(currentHeight, tx.blockNumber)
        income.sender = tx.from.toLowerCase()
        income.localReceiver = tx.to.toLowerCase()
        income.blockHash = tx.blockHash
        income.blockNumber = tx.blockNumber
        income.value = new BN(tx.value, 10).toString(10)
        income.amount = web3.utils.fromWei(tx.value)
        incomes.push(income)
        getEvents.emit("newIncome", income)
        console.success(`new ether income has been discovered!
          transactionHash: ${income.transactionHash}
          sender: ${income.sender}
          localReceiver: ${income.localReceiver}
          amount: ${income.amount}
          confirmations: ${income.confirmations}`)
      })
      return db.appendRecords(incomes)
    })
    .then(ret=>{
      return currencydb.updateHeight("ether", currentHeight)
    })
    .then(ret=>resolve())
    .catch(err=>reject(err))
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
  return new Promise ( (resolve, reject) => {
    var blockHash = null
    var currentHeight = null
    var confirmations = null
    var update = null
    block.getBlock(blockNumber)
    .then(ret=>{
      blockHash = ret.hash
      return block.getCurrentHeight()
    })
    .then(ret=>{
      currentHeight = ret
      confirmations = _culConfirmations(currentHeight, blockNumber)
      return db.updateConfirmationByBlockHash(confirmations, blockHash)
    })
    .then(ret=>{
      update = ret
      return db.findIncomesByBlockHash(blockHash)
    })
    .then(ret=>{
      if(update.ok == 1 && update.nModified > 0)
      ret.forEach((tx)=>{
        getEvents.emit("confirmationUpdate", tx)
        console.success(`new ether income confirmations has been updated
          transactionHash: ${tx.transactionHash}
          sender: ${tx.sender}
          localReceiver: ${tx.localReceiver}
          amount: ${tx.amount}
          confirmations: ${tx.confirmations}`)
      })
    })
    .catch(err=>reject(err))
  })
}


var _updateConfirmations = () => {
  return new Promise ( (resolve, reject) => {
    var checkedHeight = null
    var confirmations = config.ethereum.confirmations
    currencydb.checkHeight("ether")
    .then(ret=>{
      checkedHeight = ret
      for(var i= checkedHeight-confirmations-2; i < checkedHeight; i++)
        _updateConfirmationsOfOneBlock(i)
    })
    .catch(err=>reject(err))
  })
}

/*
update  new transaction when new block discovered
*/
_updateConfirmations().catch(err=>console.error(err))
 _discoverNewTransactions().catch(err=>console.error(err))
block.newBlock.on('newblock', (blockHeader) => {
  _discoverNewTransactions().catch(err=>console.error(err))
  _updateConfirmations().catch(err=>console.error(err))
});
