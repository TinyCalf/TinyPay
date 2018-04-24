var Web3 = require("web3")
var web3 = new Web3( Web3.givenProvider
  || "ws://127.0.0.1:8546")


var Tx = require('ethereumjs-tx');
var privateKey = new Buffer('44482c1695badadd5670abf05cd9b3b9529f90491f69cad6ac59d1c3c4928a0d', 'hex')

var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a0000',
  gasLimit: '0x27100',
  to: '0x853187De87527E3dd9d9887Ee9FaB5D3cb4965B1',
  value: '0x01',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

console.log(serializedTx.toString('hex'))

web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.on('receipt', console.log)
.then(console.log).catch(console.log)
