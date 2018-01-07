var RPC = require('bitcoind-rpc')
var log = require('../Logs/log.js')("BitcoinSeriesRPC")
var config = require("../config").currencies

var rpcs = {}
for(	currency in config	) {
	if(	config[currency].category != "bitcoin"	) continue;
	rpcs[currency] = new RPC({
		protocol:		config[currency].protocol,
		host:				config[currency].host,
		port:				config[currency].port,
		user:				config[currency].user,
		pass:				config[currency].pass,
	});
}

/*******************************************************************************

Block相关

********************************************************************************/

/*
通过块高度获取哈系
*/
exports.getHashByBlockHeight = (name, height) => {
  return new Promise ( (resolve, reject) => {
    rpcs[name].getBlockHash(height, (err, ret) => {
        if(err) return reject(err);
				if(!ret) return reject( new Error("no result") )
        resolve(ret.result);
    });
  });
}


/*
通过块哈系获取高度
*/
exports.getHeightByBlockHash = (name, hash) => {
  return new Promise ( (resolve, reject) => {
    rpcs[name].getBlock(hash, (err, ret) => {
        if(err) return reject(err);
				if(!ret) return reject( new Error("no result") )
				if(!ret.result) return reject( new Error("no result") )
        resolve(ret.result.height);
    });
  });
}


/*
从某个块开始获取本节点相关交易 至少一个确认数
*/
exports.getTxsSinceBlockHash = (name, hash) => {
  return new Promise ( (resolve, reject) => {
    rpcs[name].listSinceBlock(hash, (err, ret) => {
        if(err) return reject(err);
				if(!ret) return reject( new Error("no result") )
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

/*******************************************************************************

Wallet相关

********************************************************************************/
/*
获取钱包余额
name=>balance
*/
exports.getBalance = (name) => {
	return new Promise ( (resolve, reject) => {
		rpcs[name].getbalance('', (err, ret) => {
        if(err) return reject(new Error(err))
				if(ret.err) return reject(ret.err)
				return resolve(ret.result)
    });
  });
}

// this.getbalance("rbtc")
// .then(ret=>console.log(ret))
// .catch(err=>console.log(err))


/*
获取某币钱包新地址
name => address
*/
exports.getnewaddress = (name) => {
	return new Promise ( (resolve, reject) => {
		rpcs[name].getnewaddress('', (err, ret) => {
        if(err) return reject(new Error(err))
				if(ret && ret.result){
					return resolve(ret.result)
				}
				return reject(name + " getnewaddress returned nothing")
    });
  });
}

/*
发送到某地址
params:
	name 货币名称 btc | bcc | ltc
	fromAccount 帐号名称 "exchange9158"
	toAddress 地址	"mx1BPrFw7B5R88k9qsLr3rQQkdHGbXyxhH"
	amount 数量  0.01
return：
	txid 交易单号 f14ee5368c339644d3037d929bbe1f1544a532f8826c7b7288cb994b0b0ff5d8
*/
exports.sendTransaction = (name, fromAccount, toAddress, amount) => {
	return new Promise ( (resolve, reject) => {
		rpcs[name].sendFrom(
			fromAccount,
			toAddress,
			amount,
			config[name].confirmationsLimit,
			(err, ret) => {
        if(err) return reject(err)
				if(ret.result) return resolve(ret.result)
				else return reject(new Error("no result"))
    })
  })
}

/*
regtest环境下产生区块
*/
exports.generate = (name, number) => {
	return new Promise ( (resolve, reject) => {
		rpcs[name].generate(
			number,
			(err, ret) => {
				if(err) return reject(err)
				if(ret.result) return resolve(ret.result)
				else return reject(new Error("no result"))
		})
	})
}

// this.sendTransaction("rbtc","","mpNQPrV8V9ZA9x5W9hDfYEvRnqh8GwwpqR",1)
// .then(ret=>console.log(ret))
// .catch(err=>console.log(err))
