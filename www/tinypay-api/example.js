var Tinypay = require("./index")

var tinypay = new Tinypay({
  appKey: "b172afe6dc6fecc491bdb458853eeac49bd2a930",
  appSecret: "997abe175d48da23af5699fe668f89e57fbc49fbcaa3ac1970b23aca9d3168a6",
  apiUri:"http://127.0.0.1:1990"
})

tinypay.getNewAccount("king").then(console.log).catch(console.log)
