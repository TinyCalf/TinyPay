const web3_extended = require('web3_extended');
const BigNumber = require('bignumber.js');
const rpcaddress = '127.0.0.1';
const rpcport = '8545';
const _PASSPHRASE = '77e7c96a'// 创建账户时的固定统一密码

var ethoptions = {
  host:"http://" + rpcaddress+ ":" + rpcport,
  personal:true,
  admin:true,
  debug:true,
}

var ethrpc = web3_extended.create(ethoptions);


// ./geth --rpc --rpcapi "db,eth,net,web3,personal" console 2>> ./eth.log
//



/*DEMO*/
//
// var newAccount =  web3.personal.newAccount("web3 created account");
// console.log(newAccount);

// var datadir = web3.admin.datadir();
// console.log(datadir);

//启动geth
//    ./geth --dev --rpc --rpcapi "db,eth,net,web3,personal" --datadir "./data" console 2>> ./eth.log
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
      if(err) reject(err)
      resolve(height);
    })
  })
}

/*
获取块
*/
exports.getBlock = (number, callback) => {
  return new Promise ((resolve, reject) => {
    ethrpc.eth.getBlock(number, (err, ret) => {
        if(err) reject(err)
        resolve(ret);
    });
  })
}


/*******************************************************************************

Wallet相关

********************************************************************************/


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
      if(err) reject(err)
      resolve(ret)
    });
  })
}



/*

*/
this.getHeight()
.then(ret=>console.log(ret))
.catch(err=>console.log(err))

/*

*/

// var balance = new BigNumber('131242344353464564564574574567456');
//
// console.log(balance);
