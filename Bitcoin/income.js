let bitcoindb = require("./bitcoin.db")
let incomedb = require("./bitcoin_income.db")
let btc = require("./Bitcoin")
let config = require("../Config")
let Event = require("events")
require("../log")
exports.events = new Event()

let _dealerWithTx = tx=>{
  let income = {
    transactionHash: tx.txid,
    confirmations: tx.confirmations,
    localReceiver : tx.address,
    amount: tx.amount
  }
  if(income.confirmations > 20) income.confirmations = 20
  incomedb.checkTransactionByHash(tx.txid)
  .then(tx=>{
    if(!tx){
      incomedb.add(income)
      .then(newincome=>{
        return incomedb.checkTransactionByHash(income.transactionHash)
      })
      .then(tx=>{
        this.events.emit("newIncome", tx)
      })
      .catch(err=>console.error(err))
    }else if(tx.confirmations != income.confirmations){
      incomedb.updateConfirmation(
        income.confirmations,
        income.transactionHash)
      .then(ret=>{
        return incomedb.checkTransactionByHash(income.transactionHash)
      })
      .then(tx=>{
        this.events.emit("confirmationUpdate",tx)
      })
    }
  })
}

/*
处理交易信息
*/
var _dealer = (name) => {
    var transactions = [] //记录获取到的交易
    //var height = null //记录查询最后块的高度
    //获取币种已记录高度
    bitcoindb.checkHeight()
    .then( ret => {
      //查询区块链上该高度之后的相关交易
      let height = ret.lastCheckedHeight - config.btc.confirmations
      return btc.getTxsSinceBlock(height)
    })
    .then( ret => {
      var txs = ret
      //排除所有确认数等于0的
      for ( var i = 0 ; i < txs.length ; i ++ ) {
        if(txs[i].confirmations > 0 && txs[i].category == "receive")
        transactions.push(txs[i]);
      }
      return btc.getCurrentHeight()
    })
    .then ( (ret) => {
      //更新已记录高度
      return bitcoindb.updateHeight(ret+1)
    })
    .then ( () => {
      for(let i=0; i< transactions.length; i++)
        _dealerWithTx(transactions[i])
    })
    .catch ( err => {
      console.error(err)
    })
}


exports.start = () => {
  return new Promise ( (resolve, reject) => {
    console.info('Starting to deal with incoming transactions of bitcoin series...')
    setInterval(_dealer, 2000)
  })
}
