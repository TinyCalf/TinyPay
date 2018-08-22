var web3 = require("./web3")
var config = require("../config")
const assert = require('assert');

var account = web3.eth.accounts.wallet.add({
  privateKey: config.ethereum.hotPrikey,
  address: config.ethereum.hotAddress
});
assert.strictEqual(account.address.toLowerCase(), config.ethereum.hotAddress.toLowerCase());

exports.mainAddress = account.address.toLowerCase()
exports.add = (prikey, address) => {
  web3.eth.accounts.wallet.add({
    privateKey: prikey,
    address: address
  })
}
exports.remove = address => {
  web3.eth.accounts.wallet.remove(address)
}