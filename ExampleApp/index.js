const bodyParser = require('body-parser')
const express = require("express")
let app = express()
const User = require("./user.db")
let keygen = require("keygenerator")
let md5 = require("md5")
const okcoin = require("./okcoin")

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

app.use(bodyParser.json())

let genToken = () => {
  return keygen._({
    forceUppercase: true
  })
}

/**
 * @api {post} /register 1.注册
 * @apiVersion 1.0.0
 * @apiGroup APP
 *
 * @apiParam  {String} mobile  手机号码
 * @apiParam  {String} password 密码
 * @apiParamExample {json} 请求示例
 * {
 mobile: "150736638728",
 password: "whatthefuck"
}
 *
 *
 * @apiSuccess {String} token   登录的token
 * @apiSuccessExample {json} 返回示例
 * {
 *   err: 0,
 *   msg: "IAVFPMRNCZXB4GRD7ZC9QRLAGVBDPDWT"
 * }
 *
 * @apiError UNKNOWN_ERROR 未知错误
 * @apiError INVAILD_PARAM 参数错误
 * @apiError REGISTED  已经注册
 * @apiErrorExample {json} 错误示例
 * {err: "UNKNOWN_ERROR" ,msg:"unknown error"}
 * {err: "INVAILD_PARAM",msg:"invaild params"}
 * {err: "REGISTED", msg: "this mobile has been registed!"}
 */
app.post('/register', (req, res) => {
  if (!req.body.mobile ||
    !req.body.password)
    return res.send({
      err: "INVAILD_PARAM",
      msg: "invaild params"
    })
  let user = new User({
    mobile: req.body.mobile,
    md5pass: md5(req.body.password),
    token: genToken()
  })
  user.save().then((doc, length, err) => {
      console.log(doc)
      res.send({
        err: 0,
        msg: doc.token
      })
    })
    .catch(err => {
      if (err.code == 11000)
        res.send({
          err: "REGISTED",
          msg: "this mobile has been registed!"
        })
      else
        res.send({
          err: "UNKNOWN_ERROR",
          msg: "unknown error"
        })
    })
})



/**
 * @api {post} /login 2. 登录
 * @apiVersion 1.0.0
 * @apiGroup APP
 *
 * @apiParam  {String} mobile  手机号码
 * @apiParam  {String} password 密码
 * @apiParamExample {json} 请求示例
 * {
 mobile: "150736638728",
 password: "whatthefuck"
}
 *
 *
 * @apiSuccess {String} token   登录token
 * @apiSuccessExample {json} 返回示例
 * {
 *   err: 0,
 *   msg: "IAVFPMRNCZXB4GRD7ZC9QRLAGVBDPDWT"
 * }
 *
 * @apiError UNKNOWN_ERROR 未知错误
 * @apiError INVAILD_PARAM 参数错误
 * @apiError USER_NOT_FOUND  用户不存在
 * @apiErrorExample {json} 错误示例
 * {err: "UNKNOWN_ERROR" ,msg:"unknown error"}
 * {err: "INVAILD_PARAM",msg:"invaild params"}
 * {err: "USER_NOT_FOUND", msg: "user not exists or password is wrong"}
 */
app.post('/login', (req, res) => {
  if (!req.body.mobile ||
    !req.body.password)
    return res.send({
      err: "INVAILD_PARAM",
      msg: "invaild params"
    })
  let token = genToken()
  User.findOneAndUpdate({
      mobile: req.body.mobile,
      md5pass: md5(req.body.password)
    }, {
      $set: {
        token: token
      }
    })
    .then((doc, length, err) => {
      if (!doc)
        return res.send({
          err: "USER_NOT_FOUND",
          msg: "user not exists or password is wrong"
        })
      res.send({
        err: 0,
        msg: token
      })
    })
    .catch(err => {
      res.send({
        err: "UNKNOW_ERROR",
        msg: "unknown error"
      })
    })
})





/**
 * @api {get} /ticker 3. 获取最新行情
 * @apiVersion 1.0.0
 * @apiGroup APP
 *
 * @apiSuccess {Object} ticker 行情信息
 * @apiSuccessExample {json} 返回示例
{ err: 0,
  msg:
   { btc: { cny: '42966.53', usd: '6444.98' },
     eth: { cny: '1823.60', usd: '273.54' } } }
 */
app.get("/ticker", (req, res) => {
  res.send({
    err: 0,
    msg: okcoin.getTicker()
  })
})




app.listen(3500)
console.log("Example App listening on" + 3500)


exports.app = app