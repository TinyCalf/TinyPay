var web3 = require("./web3")
var config = require("../config")
const assert = require('assert');

var account = web3.eth.accounts.wallet.add(
  config.ethereum.hotPrikey
);
assert.strictEqual(account.address.toLowerCase(), config.ethereum.hotAddress.toLowerCase());

exports.mainAddress = account.address.toLowerCase()