var fs = require("fs")
var path = require("path")
var web3 = require("../web3")
var config = require("../config")

let abi = JSON.parse(
  fs.readFileSync(__dirname + "/erc20.abi").toString())

let Erc20 = class Erc20{
  /*
  alias
  symbol
  name
  gasPrice
  gas
  sendBackNeededGas
  address
  instance
  */
  constructor(config){
    if(!config.alias
    || !config.symbol
    || !config.name
    || !config.gasPrice
    || !config.gas
    || !config.sendBackNeededGas
    || !config.address)
    throw new Error(`Currency not found! Please check config file to see if there is a problem`)
    this.alias = config.alias
    this.symbol = config.symbol
    this.name = config.name
    this.gasPrice = config.gasPrice
    this.gas = config.gas
    this.sendBackNeededGas = config.sendBackNeededGas
    this.address = config.address
    this.instance = new web3.eth.Contract(abi, config.address)
  }
}


var aliases = config.ethereum.available_currency_alias
let contractInstances = {}
aliases.forEach( (c) => {
  if(!config[c])
    throw new Error
  let curr = config[c]
  if(curr.category != "erc20") return
  nErc20 = new Erc20({
    alias:c,
    symbol:curr.symbol,
    name:curr.name,
    gasPrice:curr.gasPrice,
    gas:curr.gas,
    sendBackNeededGas:curr.sendBackNeededGas,
    address:curr.contractAddress
  })
  nInstance = nErc20.instance
  contractInstances[c] = nErc20
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
