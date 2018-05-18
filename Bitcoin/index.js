let btc = require("./Bitcoin")
let config = require("../Config")




exports.getInfo = () => {
  return new Promise ( (resolve, reject)=>{
    btc.getBalance()
    .then(ret=>{
      let data = {
        alias:"btc",
        symbol:"btc",
        name:"btc",
        balance:ret.toString(10)
      }
      resolve(data)
    })
    .catch(reject)
  })
}


/*
{ alias: 'btc',
  symbol: 'btc',
  name: 'btc',
  category: 'bitcoin',
  address: 'mmBqYHLaqp1NhnAnV31PgdkbnnNRmLZpVo' }

 */
exports.getNewAccount = () => {
  return new Promise ( (resolve, reject)=>{
    btc.getNewAddress()
    .then(ret=>{
      let data = {
        alias:"btc",
        symbol:"btc",
        name:"btc",
        category:"bitcoin",
        address:ret
      }
      resolve(data)
    })
    .catch(reject)
  })
}

/*
236ef5c22149ab825e9106f7b0ace4501cfcb2a27a05582e65a5e20e1e9e6df0
 */
exports.withdraw = (to, amount) => {
    return btc.sendToAddress(to , amount)
}




this.withdraw("mmBqYHLaqp1NhnAnV31PgdkbnnNRmLZpVo","20")
.then(console.log).catch(console.log)
