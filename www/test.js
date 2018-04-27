ob = {
  appkey:"1231231",
  timestamp:1524810992853,
  params:{
      name:"tinycalf",
      pass:"123",
      arr:["a","b"]
  }
}

var verify = require("./verify")

var sign = verify.getSign(ob)

ob.signature = sign

console.log(ob)

console.log(verify.verifySign(ob))
