var currencydb = require("../Database/Currency.db")
var config = require("../../Config")
require("../../log")



/*auto init checked height if existed, nothing change*/
var initCurrencyData = [
  {alias: "king", lastCheckedHeight:config.king.startHeight},
  {alias: "ether", lastCheckedHeight:config.ether.startHeight}
]
currencydb.init(initCurrencyData)
.then(ret=>{
  console.success(`init currencies' height succeed`)
})
.catch(err=>{
  console.error(err)
  throw new Error(`init currencies failed`)
})


// start deal with erc20 income
exports.erc20income = require("./erc20income")

// start king
exports.king = require("./king.js")
