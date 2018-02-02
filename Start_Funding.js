
const BigNumber = require('bignumber.js')
const BitcoinRPC = require('./BitcoinSeries/RPCMethods')
const EthereumRPC = require('./EthereumSeries/Rpc')
const ERC20RPC = require('./EthereumSeries/ERC20')
const bodyParser = require('body-parser')
const config = require('./config.js')
const log = require("./Logs/log")("apiv1")
var ipaddr = require('ipaddr.js'); // ip转换用
var db = require("./Database/db")
var S = require('string')


var fundingConfig = {
  checkInterval: 3, // 3 seconds
}

var lastFundingTime = null
// If parameter 'startNow' not given,
//  don't start fund saving when launched.
if (process.argv.slice(2).indexOf('startNow') < 0) {
  lastFundingTime = new Date()
}

/**
 * Fund saving procedure for Bitcoin-like cryptocurrency
 * @param name name of the cryptocurrency in config.js
 */
function btcFundSaving(name) {
  let btcMainAddress = null
  let sendAmount = null
  BitcoinRPC.getnewaddress(name).then((address) => {
    //console.log('ADDRESS:')
    //console.log(address)
    btcMainAddress = address
    return BitcoinRPC.getBalance(name)
  }).then( (amount) => {
    //console.log('AMOUNT:')
    //console.log(amount)
    sendAmount = new BigNumber(amount).div(2)
    
    let to = config.currencies[name].coldwallet
    if (!S(to).isEmpty()) {
      return BitcoinRPC.sendTransaction(name, "", to, sendAmount.toString())
        .then( txid => {
          log.info("sent " + sendAmount + " " + name + " to " + to + ' ' + "txid is " + txid)
          db.addOutcomeLog(name, txid, "main", to, sendAmount, 'daily fund saving').catch(err=>{console.log(err)})
        })
    }else {
      log.info(`${name} coldwallet is empty, fund saving cannot be performed`)
    }
  }).catch((err) => {
    console.log('ERROR:')
    console.log(err)
  })
}


/**
 * Fund saving procedure for Ethereum-like cryptocurrency
 * @param name name of the cryptocurrency in config.js
 */
function ethFundSaving(name) {
  
  var ethRpc = new EthereumRPC(name)
  var sendAmount = null
  
  var mainAccount = null
  ethRpc.getMainAccount().then((account) => {
    //console.log('ACCOUNT:')
    //console.log(account)
    mainAccount = account
    return ethRpc.getBalance(account)
  }).then((amount) => {
    //console.log('AMOUNT:')
    //console.log(amount)
    //console.log('MAIN ACCOUNT:')
    //console.log(mainAccount)

    sendAmount = new BigNumber(amount)
    sendAmount = sendAmount.div(2)

    let to = config.currencies[name].coldwallet
    if (!S(to).isEmpty()) {
      return ethRpc.sendTransaction(mainAccount, sendAmount)
        .then( (txid) => {
          to = mainAccount
          log.info("sent " + sendAmount + " " + name + " to " + to + " txid is " + txid)
          db.addOutcomeLog(name, txid, "main", to, sendAmount).catch(err=>{console.log(err)})
        })
    }else {
      log.info(`${name} coldwallet is empty, fund saving cannot be performed`)
    }
  }).catch((err) => {
    console.log('ERROR:')
    console.log(err)
  })
}


/**
 * Fund saving procedure for ERC20-Ethereum cryptocurrency
 * @param name name of the cryptocurrency in config.js
 */
function erc20FundSaving(name) {
  if (!config.currencies.eth) {
    return
  }

  var ethRpc = new EthereumRPC('eth')
  var mainAccount = null
  var sendAmount = null
  var erc20Def = null

  if (config.currencies.eth.erc20) {
    for (i=0;i<config.currencies.eth.erc20.length;i++) {
      let erc20Item = config.currencies.eth.erc20[i]
      if (erc20Item.symbol == name) {
        erc20Def = erc20Item
        break
      }
    }
  }

  if (!erc20Def) {
    return
  }

  ethRpc.getMainAccount().then((account) => {
    console.log('ACCOUNT:')
    console.log(account)
    mainAccount = account
    
    return ERC20RPC.getBalance(account, erc20Def.contractAddress)
  }).then((amount) => {
    amount = new BigNumber(amount)
    console.log('AMOUNT:')
    console.log(ethRpc.fromWei(amount.div(1).toString()))
    sendAmount = ethRpc.fromWei(amount).div(2)
    
    let to = config.currencies.eth.coldwallet
    return ERC20RPC.transferTokens(
      mainAccount,
      to,
      ERC20RPC.rpc.toWei(sendAmount),
      erc20Def.contractAddress)
  }).then( (txid) => {
    let to = config.currencies.eth.coldwallet
    let name = erc20Def.symbol
    log.info("sent " + sendAmount + " " + name + " to " + to + ' ' +"txid is " + txid)
    db.addOutcomeLog(name, txid, "main", to, sendAmount).catch(err=>{})
  }).catch((err) => {
    console.log('ERROR:')
    console.log(err)
  })
}

function doFundSaving() {
  for (name in config.currencies) {
    if (config.currencies[name].category == 'bitcoin') {
      console.log('btcFundSaving(name)' + name)
    }if (config.currencies[name].category == 'ethereum') {
      console.log('ethFundSaving(name)' + name)
    }
  }

  if ((config.currencies.eth) && (config.currencies.eth.erc20)) {
    config.currencies.eth.erc20.forEach((erc20Def) => {
      console.log('erc20FundSaving(erc20Def.symbol)' + erc20Def.symbol)
    })
  }
}



function isTimeToFunding(time) {
  if (lastFundingTime) {
    if ((lastFundingTime.getFullYear() == time.getFullYear())
        && (lastFundingTime.getMonth() == time.getMonth())
        && (lastFundingTime.getDate() == time.getDate())) {
      
      return false
    }else {
      return true
    }
  }else {
    return true
  }
}

function scheduleStep() {
  var time = new Date()
  if (isTimeToFunding(time)) {
    lastFundingTime = time
    console.log('funding')
    doFundSaving()
  }
  // else {
  //   console.log('do nothing')
  // }
}

function firstStep() {
  setInterval(function() { scheduleStep() }, fundingConfig.checkInterval * 1000)
}

firstStep()
