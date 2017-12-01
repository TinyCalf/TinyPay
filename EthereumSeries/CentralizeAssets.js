/*
以太坊系列集中资产计划任务
*/
const config = require("../config")
const Rpc = require("./Rpc")

var etc = new Rpc("etc")

// etc.getBalance("0x5ceeec4f7d8768470bbd0918ff76a14a8e52f5d1")
// .then(ret=>console.log( etc.fromWei(ret).toString() ))
// .catch(err=>console.log(err))

// var checkAccountsBalanceAndTransToMain = (accounts, mainAccount) =>{
//
// }


//1.获取所有地址
//2.从第2个地址开始检查有没有余额大于最小限额的，有的话转到主钱包里

// var centralize = (rpc) =>{
//   return new Promise( (resolve, reject) => {
//     var mainAccount = "" //保留主钱包
//     var otherAccounts = [] // 保留其他钱包
//     //获取所有地址
//     rpc.getAccounts()
//     .then(accounts=>{
//       mainAccount = accounts[0]
//       accounts.splice(0,1)
//       otherAccounts = accounts
//       //
//     })
//     .catch(err=>console.log(err))
//   })
// }
//
// centralize(etc)


var p1 = new Promise ( (resolve, reject) => {
  console.log("p1")
  setTimeout(()=>{
    console.log("p1 done")
    resolve()
  },2000)
})

var p2 = new Promise ( (resolve, reject) => {
  console.log("p2")
  setTimeout(()=>{
    console.log("p2 done")
    resolve()
  },2000)
})


var p3 = new Promise ( (resolve, reject) => {
  console.log("p3")
  setTimeout(()=>{
    console.log("p3 done")
    resolve()
  },2000)
})

Promise.all([p1,p2,p3])
.then( ()=>console.log(1))
.catch(err=>console.log(err))
















/*
循环函数
*/
// var looper = (rpc, duration) => {
//   return new Promise ( (resolve, reject) => {
//     dealer(rpc).catch(err=>log.err(err))
//     setInterval(
//       ()=>{
//         dealer(rpc).catch(err=>log.err(err))
//       },
//       duration || 5000
//     )
//     resolve()
//   })
// }
