let bitcoindb = require("./bitcoin.db")
let incomedb = require("./bitcoin_income.db")
let btc = require("./Bitcoin")
let config = require("../Config")


/*
处理交易信息
*/
var _dealer = (name) => {
    console.info('Starting to deal with incoming transactions of bitcoin series...')
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
      console.log(transactions)
    })
    .catch ( err => {
      console.log(err)
    })
}


exports.start = () => {
  return new Promise ( (resolve, reject) => {
    console.info('Starting to deal with incoming transactions of bitcoin series...')
    setInterval(_dealer, 1000)
  })
}
