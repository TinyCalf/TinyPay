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
 * @apiSuccessExample {json} body
{
  err:0,
  msg:{
    ether: '0.997972596',
    king: '999999.999999999013368025'
  }
}
 *
 */
router.post('/getinfo', function(req, res) {
  var etherBalance = "not found"
  var kingBalance = "not found"
  Ethereum.Transaction.king.getBalanceOfMainInEther()
  .then(ret=>{
    kingBalance = ret
    return Ethereum.Transaction.ether.getBalanceOfMainInEther()
  })
  .then(ret=>{
    etherBalance = ret
    res.send({err:0,msg:{
      ether: etherBalance,
      king: kingBalance
    }})
  })
  .catch(err=>{
    console.error(err)
    res.send({err:-101,msg:err})
  })
});

/**
 * @api {post} /v1/getnewaccount 获取某币种的新帐号
 * @apiName 获取某币种的新帐号
 * @apiGroup V1
 *
 * @apiParam {String} alias 币种的代称，目前仅支持 king
 * @apiParamExample {json} Request-Example:
     {
       "appkey": "YOUR_APPKEY",
       "signature": "SIG",
       "timestamp": "789463135",
       "params":{
          "alias":"king"
         }
     }
 *
 * @apiSuccess {Number} err  错误码， 0时为成功
 * @apiSuccess {String} msg  返回成功时为新帐号的地址
 */
router.post('/getnewaccount', function(req, res) {
  if(!req.body.params || !req.body.params.alias)
    res.send({err:-1,msg:"PARAM_INVAILD"})
  Ethereum.Account.createNewAccount(req.body.params.alias)
  .then(address=>{
    res.send({err:0,msg:address})
  })
  .catch(err=>{
    console.error(err)
    res.send({err:-101,msg:err})
  })
});


/**
 * @api {post} /v1/transferkingtoaddresses 批量发送kingcoin
 * @apiName 批量发送kingcoin
 * @apiGroup V1
 *
 * @apiParam {Array} tos 目标地址数组
 * @apiParam {Array} amounts 目标数量数组 （单位ether）
 * @apiParamExample {json} Request-Example:
     {
       "appkey": "YOUR_APPKEY",
       "signature": "SIG",
       "timestamp": "789463135",
       "params":{
          "tos":[...,...,...]
          "values": [...,...,...]
         }
     }
 *
 * @apiSuccess {Number} err  错误码， 0时为成功
 * @apiSuccess {String} msg  返回成功时为新帐号的地址
 * @apiSuccessExample {json} body
 {
   err:0,
   msg:"transactionHash"
 }
 */
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
 * @apiParam {Number} amount 目标数量 （单位ether）
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
 * @apiSuccess {String} msg  返回成功时为交易哈奚值
 * @apiSuccessExample {json} body
 {
   err:0,
   msg:"transactionHash"
 }
 */
router.post('/withdraw', function(req, res) {
  if(  !req.body.params
    || !req.body.params.alias
    || !req.body.params.to
    || !req.body.params.amount)
    res.send({err:-1,msg:"PARAM_INVAILD"})
  let ifExist = false
  config.ethereum.available_currency_alias.forEach( alias=>{
    if(alias == req.body.params.alias) ifExist = true
  })
  if(!ifExist) res.send({err:-2,msg:"ALIAS_NOT_EXISTED"})
  var alias = req.body.params.alias
  switch( config[alias].category ){
    case "ether":{
      Ethereum.Transaction.etheroutcome.transferEtherInEther(
        req.body.params.to,
        req.body.params.amount
      )
      .then(ret=>res.send({err:0,msg:ret}))
      .catch(err=>{
        console.error(err)
        if(err.message == "SEND_TOO_OFTEN")
          return res.send({err:-10,msg:"SEND_TOO_OFTEN"})
        res.send({err:-101,msg:err})
      })
      break
    }
    case "erc20" : {
      Ethereum.Transaction.erc20outcome.transferERC20InEther(
        alias,
        req.body.params.to,
        req.body.params.amount
      )
      .then(ret=>res.send({err:0,msg:ret}))
      .catch(err=>{
        console.error(err)
        if(err.message == "SEND_TOO_OFTEN")
          return res.send({err:-10,msg:"SEND_TOO_OFTEN"})
        res.send({err:-101,msg:err})
      })
      break
    }
    default: res.send({err:-101,msg:"UNKNOW_ERROR"})
  }
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
