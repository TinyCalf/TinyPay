var crypto = require("crypto")


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

var secret = "997abe175d48da23af5699fe668f89e57fbc49fbcaa3ac1970b23aca9d3168a6"


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
  if(duration>1000*60)
    return false
  else
    return true
}

this.getSign = (ob) => {
  var params = sortParams(ob.params)
  var str = params + secret + ob.timestamp
  console.log(str)
  var sha1 = crypto.createHash('sha1');
  sha1.update(str);
  var sign = sha1.digest('hex')
  return sign
}

this.verifySign = (ob) => {
  if(!verifyTime(Date.now(),ob.timestamp))
    return false
  if(this.getSign(ob)!=ob.signature)
    return false
  return true
}
