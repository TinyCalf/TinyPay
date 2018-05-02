const express = require("express");
var router = express.Router()
var verify = require("./verify")
var config = require("../Config")
var Ethereum = require("../Ethereum")

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  if(config.www.disableVerify) return next()
  // console.log(req.body) //post
  var ifPass = verify.verifySign(req.body)
  if(!ifPass) return res.send({err:-100,msg:"SIGNATURE_INCORRECT"})
  next();
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


module.exports = router;
