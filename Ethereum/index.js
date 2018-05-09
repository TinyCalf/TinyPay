exports.Transaction = require("./Transaction")
exports.Account = require("./Account")



var web3 = require("./web3")
var mongoose = require("../dbconnect").mongoose
var config = require("../Config")
var Parity = require("./parity")
var parity = new
Parity(`http://${config.ethereum.host}:${config.ethereum.rpcport}`)

//start erc20 send back task
const ERC20SendBackTask = require("./ERC20SendBackTask")
// start king send back
let sendback = new ERC20SendBackTask({
    alias: "king",
    contractAddress: config.king.contractAddress,
    mainPrivateKey: config.ethereum.mainPrivateKey,
    mongoose : mongoose,
    web3: web3,
    parity:parity,
    gas: config.king.gas,
    gasPrice:config.king.gasPrice,
    estimatedGas: "50000"
})

sendback.start()
exports.ERC20SendBackTask = sendback
