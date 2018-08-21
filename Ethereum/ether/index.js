let currencydb = require('../Currency.db')
currencydb.init({
  alias: "ether",
  lastCheckedHeight: 20
})

exports.account = require("./account")
exports.withdraw = require("./withdraw")
exports.recharge = require("./recharge")