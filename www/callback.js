let ether = require("../Ethereum/ether")
let db = require("./Database/Callbackqueue.db")



/**
 * @api {post}  /1以下通知都会回调统一的url   1. ether/NewRecharge
 * @apiVersion 2.0.0
 * @apiGroup callback
 * @apiDescription 回调通知 - 接收到新的充值交易但尚未达到指定确认数
 *
 * @apiParam {String} type 标记消息类型，这里为 NewRecharge
 * @apiParam {String} TransactionHash 新交易的哈希值
 * @apiParam {String} sender 发送方地址，即为用户自己的钱包地址
 * @apiParam {String} localReceiver 系统为用户创建的地址,即接收到充值交易的账号
 * @apiParam {String} amount  发送ether的数量，单位为ether
 * @apiParamExample {json} 请求示例
 {
"type" : "ether/NewRecharge",
"transactionHash" : "0xdcff7c18eba240650007e948d974a30167399692f38b70d66072ccedc7433e42",
"sender" : "0x65dd104db7d570121e33bcbfde55721cf2b1018f",
"localReceiver" : "0xa29daaa3d5e9d3df1ad96fa854e9eb9f25427e0f",
"amount" : "0.01"
}
 * @apiSuccessExample {json} 返回示例
 done
 */


ether.recharge.Events.on("newRecharge", ret => {
  db.add(
    ret,
    "ether/newRecharge",
    "ether/newRecharge_" + ret.transactionHash)
})


/**
 * @api {post} /2  2. ether/ConfirmRecharge
 * @apiVersion 2.0.0
 * @apiGroup callback
 * @apiDescription 回调通知 - 确认充值交易已经达到指定确认数
 *
 * @apiParam {String} type 标记消息类型，这里为 ConfirmRecharge
 * @apiParam {String} TransactionHash 新交易的哈希值
 * @apiParam {String} sender 发送方地址，即为用户自己的钱包地址
 * @apiParam {String} localReceiver 系统为用户创建的地址,即接收到充值交易的账号
 * @apiParam {String} amount  发送ether的数量，单位为ether
 * @apiParamExample {json} 请求示例
 {
"type" : "ether/ConfirmRecharge"
"transactionHash" : "0xdcff7c18eba240650007e948d974a30167399692f38b70d66072ccedc7433e42",
"sender" : "0x65dd104db7d570121e33bcbfde55721cf2b1018f",
"localReceiver" : "0xa29daaa3d5e9d3df1ad96fa854e9eb9f25427e0f",
"amount" : "0.01"
}
 * @apiSuccessExample {json} 返回示例
 done
 */
ether.recharge.Events.on("confirmationUpdate", ret => {
  if (ret.confirmations >= 6)
    db.add(
      ret,
      "ether/confirmRecharge",
      "ether/confirmRecharge_" + ret.transactionHash
    )
})


/**
 * @api {post} /3  3. ether/ConfirmWithdraw
 * @apiVersion 2.0.0
 * @apiGroup callback
 * @apiDescription 回调通知 - 确认提现交易已成功
 *
 * @apiParam {String} type 标记消息类型，这里为 ConfirmWithdraw
 * @apiParam {String} TransactionHash 提币交易的哈希值
 * @apiParam {String} localSender 发送方地址，即为系统为用户创建的地址
 * @apiParam {String} receiver 用户自己提供的目标钱包地址
 * @apiParam {String} amount  发送ether的数量，单位为ether
 * @apiParam {String} etherUsed 系统支付的矿工费，单位为ether
 * @apiParamExample {json} 请求示例
 {
"type" : "ether/ConfirmWithdraw"
"transactionHash" : "0xdcff7c18eba240650007e948d974a30167399692f38b70d66072ccedc7433e42",
"localSender" : "0x65dd104db7d570121e33bcbfde55721cf2b1018f",
"receiver" : "0xa29daaa3d5e9d3df1ad96fa854e9eb9f25427e0f",
"amount" : "0.01",
"etherUsed" : "0.000063"
}

 * @apiSuccessExample {json} 返回示例
 done
 */
ether.withdraw.Events.on("confirmedNewTx", ret => {
  db.add(
    ret,
    "ether/confirmWithdraw",
    "ether/confirmWithdraw_" + ret.transactionHash
  )
})

/**
 * @api {post} /4  4. ether/SendBack
 * @apiVersion 2.0.0
 * @apiGroup callback
 * @apiDescription 回调通知 - 系统分配的用户账号中的充值余额已回传给主账户（以太坊独有,主要用来计算交易转账损失的矿工费）
 *
 * @apiParam {String} type 标记消息类型，这里为 SendBack
 * @apiParam {String} TransactionHash 提币交易的哈希值
 * @apiParam {String} localSender 系统分配给用户的地址
 * @apiParam {String} receiver 即为系统主钱包地址
 * @apiParam {String} amount  发送ether的数量，单位为ether
 * @apiParam {String} etherUsed 系统支付的矿工费，单位为ether
 * @apiParamExample {json} 请求示例
 {
"type" : "ether/SendBack"
"transactionHash" : "0xdcff7c18eba240650007e948d974a30167399692f38b70d66072ccedc7433e42",
"localSender" : "0x65dd104db7d570121e33bcbfde55721cf2b1018f",
"receiver" : "0xa29daaa3d5e9d3df1ad96fa854e9eb9f25427e0f",
"amount" : "0.01",
"etherUsed": "0.000063"
}

 * @apiSuccessExample {json} 返回示例
 done
 */