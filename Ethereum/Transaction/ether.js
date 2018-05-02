require("../../log")
var web3 = require("../web3")
var config = require("../../Config")
var wallet = require("./wallet")

/*
get ether balance of main , unit is ether
RESLOVE
999999.999999999013368025
*/
exports.getBalanceOfMainInEther = new Function()


_getEtherBalanceOfMain = () => {
  return web3.eth.getBalance(wallet.mainAddress)
}

this.getBalanceOfMainInEther = () => {
  return new Promise ( (resolve, reject) => {
    _getEtherBalanceOfMain()
    .then(ret=>{
      resolve(web3.utils.fromWei(ret))
    })
    .catch(err=>reject(err))
  })
}
