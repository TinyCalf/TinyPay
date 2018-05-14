var currencydb = require("../Database/Currency.db")
var config = require("../../Config")
require("../../log")



/*auto init checked height if existed, nothing change*/
let initCurrencyData = []
let aliases = config.ethereum.available_currency_alias
aliases.forEach( (alias)=>{
  if(!config[alias] || !config[alias].startHeight) {
    console.error(`something wrong in ${alias}'s config file`)
    process.exit(1)
  }
  let data = {
    alias:alias,
    lastCheckedHeight:config[alias].startHeight
  }
  initCurrencyData.push(data)
})
initCurrencyData.forEach( (curr)=>{
  currencydb.init(curr)
  .then(ret=>{
    console.success(`init ${curr.alias}'s height succeed`)
    currencydb.checkHeight(curr.alias)
    .then(ret=>{
      if(ret < curr.lastCheckedHeight)
        currencydb.updateHeight(curr.alias, curr.lastCheckedHeight)
        .then(ret=>console.success(`${curr.alias}'s height has changed to
          ${curr.lastCheckedHeight}`))
        .catch(err=>{throw err})
    })
    .catch(err=>{throw err})

  })
  .catch(err=>{
    console.error(err)
    throw new Error(`init currencies failed`)
  })
})





// start deal with erc20 income
exports.erc20income = require("./erc20income")

// ether
exports.ether = require("./ether")

// start king
exports.king = require("./king")

// start deal with ether income
exports.etherincome = require("./etherIncome")

//start etheroutcome
exports.etheroutcome = require("./etherOutcome")

//start erc20outcome
exports.erc20outcome = require("./erc20outcome")
