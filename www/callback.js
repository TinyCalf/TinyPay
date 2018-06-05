require("../log")
var Ethereum = require("../Ethereum")
var Bitcoin = require("../Bitcoin")
var config = require("../Config")
var db = require("./Database/Callbackqueue.db")
var request = require("request")

var findOneAndSend = () => {
  db.findOneUnreceived()
  .then(ret=>{
    if(!ret) return
    console.info(`callback queue sending new message id:${ret.id}`)
    var options = {
      uri: config.www.callbackUri,
      method: 'POST',
      timeout: 2000,
      json: {
        type:ret.type,
        msg:JSON.parse(ret.message)
      }
    };
    request(options, function (error, response, body) {
      if(error) return console.warn(error)
      //has got response, indicating that this message is solved
      db.markReceived(ret._id).catch(err=>console.warn(err))
      console.info(`new message received by client id:${ret.id}`)
    });
  })
  .catch(err=>console.warn(err))
}
setInterval(findOneAndSend, 2000)

Ethereum.events
/**
 * @api {post} your_callback_url outcomeSuccess
 * @apiVersion 1.0.1
 * @apiName 出帐成功确认
 * @apiGroup Callback
 * @apiDescription
 * 出帐成功确认，与Request中的withdraw对应。TinyPay将会主动向接入方指定url推送该回调信息。

 * @apiParam {String} alias 币种的代称
 * @apiParam {String} name 币种全称
 * @apiParam {String} symbol 币种缩写
 * @apiParam {String} amount 出账数量
 * @apiParam {String} receiver withdraw指定的目标地址
 * @apiParam {String} localSender 固定为钱包主账户
 * @apiParam {String} transactionHash 交易hash值，与withdraw的返回参数对应
 * @apiParamExample {json} Callback-Example:
{ recordTime: 2018-05-16T10:19:49.000Z,
  recordTimestamp: 1526465989,
  name: 'Tiny Calf',
  symbol: 'TINY',
  alias: 'tiny',
  gasPrice: 4000000000,
  amount: '10',
  value: '10000000000000000000',
  receiver: '0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1',
  localSender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  transactionHash: '0xad09c447e514393c29f2518d53ab1d53520e8fcde5e3116b6a32265ded077e64',
  success: true,
  confirmations: 0,
  __v: 0,
  gasUsed: 38827,
  etherUsed: 0.000155308,
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  blockTimestamp: 1526466023,
  blockTime: 2018-05-16T10:20:28.000Z }
 */
.on("outcomeSuccess", msg=>{
  db.add(JSON.stringify(msg), "outcomeSuccess").catch(console.warn)
})
/**
 * @api {post} your_callback_url newIncome
 * @apiVersion 1.0.1
 * @apiName newIncome
 * @apiGroup Callback
 * @apiDescription
 * 新的入账信息。用户获取getnewaccount中的地址后，如果向地址汇入货币，接入方即会收到该推送
 *
 * @apiParam {String} alias 币种的代称
 * @apiParam {String} symbol 币种缩写
 * @apiParam {String} amount 入账数量
 * @apiParam {String} sender 交易发起人，即用户自己的地址
 * @apiParam {String} localReceiver 从getnewaccount中为用户绑定的地址
 * @apiParam {String} transactionHash 交易hash值
 * @apiParam {String} confirmations   交易确认数
 * @apiParamExample {json} Callback-Example:
{ alias: 'tiny',
  symbol: 'TINY',
  transactionHash: '0xad09c447e514393c29f2518d53ab1d53520e8fcde5e3116b6a32265ded077e64',
  confirmations: 0,
  sender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  localReceiver: '0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1',
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  value: '10000000000000000000',
  amount: '10' }
 */
.on("newIncome", msg=>{
  db.add(JSON.stringify(msg), "newIncome").catch(console.warn)
})
/**
 * @api {post} your_callback_url confirmationUpdate
 * @apiVersion 1.0.1
 * @apiName confirmationUpdate
 * @apiGroup Callback
 * @apiDescription
 * 交易确认数更新，参数和newIncome一模一样，只是确认数有变化
 *
 * @apiParam {String} alias 币种的代称
 * @apiParam {String} symbol 币种缩写
 * @apiParam {String} amount 入账数量
 * @apiParam {String} sender 交易发起人，即用户自己的地址
 * @apiParam {String} localReceiver 从getnewaccount中为用户绑定的地址
 * @apiParam {String} transactionHash 交易hash值
 * @apiParam {String} confirmations   交易确认数
 * @apiParamExample {json} Callback-Example:
{ alias: 'ether',
  symbol: 'ether',
  transactionHash: '0xe01c43e1d7926d884945f393c5c33d8cd665a56b810edad92cc80e3f8f67a051',
  confirmations: 3,
  sender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  localReceiver: '0xbf9d5dea24c3d28eb92148e3b0be28b9d77d9320',
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  value: '9000000000000000',
  amount: '0.009' }
 */
.on("confirmationUpdate", msg=>{
  db.add(JSON.stringify(msg), "confirmationUpdate").catch(console.warn)
})




Bitcoin.events
/**
 * @api {post} your_callback_url outcomeSuccess
 * @apiVersion 1.0.1
 * @apiName 出帐成功确认
 * @apiGroup Callback
 * @apiDescription
 * 出帐成功确认，与Request中的withdraw对应。TinyPay将会主动向接入方指定url推送该回调信息。

 * @apiParam {String} alias 币种的代称
 * @apiParam {String} name 币种全称
 * @apiParam {String} symbol 币种缩写
 * @apiParam {String} amount 出账数量
 * @apiParam {String} receiver withdraw指定的目标地址
 * @apiParam {String} localSender 固定为钱包主账户
 * @apiParam {String} transactionHash 交易hash值，与withdraw的返回参数对应
 * @apiParamExample {json} Callback-Example:
{ recordTime: 2018-05-16T10:19:49.000Z,
  recordTimestamp: 1526465989,
  name: 'Tiny Calf',
  symbol: 'TINY',
  alias: 'tiny',
  gasPrice: 4000000000,
  amount: '10',
  value: '10000000000000000000',
  receiver: '0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1',
  localSender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  transactionHash: '0xad09c447e514393c29f2518d53ab1d53520e8fcde5e3116b6a32265ded077e64',
  success: true,
  confirmations: 0,
  __v: 0,
  gasUsed: 38827,
  etherUsed: 0.000155308,
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  blockTimestamp: 1526466023,
  blockTime: 2018-05-16T10:20:28.000Z }
 */
.on("outcomeSuccess", msg=>{
  db.add(JSON.stringify(msg), "outcomeSuccess").catch(console.warn)
})
.on("newIncome", msg=>{
  db.add(JSON.stringify(msg), "newIncome").catch(console.warn)
})
.on("confirmationUpdate", msg=>{
  db.add(JSON.stringify(msg), "confirmationUpdate").catch(console.warn)
})
