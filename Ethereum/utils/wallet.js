var web3 = require("./web3")
var config = require("./config")
const assert = require('assert');

var account = web3.eth.accounts.wallet.add(
    config.ethereum.mainPrivateKey
);
assert.strictEqual(account.address.toLowerCase(), config.ethereum.mainAccount.toLowerCase());

exports.mainAddress = account.address

// console.log(account)
// { address: '0x1351998De6246EF92a2DaC2Bc7ec62aB04aF9159',
//   privateKey: '2be4f5186bafb2cff2f7e0916c7d2b9c0d57cbf701b3e1d385de1335380df4e9',
//   signTransaction: [Function: signTransaction],
//   sign: [Function: sign],
//   encrypt: [Function: encrypt],
//   index: 0 }
