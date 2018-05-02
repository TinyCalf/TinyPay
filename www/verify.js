var crypto = require("crypto")
var config = require("../Config")
const DURATION = 1000*60 // the allowed time duration between client and server
// {
//   appkey:"1231231",
//   signature:"123123123123123",
//   timestamp:"12312312",
//   params:{
//       name:"tinycalf",
//       pass:"123",
//       arr:["a","b"]
//   }
// }
exports.verifySign = Function("ob")


// {
//   appkey:"1231231",
//   timestamp:"12312312",
//   params:{
//       name:"tinycalf",
//       pass:"123",
//       arr:["a","b"]
//   }
// }
exports.getSign = Function("ob")


// var ob = {
//   appkey:"1231231",
//   signature:"",
//   timestamp:"12312312",
//   params:{
//       name:"tinycalf",
//       pass:"123",
//       arr:["a","b"]
//   }
// }

var sortParams = (params) => {
  var res = []
  var keys = Object.getOwnPropertyNames(params).sort()
  keys.forEach( (key)=>{
    res.push(`${key}=${params[key].toString()}`)
  })
  return res.join()
}

var verifyTime = (ts1, ts2) => {
  var duration = 0;
  (ts1-ts2 < 0) ? duration=ts2-ts1 : duration=ts1-ts2;
  if(duration>DURATION)
    return false
  else
    return true
}

this.getSign = (ob) => {
  var params = sortParams(ob.params)
  var str = params + config.www.appsecret + ob.timestamp
  var sha1 = crypto.createHash('sha1');
  sha1.update(str);
  var sign = sha1.digest('hex')
  return sign
}

this.verifySign = (ob) => {
  if(ob.appkey != config.www.appkey)
    return false
  if(!verifyTime(Date.now(),ob.timestamp))
    return false
  if(this.getSign(ob)!=ob.signature)
    return false
  return true
}
