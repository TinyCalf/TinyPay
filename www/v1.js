const express = require("express");
var router = express.Router()
var verify = require("./verify")
var config = require("../Config")

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  if(config.www.disableVerify) return next()
  // console.log(req.body) //post
  var ifPass = verify.verifySign(req.body)
  if(!ifPass) return res.send({err:-1000,msg:"SIGNATURE_INCORRECT"})
  next();
});



/*
curl -X POST 127.0.0.1:1990/v1/a  -H "Content-Type: application/json" -d '{"user":"tiny","pass":"mvxwWn74CWRxx99nJC3QxXsgYsDH68pvPN"}'

*/
router.post('/a', function(req, res) {
  res.send('a');
});
// define the about route
router.get('/b', function(req, res) {
  res.send('b');
});


/**
 * @api {post} /v1/newaccount get a new account for some coin
 * @apiName NewAccount
 * @apiGroup v1
 *
 * @apiParam {String} alias Alias for a coin.
 *
 * @apiSuccess {String} address  new address for the account.
 */
router.post('/newaccount', function(req, res) {
  res.send('a');
});


module.exports = router;
