const express = require('express')
let router = express.Router()
const btc = require('../Bitcoin/')

/**
 * @api {get} /bitcoin/getnewaccount 1.GetNewAccount
 * @apiVersion 2.0.0
 * @apiGroup Bitcoin
 * @apiDescription
 * 获取一个新生成的比特币随机账号, 本系统会记录该账号并侦听其发生的新交易
 *
 * @apiSuccess {String} address 新账号的以太坊地址
 * @apiSuccessExample {json} 返回示例
{ err: 0, msg: '2N5exKf4SzVQVP5xsA7o5oTQQod954JjHEt' }
 */
router.get('/getnewaccount', (req, res, next) => {
  btc.getNewAccount()
    .then(ret => {
      res.send({
        err: 0,
        msg: ret.address
      })
    })
    .catch(next)
})

/**
 * @api {post} /bitcoin/withdraw 2.Withdraw
 * @apiVersion 2.0.0
 * @apiGroup Bitcoin
 * @apiDescription
 * 发起一笔比特币提现交易
 * @apiParam {String} address 目标地址
 * @apiParam {String} amount  提取比特币数量
 * @apiParamExample {json} 请求示例
{
 address:"2N5exKf4SzVQVP5xsA7o5oTQQod954JjHEt",
 amount:"0.001"
}
 *
 * @apiSuccess {String} transactionHash 比特币交易id
 * @apiSuccess {String} localSender 发送方，比特币中一般为主账户的多个地址，所以这里统一写成 “MainAccount”
 * @apiSuccess {String} receiver  交易接受方，即目标地址
 * @apiSuccess {String} amount    交易的比特币数量
 * @apiSuccessExample {json} 返回示例
 { err: 0,
   msg:
    { transactionHash: '60f74a4cfad65df41bd408036366a28d9f25a97bc001a034108d6e1449458a2a',
      localSender: 'MainAccount',
      receiver: '2N5C88gDF1hfagF3bh9kAENjCt5pmGbBczy',
      amount: '0.0001' } }
 */
router.post('/withdraw', (req, res, next) => {
  if (!req.body.address || !req.body.address)
    return next(new Error("INVAILD_PARAMS"))
  btc.withdraw(req.body.address, req.body.amount)
    .then(ret => {
      res.send({
        err: 0,
        msg: {
          transactionHash: ret,
          localSender: "MainAccount",
          receiver: req.body.address,
          amount: req.body.amount
        }
      })
    })
    .catch(next)
})


/**
 * @api {post} /bitcoin/getbalance 3.GetBalance
 * @apiVersion 2.0.0
 * @apiGroup Bitcoin
 * @apiDescription
 * 获取主账户的余额信息
 * @apiParam {String} address 地址，如果为空则回返回整个比特币主账户的余额
 * @apiParamExample {json} 请求示例
 {
 address: "2N5C88gDF1hfagF3bh9kAENjCt5pmGbBczy"
}
{
address: ""
}

 * @apiSuccess {String} balance  余额，单位BTC
 * @apiSuccessExample {json} 返回示例
 { err: 0,
   msg: "32343.999384"
}
 */
router.post('/getbalance', (req, res, next) => {
  btc.getBalance(req.body.address)
    .then(ret => {
      res.send({
        err: 0,
        msg: ret,
      })
    })
    .catch(next)
})


module.exports = router