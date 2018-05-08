var web3 = require("../web3")
var mongoose = require("../../dbconnect").mongoose
var config = require("../../Config")
var Parity = require("../parity")
var parity = new
Parity(`http://${config.ethereum.host}:${config.ethereum.rpcport}`)

const Sendback = require("./index")

let sendback = new Sendback({
    alias: "king",
    contractAddress: "0x53565FEbe212Fc43392Fdf01aE19CCd3d492695A",
    mainPrivateKey:"0xe78dd8f82f884b144381fa7c722fdef191273b8955306cf0129ff8b80c5390c6",
    mongoose : mongoose,
    web3: web3,
    parity:parity,
    gas: "100000",
    gasPrice:"4000000000",
    estimatedGas: "50000"
})

// sendback.addAddressToBeSentBack("0xb02d2693f4b0d7fd1221be056a275005ffc327af")
// .then(console.log).catch(console.log)
//
// sendback._findAllAndConfirmSentGas()
// .then(console.log).catch(console.log)


// sendback._findAllAndConfirmSentGas()
// .then(console.log).catch(console.log)


// sendback._findOneAndSendBack()
// .then(console.log).catch(console.log)

//
// sendback._findAllAndConfirmSentBack()
// .then(console.log).catch(console.log)

sendback.start()
