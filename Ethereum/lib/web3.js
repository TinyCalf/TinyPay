var Web3 = require("web3")
var config = require("../config")

module.exports = new Web3(Web3.givenProvider ||
  `ws://${config.host}:${config.wsport}`)