/*
区块链 重启脚本 目前包括 RBTC | RETC

重启脚本包含一下步骤

1.停止节点运行

2.删除前区块链数据

3.删除相关mongodb数据库

4.节点重新运行

5.预挖矿200个

TODO:目前调用这个脚本的进程如果退出则以太放客户端也会退出，需要解决方案
*/

var child_process = require('child_process')
var db = require('../Database/db')
const path = './PrivateBlockchain/'

/*
RBTC 重启
*/
var rebuildRBTC = () => {
  return new Promise( (resolve, reject) => {
    //重启脚本
    console.log("RBTC重建区块链")
    child_process.execFile(
      path + 'RBTC/rebuild', [],
      (error, stdout, stderr) => {
      //数据库高度更新
      console.log("RBTC数据库高度更新")
      db.updateCheckedHeight("rbtc", 10)
      .then( ret => resolve() )
      .catch( err=> reject(err) )
    });
  })
}

/*
RETC 重启
*/
var Rpc = require('../EthereumSeries/Rpc')
var etc = new Rpc("etc")

var rebuildRETC = () => {
  return new Promise( (resolve, reject) => {
    //重建区块链
    console.log("RETC重建区块链")
    child_process.spawn( path + "RETC/rebuild", [], {detached:true} )
    setTimeout( ()=>{
      //数据库高度更新
      console.log("RETC数据库高度更新")
      db.updateCheckedHeight("etc", 10)
      .then( ()=>{
        //删除ETC的账户数据库
        console.log("删除RETC的账户数据库")
        return db.clearETCAccounts()
      })
      .then( (ret) => {
        //创建新账户
        console.log("创建RETC新账户")
        return etc.getNewAccount()
      })
      .then( ()=> {
        //开始挖矿
        console.log("RETC开始挖矿")
        child_process.spawn( path + 'RETC/startmine', [],{detached:true} )
        resolve()
      })
      .catch(err=>{
        reject(err)
      })
    },5000)
  })
}


exports.start = () => {
  return new Promise( (resolve, reject) => {
    rebuildRETC()
    .then(()=>{
      console.log("RETC私有链重建成功")
      return rebuildRBTC()
    })
    .then( ()=>{
      console.log("RBTC私有链重建成功")
      resolve()
      //process.exit()
    })
    .catch( (err)=> {
      reject(err)
    })
  })
}
