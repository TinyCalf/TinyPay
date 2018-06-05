const express = require("express");
var router = express.Router()
var verify = require("./verify")
var config = require("../Config")
var Ethereum = require("../Ethereum")
var Bitcoin = require("../Bitcoin")

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  if(config.www.disableVerify) return next()
  var ifPass = verify.verifySign(req.body)
  if(!ifPass) return res.send({err:-100,msg:"SIGNATURE_INCORRECT"})
  next();
});


/**
 * @api {post} /v1/getnewaccount getNewAccount
 * @apiVersion 1.0.1
 * @apiName 获取新帐号
 * @apiGroup Request
 * @apiDescription
 * 该接口为指定币种生成一个新的地址，接入方需要保存该地址，并与唯一用户绑定。
 * 该地址只能接收指定的货币，其他货币因为误操作打入该地址则无效。
 * 用户向地址充值时，接入方将会收到回调。
 *
 * @apiParam {String} alias 币种的代称，在配置文件中包含所有币种信息,如 ether|eos|...
 * @apiParamExample {json} Request-Example:
 * {
 *   "appkey": "YOUR_APPKEY",
 *   "signature": "SIG",
 *   "timestamp": "789463135",
 *   "params":{
 *     "alias":"ether"
 *    }
 *  }
 *
 * @apiSuccess {String} alias 货币代称
 * @apiSuccess {String} symbol  货币在ethereum上的缩写
 * @apiSuccess {String} name  货币在ethereum上的全称
 * @apiSuccess {String} category  分类 ether|erc20
 * @apiSuccess {String} address  新帐号地址
 * @apiSuccessExample {json} Response-Example
 *  {
 *     address: '0xd0f1d390033d18617fb4d6835f561d5467f80756',
 *     name: 'ether',
 *     symbol: 'ether',
 *     alias: 'ether',
 *     category: 'ether' }
 *   }
 * @apiError 420:UNKNOW_ERROR 未知错误
 * @apiError 421:INVAILD_ALIAS alias参数不合法
 * @apiErrorExample {json} Error-Example
 * {errcode:420,errmsg:"UNKNOW_ERROR"}
 * {errcode:421,errmsg:"INVAILD_ALIAS"}
 */
router.post('/getnewaccount', function(req, res, next) {
  if(!req.body.params || !req.body.params.alias)
    return next(new Error('INVAILD_ALIAS'))
  if(req.body.params.alias == "btc" && config.btc.disable == true)
    return next(new Error('INVAILD_ALIAS'))
  if(req.body.params.alias == "btc")
    Bitcoin.getNewAccount()
    .then(ret=>res.send(ret))
    .catch(next)
  else
    Ethereum.getNewAccount(req.body.params.alias)
    .then(ret=>res.send(ret))
    .catch(next)
});


/**
 * @api {post} /v1/getinfo getInfo
 * @apiVersion 1.0.1
 * @apiName 获取主账户信息
 * @apiGroup Request
 * @apiDescription
 * 获取主账户所有币种的余额信息
 *
 * @apiSuccess {String} alias 货币代称
 * @apiSuccess {String} symbol  货币在ethereum上的缩写
 * @apiSuccess {String} name  货币在ethereum上的全称
 * @apiSuccess {String} balance  主张户内的货币余额
 * @apiSuccessExample {json} Response-Example
[
  { "alias":"king",
    "symbol":"KING(KingCoin)",
    "name":"KingCoin",
    "balance":"999437.344429999013367925"},
  { "alias":"tiny",
  "symbol":"TINY",
  "name":"Tiny Calf",
  "balance":"1000000"},
  {"alias":"ether",
  "symbol":"ether",
  "name":"ether",
  "balance":"1.536597690017970608"}]
 * @apiError 420:UNKNOW_ERROR 未知错误
 * @apiErrorExample {json} Error-Example
 * {errcode:420,errmsg:"UNKNOW_ERROR"}
 */
router.post('/getinfo', function(req, res, next) {
  let info = []
  Ethereum.getinfo()
  .then(ret=>{
    info = info.concat(ret)
    return Bitcoin.getInfo()
  })
  .then(ret=>{
    info = info.concat(ret)
    res.send(info)
  })
  .catch(next)
});

/**
 * @api {post} /v1/withdraw withdraw
 * @apiVersion 1.0.1
 * @apiName 发起提现交易
 * @apiGroup Request
 * @apiDescription
 * 发起提现交易。收到交易的唯一hash值表明交易正在发送，但并不是发送成功。
 * 需要记录交易的hash值，等待回调确定交易成功。
 *
 * @apiParam {String} alias  币种的代称，在配置文件中包含所有币种信息,如 ether|eos|...
 * @apiParam {String} to     目标地址
 * @apiParam {String} amount 发送数量 注：只接受类型String，请做好类型转换
 * @apiParamExample {json} Request-Example:
 * {
 *   "appkey": "YOUR_APPKEY",
 *   "signature": "SIG",
 *   "timestamp": "789463135",
 *   "params":{
 *     "alias":"ether"
 *     "to":"0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1",
 *     "amount":"10"
 *    }
 *  }
 *
 * @apiSuccess {String} transactionHash 交易唯一hash值。
 * @apiSuccessExample {json} Response-Example
 *  {
 *     "transactionHash": "0xad09c447e514393c29f2518d53ab1d53520e8fcde5e3116b6a32265ded077e64"
 *  }
 * @apiError 420:UNKNOW_ERROR              未知错误
 * @apiError 421:INVAILD_ALIAS             alias参数不合法
 * @apiError 422:INVAILD_ADDRESS           address参数不合法
 * @apiError 423:INVAILED_AMOUNT           amount参数不合法
 * @apiError 424:SEND_TOO_OFTEN            发送过于频繁
 * @apiError 425:INSUFFICIENT_FUNDS        主账户余额不足
 * @apiErrorExample {json} Error-Example
 * {errcode:420,errmsg:"UNKNOW_ERROR"}
 * {errcode:421,errmsg:"INVAILD_ALIAS"}
 * {errcode:422,errmsg:"INVAILED_AMOUNT"}
 * {errcode:423,errmsg:"INVAILED_AMOUNT"}
 * {errcode:424,errmsg:"SEND_TOO_OFTEN"}
 * {errcode:425,errmsg:"SEND_TOO_OFTEN"}
 */
router.post('/withdraw', function(req, res, next) {
  console.log(req.body.params)
  if(  !req.body.params
    || !req.body.params.alias
    || !req.body.params.to
    || !req.body.params.amount)
    return next(new Error('UNKOWN_ERROR'))
  if(req.body.params.alias == "btc" && config.btc.disable == true)
    return next(new Error('INVAILD_ALIAS'))
  if(req.body.params.alias == "btc")
    Bitcoin.withdraw(req.body.params.to, req.body.params.amount)
    .then(ret=>{
      res.send({transactionHash:ret})
    })
    .catch(next)
  else
    Ethereum.withdraw(
      req.body.params.alias,
      req.body.params.to,
      req.body.params.amount
    )
    .then(ret=>{
      res.send({transactionHash:ret})
    })
    .catch(next)
});




// router.post('/transferkingtoaddresses', function(req, res) {
//   if(!req.body.params || !req.body.params.tos || !req.body.params.amounts)
//     res.send({err:-1,msg:"PARAM_INVAILD"})
//   Ethereum.Transaction.king.transferToAddressesInEther(
//     req.body.params.tos, req.body.params.amounts)
//   .then(ret=>{
//     res.send({err:0,msg:ret})
//   })
//   .catch(err=>{
//     console.error(err)
//     if(err.message == "SEND_TOO_OFTEN")
//       return res.send({err:-10,msg:"SEND_TOO_OFTEN"})
//     res.send({err:-101,msg:err})
//   })
// });
//
//
//
//
//
//
// router.post('/sendback', function(req, res) {
//   if(  !req.body.params
//     || !req.body.params.address)
//     res.send({err:-1,msg:"PARAM_INVAILD"})
//   Ethereum.ERC20SendBackTask.addAddressToBeSentBack(req.body.params.address)
//   .then(ret=>res.send({err:0,msg:"success"}))
//   .catch(err=>{
//     console.error(err)
//     if(err.message=="NO_TOKEN_IN_THIS_ADDRESS")
//       return res.send({err:-201,msg:"NO_TOKEN_IN_THIS_ADDRESS"})
//     if(err.message=="INVAILED_ADDRESS")
//       return res.send({err:-202,msg:"INVAILED_ADDRESS"})
//     res.send({err:-101,msg:"UNKNOW_ERROR"})
//   })
// });




module.exports = router;
