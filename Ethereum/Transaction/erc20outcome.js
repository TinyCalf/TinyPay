require("../../log")
var fs = require("fs")
var path = require("path")
var web3 = require("../web3")
var config = require("../../Config")
var account = require("../Account")
var Event = require("events")
var wallet = require("./wallet")
var block = require("../Block")
var outcomedb = require("../Database/ERC20Outcome.db")
var Promise = require("bluebird");
var parity = require("../parity")

/*
get some events
EXAMPLE
getEvents.on('outcomeSuccess', (income) => {...});
*/
let getEvents = new Event()
exports.getEvents = getEvents

var abi = JSON.parse(
  fs.readFileSync(__dirname + "/erc20.abi").toString())
var kingInstance = new web3.eth.Contract(abi, config.king.contractAddress)
var aliases = config.ethereum.available_currency_alias
let contractInstances = {}
aliases.forEach( (c) => {
  if(!config[c])
    throw new Error(`Currency not found! Please check config file to see if there is a problem`)
  let curr = config[c]
  if(curr.category != "erc20") return
  if(!curr.category
    ||!curr.contractAddress
    || !curr.category
    || !curr.symbol
    || !curr.name)
    throw new Error(`Currency not found! Please check config file to see if there is a problem`)
  let nInstance = new web3.eth.Contract(abi, curr.contractAddress)
  contractInstances[c] = nInstance
  nInstance.methods.name().call({}).then(ret=>{
    if(ret!=curr.name){
      console.error(`${c}'s name is wrong in config file`)
      process.exit(1)
    }
  })
  nInstance.methods.symbol().call({}).then(ret=>{
    if(ret!=curr.symbol){
    console.error(`${c}'s symbol is wrong in config file`)
      process.exit(1)
    }
  })
})


exports.transferERC20InEther = new Function("to", "amount")

let _transferERC20 = (alias, from, to, value) => {
  return new Promise ( (resolve, reject)=>{
    parity.nextNonce(from)
    .then(nonce=>{
      contractInstances[alias].methods.transfer(to, value).send({
        from: from,
        nonce: nonce,
        gas: config[alias].gas,
        gasPrice: config[alias].gasPrice,
      })
      .on('transactionHash', function(hash){
          web3.eth.getTransaction(hash)
          .then(tx=>resolve(tx))
          .catch(err=>reject(err))
      })
      .on('error', err=>{
          console.error(err)
          if(err.message == "Returned error: Transaction gas price is too low. There is another transaction with same nonce in the queue. Try increasing the gas price or incrementing the nonce." ||
          err.message == "Returned error: Transaction with the same hash was already imported.")
          reject(new Error("SEND_TOO_OFTEN"))
          else
          reject(err)
      })
    })
    .catch(err=>reject(err))
  })
}

this.transferERC20InEther = (alias, to, amount) => {
  return new Promise ( (resolve, reject)=>{
    if(!(typeof amount=='string')){
      return resolve(new Error("amount should be String"))
    }

    let ifConfiged = false
    config.ethereum.available_currency_alias.forEach( a=>{
      if (a==alias) ifConfiged = true
    })
    if(!ifConfiged) return resolve(new Error("ALIAS_NOT_EXISTED"))
    hash = null
    _transferERC20(alias, wallet.mainAddress, to, web3.utils.toWei(amount))
    .then(tx=>{
      console.success(`sent out new transaction of ${alias}:
        hash: ${tx.hash}`)
      hash = tx.hash
      var outcome = {}
      outcome.transactionHash = tx.hash
      outcome.localSender = tx.from.toLowerCase()
      outcome.receiver = to
      outcome.value = web3.utils.toWei(amount)
      outcome.amount = amount
      outcome.gasPrice = tx.gasPrice
      outcome.alias = alias
      outcome.symbol = config[alias].symbol
      outcome.name = config[alias].name
      return outcomedb.appendRecord(outcome)
    })
    .then( ret=>resolve(hash))
    .catch(err=>reject(err))
  })
}

// this.transferERC20InEther("tiny",
// "0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08","20.01")
// .then(console.log).catch(console.log)

/*
1. check if succeed
2 if succeed insert into db
3 if succeed emit Event
*/
let _checkOutcomeOnBlock = (outcome) => {
  return new Promise ( (resolve, reject) => {
    var tx = {}
    web3.eth.getTransactionReceipt(outcome.transactionHash)
    .then(ret=>{
      if(!ret) return resolve()
      tx.gasUsed = ret.gasUsed
      tx.etherUsed =
        web3.utils.fromWei(web3.utils.toBN(ret.gasUsed)
        .mul(web3.utils.toBN(outcome.gasPrice)).toString());
      tx.blockHash = ret.blockHash
      tx.blockNumber = ret.blockNumber
      return web3.eth.getBlock(tx.blockNumber)
    })
    .then(block=>{
      tx.blockTimestamp = block.timestamp
      tx.blockTime = Date(block.timestamp)
      tx.transactionHash = outcome.transactionHash
      return outcomedb.confirmSuccess(tx)
    })
    .then(ret=>{
      console.success(`ERC20 outcome transfer successfully
        transactionHash: ${outcome.transactionHash}`)
      return outcomedb.findTransactionByHash(outcome.transactionHash)
    })
    .then(ret=>{
      getEvents.emit("outcomeSuccess", ret)
      resolve()
    })
    .catch(err=>reject(err))
  })
}
// this.transferEtherInEther("0xc66bbb755a375b7bb2ff142eea8967246722a2b6","0.001").then(console.log).catch(console.log)

/*
1.find all uncomfirmed transactions
2.check on the block to see if has been confirmed
3.emit confirmed transactions
*/
let _dealWithUnconfirmedTransactions = () => {
  return new Promise ( (resolve, reject)=>{
    outcomedb.findUnconfirmedTransactions()
    .then(txs=>{
      var checks = []
      txs.forEach( (outcome)=>{
        checks.push(_checkOutcomeOnBlock(outcome))
      })
      return Promise.all(checks)
    })
    .then(ret=>resolve())
    .catch(err=>reject(err))
  })
}
_dealWithUnconfirmedTransactions().catch(console.error)
block.newBlock.on('newblock', (blockHeader) => {
  _dealWithUnconfirmedTransactions().catch(console.error)
});


// this.transferERC20InEther("king","0xb02d2693f4b0d7fd1221be056a275005ffc327af","2").then(console.log).catch(console.log)
