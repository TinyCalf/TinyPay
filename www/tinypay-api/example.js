var Tinypay = require("./index")

var tinypay = new Tinypay({
  appKey: "b172afe6dc6fecc491bdb458853eeac49bd2a930",
  appSecret: "997abe175d48da23af5699fe668f89e57fbc49fbcaa3ac1970b23aca9d3168a6",
  apiUri:"http://127.0.0.1:1990"
})


/*
get info

THEN
{ ether: '0.997972596', king: '999999.999999999013368025' }
CATCH
a instance of node Error
*/

// tinypay.getInfo()
// .then(console.log)
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })



/*
get new account

THEN
{ address: '0x035a274de01f0bd4a3e3c30a9d7c13a7911389df',
  name: 'KingCoin',
  symbol: 'KING(KingCoin)',
  category: 'erc20' }
CATCH
a instance of node Error
*/

// tinypay.getNewAccount("king")
// .then(console.log)
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })



/*
transfer king to addresses

THEN

CATCH
a instance of node Error
*/

// tinypay.transferKingToAddresses(
//   ["0x212e754b95f99799aab5686ab21cf45a5f7e4000",
//   "0x18aa1fe4446719d60a3b8b848e9d8eed37b18718"],
//   ["20","30"])
// .then(console.log)
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })
