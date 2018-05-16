const express = require("express");
var router = express.Router()
var verify = require("./verify")
var config = require("../Config")
var Ethereum = require("../Ethereum")

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  if(config.www.disableVerify) return next()
  var ifPass = verify.verifySign(req.body)
  if(!ifPass) return res.send({err:-100,msg:"SIGNATURE_INCORRECT"})
  next();
});


/**
* @api {post} /v1/getinfo 获取主账户余额信息
* @apiName 获取主账户余额信息
* @apiGroup V1
*
* @apiParamExample {json} Request-Example:
   {
     "appkey": "YOUR_APPKEY",
     "signature": "SIG",
     "timestamp": "789463135",
   }
*
* @apiSuccess {Number} err  错误码， 0时为成功
* @apiSuccess {String} msg  返回成功时为主账户余额信息
* @apiSuccess {String} alias 货币代称
* @apiSuccess {String} symbol  货币在ethereum上的缩写
* @apiSuccess {String} name  货币在ethereum上的全称
* @apiSuccess {String} balance  货币余额（单位：ether）
* @apiSuccessExample {json} Response-Example
{
  err:0,
  msg:[
    { alias: 'king',
      symbol: 'KING(KingCoin)',
      name: 'KingCoin',
      balance: '999497.344429999013367925' },
    { alias: 'tiny',
      symbol: 'TINY',
      name: 'Tiny Calf',
      balance: '1000000' },
    { alias: 'ether',
      symbol: 'ether',
      name: 'ether',
      balance: '1.540200950899799' } ]
}
* @apiError UNKNOW_ERROR 未知错误
* @apiErrorExample {json} Error-Example
{err:999,msg:"UNKNOW_ERROR"}
*/
router.post('/getinfo', function(req, res) {
  Ethereum.getinfo()
  .then(ret=>{
    res.send({err:0,msg:ret})
  })
  catch(err=>{
    res.send({err:999,msg:"UNKNOW_ERROR"})
  })
});


/**
* @api {post} /v1/getnewaccount 获取新帐号
* @apiName 获取某币种的新帐号
* @apiGroup V1
*
* @apiParam {String} alias 币种的代称，在配置文件中包含所有币种信息,如 ether|eos|...
* @apiParamExample {json} Request-Example:
 {
   "appkey": "YOUR_APPKEY",
   "signature": "SIG",
   "timestamp": "789463135",
   "params":{
      "alias":"ether"
     }
 }
*
* @apiSuccess {Number} err  错误码， 0时为成功
* @apiSuccess {String} msg  返回成功时为新帐号信息
* @apiSuccess {String} alias 货币代称
* @apiSuccess {String} symbol  货币在ethereum上的缩写
* @apiSuccess {String} name  货币在ethereum上的全称
* @apiSuccess {String} category  分类 ether|erc20
* @apiSuccess {Number} address  新帐号
* @apiSuccessExample {json} Response-Example
{
  err:0,
  msg:{
   address: '0xd0f1d390033d18617fb4d6835f561d5467f80756',
   name: 'ether',
   symbol: 'ether',
   alias: 'ether',
   category: 'ether' }
}
* @apiError UNKNOW_ERROR 未知错误
* @apiError INVAILD_ALIAS alias参数不合法
* @apiErrorExample {json} Error-Example
{err:999,msg:"UNKNOW_ERROR"}
{err:10000,msg:"INVAILD_ALIAS"}
*/
router.post('/getnewaccount', function(req, res) {
  if(!req.body.params || !req.body.params.alias)
    res.send({err:10000,msg:"INVAILD_ALIAS"})
  Ethereum.getNewAccount(req.body.params.alias)
  .then(ret=>{
    res.send({err:0,msg:ret})
  })
  catch(err=>{
    if(err.message == "INVAILD_ALIAS")
      res.send({err:10000,msg:"INVAILD_ALIAS"})
    res.send({err:999,msg:"UNKNOW_ERROR"})
  })
});



router.post('/transferkingtoaddresses', function(req, res) {
  if(!req.body.params || !req.body.params.tos || !req.body.params.amounts)
    res.send({err:-1,msg:"PARAM_INVAILD"})
  Ethereum.Transaction.king.transferToAddressesInEther(
    req.body.params.tos, req.body.params.amounts)
  .then(ret=>{
    res.send({err:0,msg:ret})
  })
  .catch(err=>{
    console.error(err)
    if(err.message == "SEND_TOO_OFTEN")
      return res.send({err:-10,msg:"SEND_TOO_OFTEN"})
    res.send({err:-101,msg:err})
  })
});


/**
* @api {post} /v1/withdraw 提现
* @apiName 提现
* @apiGroup V1
*
* @apiParam {String} alias 币种名称
* @apiParam {String} to 发送地址
* @apiParam {String} amount 目标数量 （单位ether）注：不接受number类型
* @apiParamExample {json} Request-Example:
   {
     "appkey": "YOUR_APPKEY",
     "signature": "SIG",
     "timestamp": "789463135",
     "params":{
        "alias":"ether"
        "to":"0x1230182931012312312312"
        "amount": 1.2
       }
   }
*
* @apiSuccess {Number} err  错误码， 0时为成功
* @apiSuccess {String} msg  返回成功时为交易哈希值
* @apiSuccessExample {json} body
{
 err:0,
 msg:"0xba47d6fa65bdee2a0039797de77c1c8b2030be7f05be0debf00aaac387c0f5c7"
}
 * @apiError UNKNOW_ERROR 未知错误
* @apiError INVAILD_ALIAS      alias参数不合法
* @apiError INVAILD_ADDRESS    address参数不合法
* @apiError INVAILED_AMOUNT    amount参数不合法
* @apiError SEND_TOO_OFTEN     发送过于频繁
* @apiError INSUFFICIENT_FUNDS 主账户余额不足
 * @apiErrorExample {json} Error-Example
{err:999,msg:"UNKNOW_ERROR"}
{err:10001,msg:"INVAILD_ALIAS"}
{err:10002,msg:"INVAILD_ADDRESS"}
{err:10003,msg:"INVAILED_AMOUNT"}
{err:10004,msg:"SEND_TOO_OFTEN"}
{err:10005,msg:"INSUFFICIENT_FUNDS"}
*/
router.post('/withdraw', function(req, res) {
  if(  !req.body.params
    || !req.body.params.alias
    || !req.body.params.to
    || !req.body.params.amount)

});


router.post('/sendback', function(req, res) {
  if(  !req.body.params
    || !req.body.params.address)
    res.send({err:-1,msg:"PARAM_INVAILD"})
  Ethereum.ERC20SendBackTask.addAddressToBeSentBack(req.body.params.address)
  .then(ret=>res.send({err:0,msg:"success"}))
  .catch(err=>{
    console.error(err)
    if(err.message=="NO_TOKEN_IN_THIS_ADDRESS")
      return res.send({err:-201,msg:"NO_TOKEN_IN_THIS_ADDRESS"})
    if(err.message=="INVAILED_ADDRESS")
      return res.send({err:-202,msg:"INVAILED_ADDRESS"})
    res.send({err:-101,msg:"UNKNOW_ERROR"})
  })
});




module.exports = router;
