var RPC = require('bitcoind-rpc');
var express = require("express");
var app = express();
var fs = require('fs');
var path = require('path');

//设置跨与访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//BTC
var btcrpc = new RPC({
	protocol:"http",
	host:'120.92.91.36',
	port:'8332',
	user:'ebo',
	pass:'ebo123',
});

//BCC
var bccrpc = new RPC({
	protocol:"http",
	host:'120.92.91.36',
	port:'10081',
	user:'ebo',
	pass:'ebo123',
});

//LTC
var ltcrpc = new RPC({
	protocol:"http",
	host:'120.92.91.36',
	port:'10000',
	user:'ebo',
	pass:'ebo123',
});

//tBTC
var tbtcrpc = new RPC({
	protocol:"http",
	host:'127.0.0.1',
	port:'18332',
	user:'ebo',
	pass:'ebo123',
});

//
// bccrpc.getInfo(function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });

// btcrpc.getInfo(function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });

// ltcrpc.getInfo(function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });

// tbtcrpc.getInfo(function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });

// tbtcrpc.setAccount("user1",function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });


//
// tbtcrpc.getNewAddress("user2",function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });

//mz9Q1y28bM8ibrk8RFY4JZtoAjyW82Rh8e


//获取某账户的比特比地址
// tbtcrpc.getAddressesByAccount("user1",function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//
//   console.log(ret);
// });

btcrpc.getNewAddress("",function (err, ret) {
	if(err) {
		console.log(err);
	}
  console.log(ret);
  console.log("btc");
});

ltcrpc.getNewAddress("",function (err, ret) {
	if(err) {
		console.log(err);
	}
  console.log(ret);
  console.log("ltc");
});

bccrpc.getNewAddress("",function (err, ret) {
	if(err) {
		console.log(err);
	}
  console.log(ret);
  console.log("bcc");
});

// //获取某账户总余额度
// tbtcrpc.getReceivedByAccount("user1",function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });

// tbtcrpc.getBalance("",function (err, ret) {
// 	if(err) {
// 		console.log(err);
// 	}
//   console.log(ret);
// });

// abandonTransaction: 'str',
// addMultiSigAddress: '',
// addNode: '',
// backupWallet: '',
// createMultiSig: '',
// createRawTransaction: '',
// decodeRawTransaction: '',
// dumpPrivKey: '',
// encryptWallet: '',
// estimateFee: 'int',
// estimatePriority: 'int',
// generate: 'int',
// getAccount: '',
// getAccountAddress: 'str',
// getAddedNodeInfo: '',
// getAddressMempool: 'obj',
// getAddressUtxos: 'obj',
// getAddressBalance: 'obj',
// getAddressDeltas: 'obj',
// getAddressTxids: 'obj',
// getAddressesByAccount: '',
// getBalance: 'str int',
// getBestBlockHash: '',
// getBlockDeltas: 'str',
// getBlock: 'str bool',
// getBlockchainInfo: '',
// getBlockCount: '',
// getBlockHashes: 'int int obj',
// getBlockHash: 'int',
// getBlockHeader: 'str',
// getBlockNumber: '',
// getBlockTemplate: '',
// getConnectionCount: '',
// getChainTips: '',
// getDifficulty: '',
// getGenerate: '',
// getHashesPerSec: '',
// getInfo: '',
// getMemoryPool: '',
// getMemPoolInfo: '',
// getMiningInfo: '',
// getNewAddress: '',
// getPeerInfo: '',
// getRawMemPool: '',
// getRawTransaction: 'str int',
// getReceivedByAccount: 'str int',
// getReceivedByAddress: 'str int',
// getSpentInfo: 'obj',
// getTransaction: '',
// getTxOut: 'str int bool',
// getTxOutSetInfo: '',
// getWork: '',
// help: '',
// importAddress: 'str str bool',
// importPrivKey: 'str str bool',
// invalidateBlock: 'str',
// keyPoolRefill: '',
// listAccounts: 'int',
// listAddressGroupings: '',
// listReceivedByAccount: 'int bool',
// listReceivedByAddress: 'int bool',
// listSinceBlock: 'str int',
// listTransactions: 'str int int',
// listUnspent: 'int int',
// listLockUnspent: 'bool',
// lockUnspent: '',
// move: 'str str float int str',
// prioritiseTransaction: 'str float int',
// sendFrom: 'str str float int str str',
// sendMany: 'str obj int str',  //not sure this is will work
// sendRawTransaction: 'str',
// sendToAddress: 'str float str str',
// setAccount: '',
// setGenerate: 'bool int',
// setTxFee: 'float',
// signMessage: '',
// signRawTransaction: '',
// stop: '',
// submitBlock: '',
// validateAddress: '',
// verifyMessage: '',
// walletLock: '',
// walletPassPhrase: 'string int',
// walletPassphraseChange: '',
