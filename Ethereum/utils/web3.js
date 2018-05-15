var Web3 = require("web3")
var config = require("../../Config")

module.exports = () =>{
  return new Web3( Web3.givenProvider
    || `ws://${config.ethereum.host}:${config.ethereum.wsport}`)
}
