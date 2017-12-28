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
  this.getAccounts = () => {
    return new Promise ( (resolve, reject) => {
      this.getRpc().eth.getAccounts( (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  /*
  获取主钱包地址，即accounts第一条
  */
  this.getMainAccount = () => {
    return new Promise ( (resolve, reject) => {
      this.getAccounts()
      .then( (ret)=>{
        if(!ret[0]) return reject("no main account!")
        resolve(ret[0])
      })
      .catch( err=> {
        reject(err)
      })
    })
  }

  /*
  获取当前 gas价格 单位wei
  */
  this.getGasPrice = () => {
    return new Promise ( (resolve, reject) => {
      this.getRpc().eth.getGasPrice(  (err, ret) => {
        if(err) return reject(err)
        //ret = Number(this.fromWei(ret))
        resolve(ret)
      })
    })
  }

  /*
  计算交易需要花费的 gas wei
  tx
  {
  to:
  from:
  value:
  }
  */
  this.estimateGas = (tx) => {
    return new Promise ( (resolve, reject) => {
      this.getRpc().eth.estimateGas(  tx ,(err, ret) => {
        if(err) return reject(err)
        //ret = Number(this.fromWei(ret))
        resolve(ret)
      })
    })
  }

  /*
  计算交易总花费 单位 wei
  */
  // this.getFee = () => {
  //   return new Promise ( (resolve, reject) => {
  //     var gas = null
  //     var gasPrice = null
  //     this.getGasPrice()
  //     .then(ret=>{
  //       gasPrice = ret
  //       return this.estimateGas()
  //     })
  //     .then(ret=>{
  //       gas = ret
  //       resolve( gasPrice * gas )
  //     })
  //     .catch(err=>reject(err))
  //   })
  // }



  /*
  获取账户余额 wei
  */
  this.getBalance = (account) => {
    return new Promise ( (resolve, reject) => {
      this.getRpc().eth.getBalance( account ,(err, ret) => {
        if(err) return reject(err)
        resolve( ret )
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

  /*
  解锁账户
  account
  0xff7d1bbd14407128035a1e6a8287e4f2d74ce798
  */
  this.unlock = (account) => {
    return new Promise ( (resolve, reject) => {
      this.getRpc()
      .personal
      .unlockAccount(account, _PASSPHRASE, 300, (err,ret)=>{
        if(err) return reject(err)
        resolve()
      })
    })
  }


  /*
  提现发送资金 从主钱包发送到
  0xff7d1bbd14407128035a1e6a8287e4f2d74ce798,
  0x5cbc821662a16168974d4fa147720f0fde73d80b
  1.2
  */
  this.sendTransaction = ( to, value) => {
    return new Promise ( (resolve, reject) => {
      var mainAccount = null
      this.getMainAccount()
      .then((ret)=>{
        mainAccount = ret
        return this.unlock(ret)
      })
      .then(() => {
        //发送资金
        value = this.getRpc().toWei( value, 'ether')
        var tx = {
          from:   mainAccount,
          to:     to,
          value:  value,
        }
        this.getRpc().eth.sendTransaction( tx, _PASSPHRASE, (err,ret) => {
          if(err) return reject(err)
          resolve(ret)
        });
      })
      .catch(err=>{return reject(err)})
    })
  }

  /*
  发送普通交易
  tx
  {
  from:
  to:
  value:
  gas:
  gasPrice:
  }
  */
  this.sendNormalTransaction = (tx) => {
    return new Promise ( (resolve, reject) => {
      this.unlock(tx.from)
      .then(() => {
        this.getRpc().eth.sendTransaction( tx, _PASSPHRASE, (err,ret) => {
          if(err) return reject(err)
          resolve(ret)
        });
      })
      .catch(err=>{return reject(err)})
    })
  }

  /*
  回收账户资金到主账户
  PARAMS：
    account 账户
    minLimit 下限 单位ether
  RETURN:
    null
  */
  this.sendToMainAccount = ( account, minLimit) => {
    return new Promise ( (resolve, reject) => {
      var balance = null
      var gas = null
      var gasPrice = null
      var mainAccount = config[this.name].coldwallet
      var tx = {}
      this.getBalance(account)
      .then(ret=>{
        balance = ret
        return this.getGasPrice()
      })
      .then(ret=>{
        gasPrice = ret
        tx = {
          from:account,
          to:mainAccount,
          value:balance
        }
        return this.estimateGas(tx)
      })
      .then(ret=>{
        gas = ret
        tx = {
          from:account,
          to:mainAccount,
          value:balance-gas*gasPrice,
          gas:gas,
          gasPrice:gasPrice
        }
        if(tx.value < minLimit) reject(new Error("amout below limit"))
        //发送交易到主钱包
        return this.sendNormalTransaction( tx)
      })
      .then(ret=>{
        //增加数据
        db.addOutcomeLog(this.name, ret, account, mainAccount, this.fromWei(tx.value)).catch(err=>{console.log(err)})
        resolve(ret)
      })
      .catch(err=>reject(err))
    })
  }

  /*
  dev网络开启挖矿
  */
  // this.startMiner = () => {
  //   return new Promise ( (resolve, reject) => {
  //     this.getRpc().miner.start( 1, (err,ret) => {
  //       if(err) return reject(err)
  //       resolve()
  //     })
  //   })
  // }

  /*

  */
}




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
