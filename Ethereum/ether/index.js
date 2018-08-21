//const utils = require("../utils")
//const web3 = utils.web3
//const mainAddress = utils.wallet.mainAddress
exports.account = require("./account")
exports.withdraw = require("./withdraw")

// exports.getBalanceOfMain = () => {
//   return new Promise((resolve, reject) => {
//     web3.eth.getBalance(mainAddress)
//       .then(ret => {
//         resolve({
//           alias: "ether",
//           symbol: "ether",
//           name: "ether",
//           balance: web3.utils.fromWei(ret)
//         })
//       })
//       .catch(err => reject(err))
//   })
// }