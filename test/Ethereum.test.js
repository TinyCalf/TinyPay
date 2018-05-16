var Ethereum = require("../Ethereum")
/*
1. get all kinds of balance of the main account
*/
// Ethereum.getinfo().then(console.log).catch(console.log)



/*
get all kinds of balance of the main account

1.ether 2.king 3.tiny
  should return an account
  should be in database
4.ethereum 5.www 6.siufdaod
  should return error


{ address: '0xbf9d5dea24c3d28eb92148e3b0be28b9d77d9320',
  name: 'ether',
  symbol: 'ether',
  alias: 'ether',
  category: 'ether' }
{ address: '0xab2a4380a69e372972c4f62869d1478b1963c903',
  name: 'KingCoin',
  symbol: 'KING(KingCoin)',
  alias: 'king',
  category: 'erc20' }
{ address: '0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1',
  name: 'Tiny Calf',
  symbol: 'TINY',
  alias: 'tiny',
  category: 'erc20' }

*/
// let getnewaccount =(alias)=>{
//   Ethereum.getNewAccount(alias).then(console.log)
//   .catch(err=>{
//     console.log(err.message)
//   })
// }
// getnewaccount("ether")
// getnewaccount("king")
// getnewaccount("tiny")
// getnewaccount("ethereum")
// getnewaccount("www")
// getnewaccount("siufdaod")




/*
3. withdraw ether of erc20 tokens from main account
alias 1.ether tiny king www
to   1.address 2 fjdasldfq
amount
1. 10.01
2. -10
3. 10000000
4. 0.000091828381828392
5. 1.672964149712974521957451974
6. 1e-7
*/
Ethereum.withdraw(
  "ether",
  "0xbf9d5dea24c3d28eb92148e3b0be28b9d77d9320",
  "0.009"
).then(console.log).catch(console.log)
// Ethereum.withdraw(
//   "tiny",
//   "0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1",
//   "10"
// ).then(console.log).catch(console.log)




/*
4
*/
Ethereum.events
.on("outcomeSuccess", msg=>{
  console.log("outcomeSuccess")
  console.log(msg)
  /*
{ recordTime: 2018-05-16T10:19:49.000Z,
  recordTimestamp: 1526465989,
  name: 'Tiny Calf',
  symbol: 'TINY',
  alias: 'tiny',
  gasPrice: 4000000000,
  amount: '10',
  value: '10000000000000000000',
  receiver: '0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1',
  localSender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  transactionHash: '0xad09c447e514393c29f2518d53ab1d53520e8fcde5e3116b6a32265ded077e64',
  success: true,
  confirmations: 0,
  __v: 0,
  gasUsed: 38827,
  etherUsed: 0.000155308,
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  blockTimestamp: 1526466023,
  blockTime: 2018-05-16T10:20:28.000Z }


{ name: 'ether',
  symbol: 'ether',
  alias: 'ether',
  recordTime: 2018-05-16T10:38:44.000Z,
  recordTimestamp: 1526467124,
  gasPrice: 4000000000,
  amount: '0.009',
  value: '9000000000000000',
  receiver: '0xbf9d5dea24c3d28eb92148e3b0be28b9d77d9320',
  localSender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  transactionHash: '0xba47d6fa65bdee2a0039797de77c1c8b2030be7f05be0debf00aaac387c0f5c7',
  success: true,
  confirmations: 0,
  gasUsed: 21000,
  etherUsed: 0.000084,
  blockHash: '0x0cde49037e6114e928e3436b2340c1b856287dab8a8f60059cf62fefdddc8a09',
  blockNumber: 3245243,
  blockTimestamp: 1526467149,
  blockTime: 2018-05-16T10:39:12.000Z }


  */
})
.on("newIncome", msg=>{
  console.log("newIncome")
  console.log(msg)
/*
{ alias: 'tiny',
  symbol: 'TINY',
  transactionHash: '0xad09c447e514393c29f2518d53ab1d53520e8fcde5e3116b6a32265ded077e64',
  confirmations: 0,
  sender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  localReceiver: '0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1',
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  value: '10000000000000000000',
  amount: '10' }
{
   alias: 'ether',
  symbol: 'ether',
  transactionHash: '0xe01c43e1d7926d884945f393c5c33d8cd665a56b810edad92cc80e3f8f67a051',
  confirmations: 0,
  sender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  localReceiver: '0xbf9d5dea24c3d28eb92148e3b0be28b9d77d9320',
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  value: '9000000000000000',
  amount: '0.009' }


*/

})
.on("confirmationUpdate", msg=>{
  console.log("confirmationUpdate")
  console.log(msg)
  /*
{ alias: 'ether',
  symbol: 'ether',
  transactionHash: '0xe01c43e1d7926d884945f393c5c33d8cd665a56b810edad92cc80e3f8f67a051',
  confirmations: 3,
  sender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  localReceiver: '0xbf9d5dea24c3d28eb92148e3b0be28b9d77d9320',
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  value: '9000000000000000',
  amount: '0.009' }

  { alias: 'tiny',
  symbol: 'TINY',
  transactionHash: '0xad09c447e514393c29f2518d53ab1d53520e8fcde5e3116b6a32265ded077e64',
  confirmations: 4,
  sender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  localReceiver: '0xed98d0d7f35ccae826aa93bd7981ece17a1d4fd1',
  blockHash: '0xb5e8dccc8206e3c146496e607553c50bef1afb830c3eac1da52f67cb607662e6',
  blockNumber: 3245159,
  value: '10000000000000000000',
  amount: '10' }

  */

})
