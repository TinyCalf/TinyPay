var account = require("./Account")
//
// account.createNewAccount("king").then(console.log).catch(err=>console.log(err.message))
// //
//

//
// var db = require("./Database/EthereumAccount.db.js")
// db.getPrikey("0xb479714e75ca8e96fd0aea364da7f4b84d7e43")
// .then(console.log).catch(console.log)

account.getAddressesByAlias("king").then(console.log).catch(console.log)
