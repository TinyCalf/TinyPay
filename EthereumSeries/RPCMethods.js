const web3_extended = require('web3_extended');
const BigNumber = require('bignumber.js');
const rpcaddress = '127.0.0.1';
const rpcport = '8545';
const _PASSPHRASE = '77e7c96a'// 创建账户时的固定统一密码
const log = require("../Logs/log")("EthereumSerises/RPCMethods")
const db = require("../Database/db")
var ethoptions = {
  host:"http://" + rpcaddress+ ":" + rpcport,
  personal:true,
  admin:true,
  debug:true,
}

var ethrpc = web3_extended.create(ethoptions);


// ./geth --rpc --rpcapi "db,eth,net,web3,personal" console 2>> ./eth.log
//
// ./geth --datadir "./data" init init.json
// ./geth --rpc --rpccorsdomain "*" --datadir "./data" --ipcdisable --networkid 123456 -rpcapi "personal,db,eth,net,web3" console 2>> ./eth.log
// personal.unlockAccount("0x7bd7ae5383435c83a24673ca6301ce7b39380b40","77e7c96a",50000)
// eth.sendTransaction({from:"0x7bd7ae5383435c83a24673ca6301ce7b39380b40",to:"0xc2b9ed5c6e493cdf88f977125cb3f6d57dc8ed84",value:100})




/*DEMO*/
//
// var newAccount =  web3.personal.newAccount("web3 created account");
// console.log(newAccount);

// var datadir = web3.admin.datadir();
// console.log(datadir);

//启动geth
//    ./geth --dev --rpc --rpcapi "db,eth,net,web3,personal" --datadir "./data" console 2>> ./eth.log
//    ./geth --syncmode "full" --rpc --rpcapi "db,eth,net,web3,personal" --datadir "./data" console 2>> ./eth.log
//    personal.newAccount('77e7c96a')
//    miner.start();
//    eth.getBalance("0x52c53b4d74f7aa5846e001084814c4fd223c56cc");


//test
//newAccount((err, ret) => {console.log(ret)});

/*
发送资金
*/
//newAccount((err, ret) => {console.log(ret)});

// var tx = {
//   from:  "0x52c53b4d74f7aa5846e001084814c4fd223c56cc",
//   to:    "0x9c5192907bf1b6e3e84669bcdb2d3cd608b9f543",
//   value: web3.toWei('200', 'ether'),
// };
//
// web3.eth.sendTransaction( tx, _PASSPHRASE, (err,ret) => {
//   console.log(err);
//   console.log(ret);
// })
//0x52c53b4d74f7aa5846e001084814c4fd223c56cc
//0x9c5192907bf1b6e3e84669bcdb2d3cd608b9f543


/*
发送资金
*/
var sendTransaction = (from, to, value, callback) => {
    //解锁本地from的地址
    var unlock = new Promise( (resolve, reject) => {
      _unlockAccount(from, (err, ret) => {
        (!err) ? resolve (ret) : reject(err);
      })
    });

    value = web3.toWei( value, 'ether');
    var tx = {
      from:   from,
      to:     to,
      value:  value,
    };
    web3.eth.sendTransaction( tx, _PASSPHRASE, (err,ret) => {
      callback(err, ret);
    });
}


/*******************************************************************************

私有函数模块

********************************************************************************/

/*
创建新账户 固定统一密码
*/
var _newAccount = (callback) => {
  web3.personal.newAccount(_PASSPHRASE,(err, ret) => {
    callback(err,ret);
  });
}

/*
解锁账户
*/
var _unlockAccount = (address, callback) => {
  web3.personal.unlockAccount(address, _PASSPHRASE, 300, (err, ret) => {
    callback(err, ret);
  });
}

/*
开始挖矿 仅用于测试私有链环境
*/


/*******************************************************************************

Block相关

********************************************************************************/


/*
获取当前区块高度
=>height
=>319
*/
exports.getHeight = () => {
  return new Promise ((resolve, reject) => {
    ethrpc.eth.getBlockNumber( (err, height)=>{
      if(err) return reject(err)
      resolve(height);
    })
  })
}

/*
获取块
*/
var getBlock = (number) => {
  return new Promise ((resolve, reject) => {
    ethrpc.eth.getBlock(number, true,(err, ret) => {
        if(err) return reject(err)
        resolve(ret);
    });
  })
}


/*
获取某区块上的交易
height=>transactions
1639=>
[ { blockHash: '0x798ba5a7086f08030c0a32c1a69536b8854daa49a6850e4c10e05347dbf85c99',
    blockNumber: 1639,
    from: '0xc2b9ed5c6e493cdf88f977125cb3f6d57dc8ed84',
    gas: 90000,
    gasPrice: { [String: '18000000000'] s: 1, e: 10, c: [Array] },
    hash: '0x1e7a105eb679b10520e59154f8530461d95487557fd3467a3d8fbf8354a47ad0',
    input: '0x',
    nonce: 0,
    to: '0xff68ccf645a0b11e8b2613d67f26459a5da62a9f',
    transactionIndex: 0,
    value: { [String: '50000000000000000000'] s: 1, e: 19, c: [Array] },
    v: '0x3c4a4',
    r: '0x5b5dce0caafbef10417832f4da8fb8df450acf3f3c1fce271551fd81a0905f95',
    s: '0x1c8b502b215e1c3bf324ab52f40ffd12305f509ad9f223ca99d8191b96246a7e' } ]
*/
//TODO 这个函数为标准错误输出形式，其他的需要修改
exports.getTxByBlock = (height) => {
  return new Promise ((resolve, reject) => {
    ethrpc.eth.getBlock(height, true ,(err, ret) => {
        if(err) return reject(err)
        resolve(ret.transactions)
    });
  })
}

// this.getTxByBlock(1639)
// .then(ret=>log.info(ret))
// .catch(err=>log.err(err))


/*******************************************************************************

Wallet相关

********************************************************************************/

/*
获取所有账户
name=>array
eth=>
[ '0x52c53b4d74f7aa5846e001084814c4fd223c56cc',
  '0x9c5192907bf1b6e3e84669bcdb2d3cd608b9f543', ]

*/
var getAccounts = (name) => {
  return new Promise ( (resolve, reject) => {
    //先只接ETH
    name = "eth"
    ethrpc.eth.getAccounts( (err, ret) => {
      if(err) return reject(err)
      resolve(ret)
    })
  })
}

/*
创建新账户并获取其地址
name    =>    address
eth     =>    0x2e4df2e71b58e1fd372857b0e17e6f3cfd475f3e
*/
exports.getNewAccount = (name) => {
  return new Promise ( (resolve, reject) => {
    //先只接ETH
    name = "eth"
    ethrpc.personal.newAccount(_PASSPHRASE,(err, ret) => {
      if(err) return reject(err)
      //在数据库中添加该地址
      if(!ret) return reject("getNewAccount returns with no result")
      db.addAccountOfEthereumSeries(name, ret)
      .then(()=>resolve(ret))
      .catch(err=>reject(err))
    });
  })
}


// this.getNewAccount("eth")
// .then(ret=>console.log(ret))
// .catch(err=>log.err(err))

// var looper = (times) => {
//     if (times <= 0) {
//       return
//     }
//     this.getNewAccount("eth")
//     .then(ret => {
//       log.info(times+ " " +ret)
//       times--;
//       looper(times)
//     })
//     .catch( err => log.err(err))
// }
//
// looper(1000);
// looper(1000);
// looper(1000);
// looper(1000);
// looper(1000);
// looper(1000);
// looper(1000);
// looper(1000);
// looper(1000);
// looper(1000);

// var looper = (times) => {
//     if (times <= 0) {
//       return
//     }
//     this.getNewAccount("eth")
//     .then(ret => {
//       log.info(times+ " " +ret)
//       times--;
//       looper(times)
//     })
//     .catch( err => log.err(err))
// }








/*

*/


/*

*/

// var balance = new BigNumber('131242344353464564564574574567456');
//
// console.log(balance);
