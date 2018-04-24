var Web3 = require("web3")
var web3 = new Web3( Web3.givenProvider
  || "ws://127.0.0.1:8546")

module.exports = web3
