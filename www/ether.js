const express = require("express")
let router = express.Router()
const ether = require("../Ethereum/ether")

/**
 * @api {get} /ether/getnewaccount 1. getNewAccount
 * @apiVersion 2.0.0
 * @apiGroup Ether
 * @apiDescription
 * 获取一个新生成的以太坊随机账号, 本系统会记录该账号并侦听其发生的新交易
 *
 * @apiSuccess {String} address 新账号的以太坊地址
 * @apiSuccess {String} prikey  新账号的私钥
 * @apiSuccessExample {json} 返回示例
 { err: 0,
   msg:
    { address: '0x051ca4ca0132f59fc18367587483b4e72ee8ba94',
      prikey: 'e0547497a35acaecff76c7089f0232a7d98c2195f0b3339c050429fd325617e1' } }
 */
router.get('/getnewaccount', (req, res, next) => {
  ether.account.getNew()
    .then(ret => {
      res.send({
        err: 0,
        msg: {
          address: ret.address,
          prikey: ret.prikey
        }
      })
    })
    .catch(next)
})

/**
 * @api  {post} /ether/withdraw 2. withdraw
 * @apiVersion 2.0.0
 * @apiGroup Ether
 * @apiDescription
 * 从系统热钱包中发起提现交易，会收到交易hash值，交易确认后会通过回调的方式通知接入方
 *
 * @apiParam {String} address 目标账号地址
 * @apiParam {String} amount  单位为ether的转账数量,字符串形式如 "0.28399"
 * @apiParamExample {json} 请求示例
 {
 address: "0x051ca4ca0132f59fc18367587483b4e72ee8ba94"
 amount:  "0.02"
 }
 * @apiSuccess {String} transactionHash 交易的哈希值
 * @apiSuccess {String} localSender 交易的发送方，即为系统热钱包地址
 * @apiSuccess {String} receiver 交易的接收方，即为以上的目标账号地址
 * @apiSuccess {String} amount 交易数量
 * @apiSuccessExample {json} 返回示例
 *
 { err: 0,
  msg:
   { transactionHash: '0x2d904041c583244136760923ab5509248e08bc8eab2410d687f4808c76f4e79b',

     localSender: '0x65dd104db7d570121e33bcbfde55721cf2b1018f',
     receiver: '0xe26fde6fa83794b30312f9e74671dacd4b6558c1',
     amount: '0.02' } }
 */
router.post('/withdraw', (req, res, next) => {
  if (!req.body.address ||
    !req.body.amount)
    return next(new Error("INVAILD_PARAMS"))
  ether.withdraw.lauchTransaction(
      req.body.address,
      req.body.amount
    )
    .then(ret => {
      delete ret.value
      delete ret.gasPrice
      res.send({
        err: 0,
        msg: ret
      })
    })
    .catch(next)
})

/**
 * @api {post} /ether/getbalance 3. getBalance
 * @apiVersion 2.0.0
 * @apiGroup Ether
 * @apiDescription
 * 获取某地址的ether余额
 *
 * @apiParam {String} address 某地址，不一定是用户的，任何地址都可以
 * @apiParamExample {json} 请求示例
 * {
 address: "0x051ca4ca0132f59fc18367587483b4e72ee8ba94"
}
 *
 * @apiSuccess {String} balance 余额，单位ether
 * @apiSuccessExample {json} 返回示例
 { err: 0, msg: '0' }
 */
router.post('/getbalance', (req, res, next) => {
  if (!req.body.address)
    return next(new Error("INVAILD_PARAMS"))
  ether.getBalance(req.body.address)
    .then(ret => {
      res.send({
        err: 0,
        msg: ret
      })
    })
    .catch(next)
})


module.exports = router