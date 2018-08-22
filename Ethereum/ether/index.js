let currencydb = require('../Currency.db')
let config = require('../config')
currencydb.init({
    alias: "ether",
    lastCheckedHeight: config.ether.startHeight
  })
  .then(ret => {
    exports.account = require("./account")
    exports.withdraw = require("./withdraw")
    exports.recharge = require("./recharge")
  })