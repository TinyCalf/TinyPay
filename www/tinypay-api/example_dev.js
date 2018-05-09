var Tinypay = require("./index")

var tinypay = new Tinypay({
  appKey: "b172afe6dc6fecc491bdb458853eeac49bd2a930",
  appSecret: "997abe175d48da23af5699fe668f89e57fbc49fbcaa3ac1970b23aca9d3168a6",
  apiUri:"http://127.0.0.1:1990"
})


/*******************************************************************************

                                    get info

*******************************************************************************/
// tinypay.getInfo()
// .then(ret=>{
//   console.log(ret)
//   /*
//   { ether: '0.952746587899799',
//     king: '999549.999999999013368025' }
//   */
// })
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })





/*******************************************************************************

                                  get new account

*******************************************************************************/

// tinypay.getNewAccount("ether")
// .then(ret=>{
//   console.log(ret)
//   /*
//   { address: '0xe12fbb63bd3b098bade094c75d4606f1e3cd6b3a',
//     name: 'ether',
//     symbol: 'ether',
//     category: 'ether' }
//   */
// })
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })

// tinypay.getNewAccount("king")
// .then(ret=>{
//   console.log(ret)
//   /*
//   { address: '0xcb5679b0e498f1f349ae0694b89f822b4280c922',
//     name: 'KingCoin',
//     symbol: 'KING(KingCoin)',
//     category: 'erc20' }
//   */
// })
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })




/*******************************************************************************

                             transfer king to addresses

*******************************************************************************/

// tinypay.transferKingToAddresses(
//   ["0xcb5679b0e498f1f349ae0694b89f822b4280c922"],
//   ["20"])
// .then(ret=>{
//   console.log(ret)
//   /*
//   0x8b3772e5bb58080f1158a192643f1df6f6f8e4859322037ebae86d2a0378486a
//   */
// })
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })





/*******************************************************************************

                                    withdraw

*******************************************************************************/
// tinypay.withdraw("king","0xcb5679b0e498f1f349ae0694b89f822b4280c922","11.5")
// .then(ret=>{
//   console.log(ret)
//   /*
//   0xd0b50a07957f362c613023a5b1592083585ff4c469863c960d7e57bfe879d850
//   */
// })
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })
//
// tinypay.withdraw("ether","0xe12fbb63bd3b098bade094c75d4606f1e3cd6b3a","0.001")
// .then(ret=>{
//   console.log(ret)
//   /*
//   0x7a23f525f5d943ed62a927bf6c9f0bfe6cd93b59b681828bdc3dca6c101345e2
//   */
// })
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })




/*******************************************************************************

                                  king sendback

*******************************************************************************/
// tinypay.sendBack("0xcb5679b0e498f1f349ae0694b89f822b4280c922")
// .then(ret=>{
//   console.log(ret)
//   /*
//   success
//   */
// })
// .catch(err=>{
//   console.log(err.code)
//   console.log(err.message)
//   console.log(err)
// })
