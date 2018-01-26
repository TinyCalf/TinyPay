/*
以太坊系列币种处理新增交易
*/
var Rpc = require('./Rpc')
var db = require('../Database/db')
var erc20db = require('../Database/erc20')
var erc20 = require('./ERC20.js')
var zmq = require('../Zeromq/zmqServer')
var config = require('../config.js')
var log = require('../Logs/log.js')("ERC20TransactionDealer")
var config = require('../config').currencies
/*
筛选出所有交易中向本地充值的交易
txs=>txs
[ { value: { [String: '2e+22'] s: 1, e: 22, c: [ 200000000 ] },
  from: '0xecf6e8cbb8633a3c490d587fa357ad20e21d4b93',
  to: '0x89bb2b310f9379986972bc2940461540591a332d',
  symbol: 'tinycalf' }, ... ]
*/
var selectLocalTxs = (txs) => {
  return new Promise ( (resolve, reject) => {
    var selectedTxsArray = []
    if(txs.length < 1) resolve(selectedTxsArray)
    var loop = (i) => {
      const promise = new Promise( (resolve, reject) => {
        erc20.getTokenTransferByTxid(txs[i].hash)
        .then(transfer=>{
          if(transfer){
            erc20db.hasAddress(transfer.symbol,transfer.to)
            .then(ret => {
              if(ret) selectedTxsArray.push(transfer)
              resolve();
            })
            .catch(err=>reject(err))
          }else{
            resolve();
          }
        })
        .catch(err=>reject(err))
      })
      .then( () => {
        (i < txs.length-1) ? loop(i+1) : resolve(selectedTxsArray)
      })
      .catch(err=>reject(err))
    }
    loop(0)
  })
}

/*
通过zmq发送所有新交易
*/
var zmqSendReceivedTxs = (rpc, txs, confirmations) => {
  return new Promise ( (resolve, reject) => {
    if(!txs[0]) {
      resolve()
      return
    }
    function loop(i) {
      const promise = new Promise( (resolve, reject) => {
        var tx = {
          name:             txs[i].symbol,
          category:         "receive",
          address:          txs[i].to,
          amount:           rpc.fromWei( txs[i].value, 'ether').toString(),
          confirmations:    confirmations,
          txid:             txs[i].hash,
        }

        //发送消息
        zmq.sendReceivedTxs(tx)
        .catch( err=>log.err(err) )
        //如果充值记录中没有该交易，则向其发送一笔交易以保证转出的矿工费用,并添加数据库
        db.findIncomeLogByTxid(tx.txid)
        .then(ret=>{
          if(!ret){
            erc20.transferNeededGas(tx.address, txs[i].value, txs[i].contractaddress)
            .catch(err=>{log.err(err)})
            //数据库保存该记录
            db.addIncomeLog(tx.name, tx.txid, txs[i].from, tx.address, tx.amount)
            .catch(err=>{log.err(err)})
          }
        })
        //如果达到确认数传回主账户
        if(confirmations>=config[rpc.name].confirmationsLimit) {
          //将交易回传到钱包，
          //eth.accounts[0]为中转钱包
          //如果eth的coldwalllet是eth.accounts[0]则打给自己
          //如果eth的coldwalllet是外部帐号，则通过eth.accounts[0]转到外部帐号上
          //该钱包必须留有eth
          var mainAccount = ""
          //获取主账户
          rpc.getMainAccount()
          // .then(account=>{
          //   mainAccount=account
          //   //开启该用户钱包token权限
          //   return erc20.approve(
          //     txs[i].to,
          //     mainAccount,
          //     rpc.toWei(100000),
          //     txs[i].contractaddress
          //   )
          // })
          // .then(hash=>{
          //   //从主账户转到指定冷钱包
          //   return erc20.transferFrom(
          //     mainAccount,
          //     txs[i].to,
          //     config[rpc.name].coldwallet,
          //     txs[i].value,
          //     txs[i].contractaddress,
          //   )
          // })
          .then(ret=>{
            mainAccount=ret
            return erc20.transferTokens(txs[i].to,
                                 mainAccount,
                                 txs[i].value,
                                 txs[i].contractaddress
                               )
          })
          .then(ret=>{
            log.info("ERC20 has been switched to main account, txid is "
              + txs[i].hash)
            //记录该笔转出
            return db.addOutcomeLog(
              txs[i].symbol,
              txs[i].hash,
              txs[i].to,
              config[rpc.name].coldwallet,
              rpc.fromWei( txs[i].value, 'ether').toString(),
            )
          })
          .catch( err=>log.err(err) )
        }
        resolve()
      })
      .then( () => {
        (i < txs.length-1) ? loop(i+1) : resolve()
      })
      .catch( err => { return reject(err) })
    }
    loop(0)
  })
}

/*
处理单个区块上的交易信息
name(币种),height（区块高）
*/
var dealWithOneBlock = (rpc, height, lastHeight) => {
  return new Promise ( (resolve, reject) => {
    log.info("ERC20" + " dealing with block " + height)
    //查询该高度上所有交易
    rpc.getTxByBlock(height)
    .then(txs=>{
      //筛选出充值到本地的交易
      return selectLocalTxs(txs)
    })
    .then(txs=>{
      //整合交易信息并通过消息队列发送
      return zmqSendReceivedTxs(rpc, txs, lastHeight-height)
    })
    .then(()=>{resolve()})
    .catch(err=>log.err(err))
  })
}


/*
从已记录高度到当前高度块之间的所有交易
name
*/
var dealWithUncheckedBlocks = (rpc, checkedHeight, lastHeight) => {
  return new Promise ( (resolve, reject) => {
    if(checkedHeight>=lastHeight)  return resolve()
    var loop = (height) => {
      dealWithOneBlock(rpc, height, lastHeight)
      .then( () => {
        (height < lastHeight-1) ? loop(height+1) : resolve()
      })
      .catch(err=>reject(err))
    }
    loop(checkedHeight)
  })
}

/*
处理交易
*/
var dealer = (rpc) => {
  return new Promise ( (resolve, reject) => {
    var checkedHeight = null;
    var lastHeight = null;
    //获取币种已记录高度
    db.getCheckedHeight("erc20")
    .then( height => {
      checkedHeight = height
      //获取当前高度
      return rpc.getHeight()
    })
    .then( height =>{
      lastHeight = height
      //处理高度差之间的所有交易
      var cfmts = config[rpc.name].confirmationsLimit
      // console.log(rpc.name + " " + checkedHeight + " " + lastHeight )
      return dealWithUncheckedBlocks(rpc, checkedHeight-cfmts, lastHeight)
    })
    .then(()=>{
      //更新已记录高度
      return db.updateCheckedHeight("erc20", lastHeight)
    })
    .catch(err=>reject(err))
  })
}


/*
循环函数
*/
var dealerLooper = (rpc, duration) => {
  return new Promise ( (resolve, reject) => {
    dealer(rpc).catch(err=>log.err(err))
    setInterval(
      ()=>{
        dealer(rpc).catch(err=>log.err(err))
      },
      duration || 1000 * 60 * 2
    )
    resolve()
  })
}

exports.start = () => {
  return new Promise ( (resolve, reject) => {
    log.info('Starting to deal with ERC20 tokens...')
    var rpc = new Rpc("eth")
    dealerLooper (rpc, config.eth.txCheckDuration)
    .then(()=>resolve())
    .catch(err=>reject(err))
  })
}
