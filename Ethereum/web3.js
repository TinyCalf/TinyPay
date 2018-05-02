var Web3 = require("web3")
//TODO 切换成config模式
module.exports = new Web3( Web3.givenProvider
  || "ws://127.0.0.1:8546")
