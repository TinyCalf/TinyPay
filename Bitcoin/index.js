let btc = require("./Bitcoin")
let config = require("./config")
let outcomedb = require("./bitcoin_outcome.db")
let outcome = require("./outcome")
let Event = require("events")
let bitcoindb = require("./bitcoin.db")

bitcoindb.updateHeight(config.startHeight)

let income = require("./income")
income.start()

exports.events = new Event()


exports.getBalance = (address) => {
  return new Promise((resolve, reject) => {
    btc.getBalance(address)
      .then(ret => {
        resolve(ret.toString(10))
      })
      .catch(reject)
  })
}


/*
{ alias: 'btc',
  symbol: 'btc',
  name: 'btc',
  category: 'bitcoin',
  address: 'mmBqYHLaqp1NhnAnV31PgdkbnnNRmLZpVo' }

 */
exports.getNewAccount = () => {
  return new Promise((resolve, reject) => {
    btc.getNewAddress()
      .then(ret => {
        let data = {
          alias: "btc",
          symbol: "btc",
          name: "btc",
          category: "bitcoin",
          address: ret
        }
        resolve(data)
      })
      .catch(reject)
  })
}

/*
236ef5c22149ab825e9106f7b0ace4501cfcb2a27a05582e65a5e20e1e9e6df0
 */
exports.withdraw = (to, amount) => {
  return new Promise((resolve, reject) => {
    let hash = ""
    btc.sendToAddress(to, amount)
      .then(ret => {
        hash = ret
        return outcomedb.appendRecord({
          transactionHash: ret,
          receiver: to,
          amount: Number(amount),
          alias: "btc",
          symbol: "btc",
          localSender: "main",
          success: false,
        })
      })
      .then(ret => resolve(hash))
      .catch(err => reject(err))
  })
}



outcome.events.on("outcomeSuccess", outcome => {
  this.events.emit("outcomeSuccess", outcome)
})


income.events
  .on("newIncome", income => {
    this.events.emit("newIncome", income)
  })
  .on("confirmationUpdate", income => {
    this.events.emit("confirmationUpdate", income)
  })