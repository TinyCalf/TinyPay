let currencydb = require('../Currency.db')
let config = require('../config')
let web3 = require('../lib/web3')
currencydb.init(config.ether.startHeight)
  .then(ret => {
    exports.account = require("./account")
    exports.withdraw = require("./withdraw")
    exports.recharge = require("./recharge")
  })

exports.getBalance = address => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address)
      .then(ret => {
        resolve(web3.utils.fromWei(ret))
      })
      .catch(ret => {
        reject(ret)
      })
  })
}