const utils = require("../utils")
const web3 = utils.web3
const mainAddress = utils.wallet.mainAddress
const erc20instances = utils.erc20instances


exports.getBalanceOfMain = ()=>{
  return new Promise ( (resolve, reject) =>{
    let instances = []

    for(alias in erc20instances) {
      instances.push(erc20instances[alias])
    }
    Promise.map(instances, instance => {
      return new Promise ( (resolve, reject)=>{
        let obj = {}
        obj.alias = instance.alias
        obj.symbol = instance.symbol
        obj.name = instance.name
        instance.instance.methods.balanceOf(mainAddress).call()
        .then(ret=>{
          obj.balance = web3.utils.fromWei(ret)
          resolve(obj)
        })
        .catch(err=>resolve(err))
      })
    })
    .then(ret=>{
      resolve(ret)
    })
    .catch(err=>reject(err))
  })
}
