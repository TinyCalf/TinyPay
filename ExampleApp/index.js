const bodyParser = require('body-parser')
const express = require("express")
let app = express()
const User = require("./user.db")
let keygen = require("keygenerator")
let md5 = require("md5")

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
 * @apiGroup Tools
 * @apiDescription
 * 每次访问都是一个全新的钱包，需要据数据记录一下；返回的参数全部记录进数据库就行，具体什么时候用到看情况；后面的接口中会提到需要用到以下的哪个参数；可以给整个系统生成一个固定的钱包，还可以给每个学生生成一个单独的钱包；
 *
 * @apiSuccess {String} mnemonic  助记词
 * @apiSuccess {String} path      衍生路径
 * @apiSuccess {String} prikey    私钥
 * @apiSuccess {String} address   普通地址
 * @apiSuccess {String} checksum  带校验位的地址
 * @apiSuccessExample {json} 返回示例
 * {
 *   err:0,
 *   msg:{
 *     mnemonic: "shield patch vital title kingdom warm firm choose cannon super submit reflect",
 *     path: "m/44'/60'/0'/24",
 *     prikey: "784bef31bc9114d199f74c2fc00c385e5890f33f7d98272e3df302f8fd23c598",
 *     address: "0x0406cbfc42e08c6af7581d65be7fe871b5a90bec",
 *     checksum: "0x0406CbFC42E08c6Af7581D65bE7fE871B5A90Bec"
 *   }
 * }
 *
 * @apiError 999:UNKNOW_ERROR 未知错误
 * @apiError 1000:INVAILD_PARAM 参数错误
 * @apiErrorExample {json} 错误示例
 * {err:999,msg:"UNKNOW_ERROR"}
 * {err:1000,msg:"INVAILD_PARAM"}
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

app.post("")




app.listen(3500)
console.log("Example App listening on" + 3500)


exports.app = app