var Tinypay = require("./index")

var tinypay = new Tinypay({
  appKey: "b172afe6dc6fecc491bdb458853eeac49bd2a930",
  appSecret: "997abe175d48da23af5699fe668f89e57fbc49fbcaa3ac1970b23aca9d3168a6",
  apiUri:"http://127.0.0.1:1990"
})

/*
if the server is on ropsten network, you can check everything here:
https://ropsten.etherscan.io/
if the server is on main net, you can check here
https://etherscan.io/
*/


/*******************************************************************************

                                    get info

*******************************************************************************/
tinypay.getInfo()
.then(ret=>{
  console.log(ret)
  /*
  { ether: '0.952746587899799',
    king: '999549.999999999013368025' }
  */
})
.catch(err=>{
  console.log(err.code)
  console.log(err.message)
  console.log(err)
})





/*******************************************************************************

                                  get new account

*******************************************************************************/

tinypay.getNewAccount("ether")
.then(ret=>{
  console.log(ret)
  /*
  { address: '0xc038f0b81a4372d25329cbefcd51984ef6a1af42',
    name: 'ether',
    symbol: 'ether',
    category: 'ether' }
  */
})
.catch(err=>{
  console.log(err.code)
  console.log(err.message)
  console.log(err)
})

tinypay.getNewAccount("king")
.then(ret=>{
  console.log(ret)
  /*
  { address: '0x204d21ab051272e273dfdc3a8bd4671525a35756',
    name: 'KingCoin',
    symbol: 'KING(KingCoin)',
    category: 'erc20' }
  */
})
.catch(err=>{
  console.log(err.code)
  console.log(err.message)
  console.log(err)
})





/*******************************************************************************

                             transfer king to addresses

*******************************************************************************/

tinypay.transferKingToAddresses(
  ["0x204d21ab051272e273dfdc3a8bd4671525a35756",
  "0x204d21ab051272e273dfdc3a8bd4671525a35756"],
  ["20","30"])
.then(ret=>{
  console.log(ret)
  /*
  0xcb3b45f68615b138649b378c986eef1c686f167376a6b6eecbaca4b192282494
  */
})
.catch(err=>{
  console.log(err.code)
  console.log(err.message)
  console.log(err)
})





/*******************************************************************************

                                    withdraw

*******************************************************************************/
tinypay.withdraw("king","0x204d21ab051272e273dfdc3a8bd4671525a35756","11.5")
.then(ret=>{
  console.log(ret)
  /*
  0xd0b50a07957f362c613023a5b1592083585ff4c469863c960d7e57bfe879d850
  */
})
.catch(err=>{
  console.log(err.code)
  console.log(err.message)
  console.log(err)
})

tinypay.withdraw("ether","0xc038f0b81a4372d25329cbefcd51984ef6a1af42","0.001")
.then(ret=>{
  console.log(ret)
  /*
  0xbedccd6002620d49ed89e14cc791e06ba399571f5e2630db84fd43abce0a8047
  */
})
.catch(err=>{
  console.log(err.code)
  console.log(err.message)
  console.log(err)
})




/*******************************************************************************

                                  king sendback

*******************************************************************************/
tinypay.sendBack("0x204d21ab051272e273dfdc3a8bd4671525a35756")
.then(ret=>{
  console.log(ret)
  /*
  success
  */
})
.catch(err=>{
  console.log(err.code)
  console.log(err.message)
  console.log(err)
})
