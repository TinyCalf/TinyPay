const web3_extended = require('web3_extended');
const BigNumber = require('bignumber.js');
const _PASSPHRASE = '77e7c96a'// 创建账户时的固定统一密码
const log = require("../Logs/log")("EthereumSerises/RPCMethods")
const db = require("../Database/db")//TODO 使用数据库查询耦合度太高，不利于扁平化程序设计
const config = require("../config.js").currencies


module.exports = function Rpc(name) {

  if(
    !config[name]
    || !config[name].host
    || !config[name].port
  ) throw new Error(name + " is not a vaild Ethereum")
  this.options = {
    host:"http://" + config[name].host + ":" + config[name].port,
    personal:true,
    admin:true,
    debug:true,
  }



  this.getRpc = () => web3_extended.create(this.options)
  this.toWei = this.getRpc().toWei
  this.fromWei = this.getRpc().fromWei
  this.name = name
  /*******************************************************************************

  Block相关

  ********************************************************************************/

  /*
  获取当前区块高度
  name=>height
  'eth'=>319
  */
  this.getHeight = () => {
    return new Promise ((resolve, reject) => {
      this.getRpc().eth.getBlockNumber( (err, height)=>{
        if(err) return reject(err)
        resolve(height);
      })
    })
  }


  /*
  获取某区块上的交易
  name,height=>transactions
  "eth",1639=>
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
  this.getTxByBlock = (height) => {
    return new Promise ((resolve, reject) => {
      this.getRpc().eth.getBlock(height, true ,(err, ret) => {
          if(err) return reject(err)
          resolve(ret.transactions)
      });
    })
  }


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
  var getAccounts = () => {
    return new Promise ( (resolve, reject) => {
      this.getRpc().getAccounts( (err, ret) => {
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
  this.getNewAccount = () => {
    return new Promise ( (resolve, reject) => {
      this.getRpc().personal.newAccount(_PASSPHRASE,(err, ret) => {
        if(err) return reject(err)
        //在数据库中添加该地址
        if(!ret) return reject("getNewAccount returns with no result")
        db.addAccountOfEthereumSeries(this.name, ret)
        .then(()=>resolve(ret))
        .catch(err=>reject(err))
      });
    })
  }


}


/*
发送资金
*/
// var sendTransaction = (from, to, value, callback) => {
//     //解锁本地from的地址
//     var unlock = new Promise( (resolve, reject) => {
//       _unlockAccount(from, (err, ret) => {
//         (!err) ? resolve (ret) : reject(err);
//       })
//     });
//
//     value = web3.toWei( value, 'ether');
//     var tx = {
//       from:   from,
//       to:     to,
//       value:  value,
//     };
//     web3.eth.sendTransaction( tx, _PASSPHRASE, (err,ret) => {
//       callback(err, ret);
//     });
// }


/*******************************************************************************

私有函数模块

********************************************************************************/

// /*
// 创建新账户 固定统一密码
// */
// var _newAccount = (callback) => {
//   web3.personal.newAccount(_PASSPHRASE,(err, ret) => {
//     callback(err,ret);
//   });
// }
//
// /*
// 解锁账户
// */
// var _unlockAccount = (address, callback) => {
//   web3.personal.unlockAccount(address, _PASSPHRASE, 300, (err, ret) => {
//     callback(err, ret);
//   });
// }

/*
开始挖矿 仅用于测试私有链环境
*/