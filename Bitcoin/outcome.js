require("../log.js")
let btc = require("./Bitcoin")
let outcomedb = require("./bitcoin_outcome.db")
Promise = require("bluebird")
let Event = require("events")

exports.events = new Event()
/*
{ alias: 'btc',
  name: 'btc',
  symbol: 'btc',
  transactionHash: '160cc3ab52492f186482b93ea8200a715d9e254b109e0f8f4a9d6418d2cba155',
  amount: '20',
  receiver: 'mmBqYHLaqp1NhnAnV31PgdkbnnNRmLZpVo',
  localSender: undefined,
  success: true }
 */
// this.events.on("outcomeSuccess",  ret=>console.log(ret) )

let checkUnconfirmedTransactions = () => {
  return new Promise ( (resolve, reject)=>{
    outcomedb.findIncomesNotSuccess()
    .then(ret=>{
      return Promise.map(ret, tx=>{
        btc.getTransaction(tx.transactionHash)
        .then(txdetail=>{
          if(txdetail.confirmations>0){
            let outcome = {
              alias:"btc",
              name:"btc",
              symbol:"btc",
              transactionHash:txdetail.txid,
              amount: tx.amount,
              receiver: tx.receiver,
              localSender: tx.localSender,
              success: true,
            }
            this.events.emit("outcomeSuccess",outcome)
            outcomedb.confirmSuccess(txdetail.txid)
            .catch(console.log).then(ret=>resolve())
          }
        })
      })
    })
    .then(resolve).catch(reject)
  })
}

console.info(`confirming transactions of btc`)
setInterval(checkUnconfirmedTransactions,1000)
