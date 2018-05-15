require("../../log")
var fs = require("fs")
var path = require("path")
var web3 = require("../web3")
var config = require("../../Config")
var account = require("../Account")
var Event = require("events")
var wallet = require("./wallet")
var block = require("../Block")
var outcomedb = require("../Database/KingOutcome.db")
var Promise = require("bluebird");
var parity = require("../parity")



/*
get some events
EXAMPLE
getEvents.on('outcomeSuccess', (income) => {...});
*/
let getEvents = new Event()
exports.getEvents = getEvents

/*
send out king in multi addresses
EXAMPLE
// this.transferToAddresses(["0xbf0d681a164367b7fcef9435d32a23889fed100d",
// "0x199c22f08dec6e189ac1c6b768919097be24f965"],["321212","13123"])
// .catch(console.log)
// this.transferToAddresses(["0xbf0d681a164367b7fcef9435d32a23889fed100d",
// "0x199c22f08dec6e189ac1c6b768919097be24f965"],["10000","200000"])
// .catch(console.log)
*/
exports.transferToAddressesInEther = new Function("tos", "values")

/*
get king balance of main , unit is ether
RESLOVE
999999.999999999013368025
*/
exports.getBalanceOfMainInEther = new Function()

let abi = JSON.parse(
  fs.readFileSync(__dirname + "/king.abi").toString())
let kingInstance = new web3.eth.Contract(abi, config.king.contractAddress)


let _transferToAddresses = (tos, values) => {
  return new Promise ( (resolve, reject) => {
    if(!(tos instanceof Array))
      return reject(new Error("tos must be instance of Array"))
    if(!(values instanceof Array))
      return reject(new Error("values must be instance of Array"))
    if(tos.length != values.length)
      return reject(new Error("tos should be as long as values"))
    var method = kingInstance.methods.transferToAddresses(tos,values)
    parity.nextNonce(wallet.mainAddress)
    .then(ret=>{
      method.send({
        from:wallet.mainAddress,
        gas:config.king.gas,
        gasPrice:config.king.gasPrice,
        nonce:ret
      })
      .on('transactionHash', function(hash){
        amounts = []
        values.forEach( (v)=>{
          amounts.push(web3.utils.fromWei(v))
        })
        var income = {
          transactionHash:hash,
          localSender:wallet.mainAddress,
          receivers:tos,
          values:values,
          amounts:amounts,
          gasPrice:config.king.gasPrice,
        }
        outcomedb.appendRecord(income)
        .then(ret=>{
          console.success(`sent out new transaction of king:
            hash: ${hash}`)
          resolve(hash)
        })
        .catch(err=>reject(err))
      })
      .on('error', err=>{
        console.error(err)
        if(err.message == "Returned error: Transaction gas price is too low. There is another transaction with same nonce in the queue. Try increasing the gas price or incrementing the nonce." ||
        err.message == "Returned error: Transaction with the same hash was already imported.")
        reject(new Error("SEND_TOO_OFTEN"))
        else
        reject(err)
      });
    })
    .catch(err=>reject(err))
  })
}

this.transferToAddressesInEther =  (tos, amounts) => {
  var values = []
  amounts.forEach( (a) => {
    values.push(web3.utils.toWei(a))
  })
  return _transferToAddresses(tos,values)
}


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
      console.success(`king outcome transfer successfully
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

block.newBlock.on('newblock', (blockHeader) => {
  _dealWithUnconfirmedTransactions().catch(console.error)
});

_getKingBalanceOfMain = () => {
  return new Promise ( (resolve, reject) => {
    kingInstance.methods.balanceOf(wallet.mainAddress).call({},
      function(error, result){
        if(error) return reject(error)
        resolve(result)
    });
  })
}

this.getBalanceOfMainInEther = () => {
  return new Promise ( (resolve, reject) => {
    _getKingBalanceOfMain()
    .then(ret=>{
      resolve(web3.utils.fromWei(ret))
    })
    .catch(err=>reject(err))
  })
}
// this.getBalanceOfMainInEther().then(console.log)
