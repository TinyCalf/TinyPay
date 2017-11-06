const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const rpcaddress = '127.0.0.1';
const rpcport = '8545';

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  var nrpc = "http://" + rpcaddress+ ":" + rpcport;
  web3 = new Web3(new Web3.providers.HttpProvider(nrpc));
}

exports.getBlock = (number, callback) => {
  web3.eth.getBlock(number, (err, ret) => {
      callback(err, ret);
  });
}


//
// var balance = new BigNumber('131242344353464564564574574567456');
//
// console.log(balance);
