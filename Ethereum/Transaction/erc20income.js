require("../../log")
var fs = require("fs")
var path = require("path")
var web3 = require("../web3")
var config = require("../../Config")
var account = require("../Account")
var db = require("../Database/ERC20Income.db")
var block = require("../Block")
var currencydb = require("../Database/Currency.db")
var Event = require("events")


/*
get some events
EXAMPLE
getEvents.on('newIncome', (income) => {...});
        .on('confirmationUpdate',(transaction) => {...})
*/
var getEvents = new Event()
exports.getEvents = getEvents



var abi = JSON.parse(
  fs.readFileSync(__dirname + "/erc20.abi").toString())
var kingInstance = new web3.eth.Contract(abi, config.king.contractAddress)
var contractInstances = {
  king: kingInstance
}

/*
get related transactions of the token
EXAMPLE
_getTransactions("king",0,"latest").then(console.log).catch(console.log)
RETURN
[ { blockHash: '0xed5bbfea73ca999e1d983eb1a241a7479dbf7fc06b6875f63f7c5c4df242cf2d',
    blockNumber: 3104400,
    transactionHash: '0x093304f1f54332cd1fa3ffd6bea38c8d30e9a50ff624eb623724894ddac8a4e6',
    transactionIndex: 0,
    from: '0x53565FEbe212Fc43392Fdf01aE19CCd3d492695A',
    to: '0x853187De87527E3dd9d9887Ee9FaB5D3cb4965B1',
    value: '1000000000000000000000' } ,...]

*/
var _getTransactions = (alias, fromBlock, toBlock) =>{
  return new Promise ( (resolve, reject) => {
    account.getAddressesByAlias(alias)
    .then(addresses=>{
      contractInstances[alias].getPastEvents('Transfer',{
        filter:{to:addresses},
        fromBlock:fromBlock,
        toBlock: toBlock
      }, function(error, data){
        if(error) return reject(error)
        var result = []
        data.forEach( t=>{
          var res = {
            blockHash: t.blockHash,
            blockNumber: t.blockNumber,
            transactionHash: t.transactionHash,
            transactionIndex: t.transactionIndex,
            from: t.returnValues.from,
            to: t.returnValues.to,
            value : t.returnValues.value
          }
          result.push(res)
        })
        resolve(result)
      })
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

/*
discover new transactions
1. discover unchecked block
2. find new transactions
3. insert into db
4. update lastCheckedHeight
*/
var _discoverNewTransactions = (alias) => {
  return new Promise ( (resolve, reject) => {
    console.info(`discovering new ${alias} transactions`)
    var currentHeight = 0
    var lastCheckedHeight = 0
    block.getCurrentHeight()
    .then(ret=>{
      currentHeight = ret
      return currencydb.checkHeight(alias)
    })
    .then(height=>{
      lastCheckedHeight = height + 1
      return _getTransactions(alias, lastCheckedHeight, currentHeight)
    })
    .then(transactions=>{
      var incomes = []
      transactions.forEach( (tx)=>{
        var income = {}
        income.alias = alias
        income.symbol = config[alias].symbol
        income.transactionHash = tx.transactionHash
        income.confirmations = _culConfirmations(currentHeight, tx.blockNumber)
        income.sender = tx.from.toLowerCase()
        income.localReceiver = tx.to.toLowerCase()
        income.blockHash = tx.blockHash
        income.blockNumber = tx.blockNumber
        income.value = tx.value
        income.amount = web3.utils.fromWei(tx.value)
        incomes.push(income)
        getEvents.emit("newIncome", income)
        console.success(`new ${alias} income has been discovered!
          transactionHash: ${income.transactionHash}
          sender: ${income.sender}
          localReceiver: ${income.localReceiver}
          amount: ${income.amount}
          confirmations: ${income.confirmations}`)
      })
      return db.appendRecords(incomes)
    })
    .then(ret=>{
      return currencydb.updateHeight(alias, currentHeight)
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
var _updateConfirmationsOfOneBlock = (alias, blockNumber) => {
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
      return db.updateConfirmationByBlockHash(confirmations, blockHash, alias)
    })
    .then(ret=>{
      update = ret
      return db.findIncomesByBlockHash(blockHash, alias)
    })
    .then(ret=>{
      if(update.ok == 1 && update.nModified > 0)
      ret.forEach((tx)=>{
        getEvents.emit("confirmationUpdate", tx)
        console.success(`new ${alias} income confirmations has been updated
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
// _updateConfirmationsOfOneBlock("king",3104566)
// .then(console.log).catch(console.log)
var _updateConfirmations = (alias) => {
  return new Promise ( (resolve, reject) => {
    var checkedHeight = null
    var confirmations = config.ethereum.confirmations
    currencydb.checkHeight(alias)
    .then(ret=>{
      checkedHeight = ret
      for(var i= checkedHeight-confirmations-2; i < checkedHeight; i++)
        _updateConfirmationsOfOneBlock(alias, i)
    })
    .catch(err=>reject(err))
  })
}


/*
update  new transaction when new block discovered
*/
_updateConfirmations("king").catch(err=>console.error(err))
_discoverNewTransactions("king").catch(err=>console.error(err))
block.newBlock.on('newblock', (blockHeader) => {
  _discoverNewTransactions("king").catch(err=>console.error(err))
  _updateConfirmations("king").catch(err=>console.error(err))
});
