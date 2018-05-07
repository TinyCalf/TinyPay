var Web3 = require("web3")
var config = require("../Config")
//TODO 切换成config模式
module.exports = new Web3( Web3.givenProvider
  || `ws://${config.ethereum.host}:${config.ethereum.wsport}`)
