exports.Transaction = require("./Transaction")
exports.Account = require("./Account")



var config = require("../Config")

// Verify the config file of erc20 tokens is correct



//start erc20 send back task
const ERC20SendBackTask = require("./ERC20SendBackTask")
// start king send back
let sendback = new ERC20SendBackTask({
    alias: "king",
    contractAddress: config.king.contractAddress,
    mainPrivateKey:  config.ethereum.mainPrivateKey,
    gas:             config.king.gas,
    gasPrice:        config.king.gasPrice,
    estimatedGas:    "50000"
})

sendback.start()
exports.ERC20SendBackTask = sendback
