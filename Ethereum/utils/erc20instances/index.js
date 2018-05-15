var fs = require("fs")
var path = require("path")
var web3 = require("../web3")
var config = require("../config")

var abi = JSON.parse(
  fs.readFileSync(__dirname + "/erc20.abi").toString())
var aliases = config.ethereum.available_currency_alias
let contractInstances = {}
aliases.forEach( (c) => {
  if(!config[c])
    throw new Error(`Currency not found! Please check config file to see if there is a problem`)
  let curr = config[c]
  if(curr.category != "erc20") return
  if(!curr.category
    ||!curr.contractAddress
    || !curr.category
    || !curr.symbol
    || !curr.name
    || !curr.sendBackNeededGas)
    throw new Error(`Currency not found! Please check config file to see if there is a problem`)
  let web = web3()
  let nInstance = new web.eth.Contract(abi, curr.contractAddress)
  contractInstances[c] = {
    contractAddress: curr.contractAddress,
    instance: nInstance,
    alias:c,
    symbol:curr.symbol,
    name:curr.name,
    gasPrice:curr.gasPrice,
    gas:curr.gas,
    sendbackNeededGas:curr.sendBackNeededGas
  }
  nInstance.methods.name().call({}).then(ret=>{
    if(ret!=curr.name){
      console.error(`${c}'s name is wrong in config file`)
      process.exit(1)
    }
  })
  nInstance.methods.symbol().call({}).then(ret=>{
    if(ret!=curr.symbol){
    console.error(`${c}'s symbol is wrong in config file`)
      process.exit(1)
    }
  })
})


/*
[
  king:{
    contractAddress:
    instance:
    alias:
    symbol:
    name:
    gasPrice:
    gas:
    sendBackNeededGas:
  }
]
*/
module.exports = contractInstances
