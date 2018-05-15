require("./log")
Promise = require("bluebird")




let web3 = require("./web3")
exports.web3 = web3
// web3.eth.isSyncing().then(console.log).catch(console.log)




let parity = require("./parity")
exports.parity = parity
// parity.nextNonce("0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08")
// .then(console.log).catch(console.log)




let mongoose = require("./mongoose")
exports.mongoose = mongoose




let wallet = require("./wallet")
exports.wallet = wallet
// console.log(wallet.mainAddress)





let config = require("./config")
exports.config = config
// console.log(config)



//TODO: 增加block合account模块
// let block = require("./block")
// exports.block = block
// block.newBlock.on('newblock', (blockHeader) => {
//   console.log(blockHeader)
// });


let erc20instances = require("./erc20instances")
exports.erc20instances = erc20instances
// console.log(erc20instances)
