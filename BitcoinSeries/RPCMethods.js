var RPC = require('bitcoind-rpc')
var log = require('../Logs/log.js')("BitcoinSeriesRPC")

//BTC
var _btcrpc = new RPC({
	protocol:"http",
	host:'120.92.91.36',
	port:'8332',
	user:'ebo',
	pass:'ebo123',
});

//BCC
var _bccrpc = new RPC({
	protocol:"http",
	host:'120.92.91.36',
	port:'10081',
	user:'ebo',
	pass:'ebo123',
});

//LTC
var _ltcrpc = new RPC({
	protocol:"http",
	host:'120.92.91.36',
	port:'10000',
	user:'ebo',
	pass:'ebo123',
});

//RBTC
var _rbtcrpc = new RPC({
	protocol:"http",
	host:'120.92.91.36',
	port:'10084',
	user:'ebo',
	pass:'ebo123',
});

var _rpcs = {
  btc:_btcrpc,
  ltc:_ltcrpc,
  bcc:_bccrpc,
	rbtc:_rbtcrpc
}




/*******************************************************************************

Block相关

********************************************************************************/

/*
通过块高度获取哈系
*/
exports.getHashByBlockHeight = (name, height) => {
  return new Promise ( (resolve, reject) => {
    _rpcs[name].getBlockHash(height, (err, ret) => {
        if(err)reject(err);
        resolve(ret.result);
    });
  });
}

/*
通过块哈系获取高度
*/
exports.getHeightByBlockHash = (name, hash) => {
  return new Promise ( (resolve, reject) => {
    _rpcs[name].getBlock(hash, (err, ret) => {
        if(err) reject(err);
        resolve(ret.result.height);
    });
  });
}


/*
从某个块开始获取本节点相关交易 至少一个确认数
*/
exports.getTxsSinceBlockHash = (name, hash) => {
  return new Promise ( (resolve, reject) => {
    _rpcs[name].listSinceBlock(hash, (err, ret) => {
        if(err)reject(err);
        resolve(ret);
    });
  });
}

/*
从某个块开始获取本节点相关交易 （Height）
*/
exports.getTxsSinceBlock = (name, height) => {
  return new Promise ( (resolve, reject) => {
    this.getHashByBlockHeight(name, height)
    .then( hash => {
      return this.getTxsSinceBlockHash(name, hash);
    })
    .then( txs => {
      resolve( txs );
    })
    .catch(err => {
      reject( err );
    })
  });
}

//
//
//
//
// this.getHeightByBlockHash('btc', '00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048')
// .then( txs => console.log(txs) )
// .catch ( err => console.log(err))
