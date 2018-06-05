let bitcoin = require("./index")


// bitcoin.getInfo().then(console.log).catch(console.log)
//
// bitcoin.getNewAccount().then(console.log).catch(console.log)
//
bitcoin.withdraw("mw6ZGJMMsTgptdLVPZZLP1WxQcSTMKoSJY", "6.0012")
.then(console.log).catch(console.log)


bitcoin.events
.on("newIncome", income=>{
  console.log("newIncome")
  console.log(income)
})
.on("comfirmationUpdate", income=>{
  console.log("comfirmationUpdate")
  console.log(income)
})
.on("outcomeSuccess", outcome=>{
  console.log("outcomeSuccess")
  console.log(outcome)
})
