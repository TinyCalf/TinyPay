exports.Transaction = require("./Transaction")
exports.Account = require("./Account")


let erc20sendback = require("./erc20/sendback")
erc20sendback.startAll()
// erc20sendback.addAddress("tiny", "0x4aac1c1c2e23d68c1e78f5d9ab214eb45b8288d5")
// .then(console.log).catch(console.log)
