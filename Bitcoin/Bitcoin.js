let RPC = require("bitcoind-rpc")

let Bitcoin = class Bitcoin {

  constructor(config) {
    this.rpc = new RPC({
      protocol: "http",
      host:   config.host,
      port:   config.port,
      user:   config.user,
      pass:   config.pass
    })
  }

  getBalance(){
    return new Promise ( (resolve, reject) => {
      this.rpc.getbalance("", (err, ret)=>{
        if(err) return reject(err)
        if(ret && ret.error!=null) return reject(new Error(ret.error))
        return resolve(ret.result)
      })
    })
  }

  getNewAddress(){
    return new Promise ( (resolve, reject) => {
      this.rpc.getNewAddress("", (err, ret)=>{
        if(err) return reject(err)
        if(ret && ret.error!=null) return reject(new Error(ret.error))
        return resolve(ret.result)
      })
    })
  }

  sendToAddress(to, amount){
    return new Promise ( (resolve, reject) => {
      this.rpc.sendtoaddress(to, amount, (err, ret)=>{
        if(err) return reject(err)
        if(ret && ret.error!=null) return reject(new Error(ret.error))
        return resolve(ret.result)
      })
    })
  }

  getTransaction(hash){
    return new Promise ( (resolve, reject) => {
      this.rpc.gettransaction(hash, (err, ret)=>{
        if(err) return reject(err)
        if(ret && ret.error!=null) return reject(new Error(ret.error))
        return resolve(ret.result)
      })
    })
  }


}




let config = require("../Config")

let btc = new Bitcoin({
  host:   config.btc.host,
  port:   config.btc.port,
  user:   config.btc.user,
  pass:   config.btc.pass
})

// btc.getBalance().then(console.log).catch(console.log)
// btc.getNewAddress().then(console.log).catch(console.log)
//
//
btc.sendToAddress("muEXBrBuJiYPngDVQMssf65mHS3hJ6jqWY", 10).then(console.log).catch(console.log)
// 20ed6e71b8f5ec326c625159169b38fa468975f1802e9dede26aa5982f7e2964
//
//
btc.getTransaction("20ed6e71b8f5ec326c625159169b38fa468975f1802e9dede26aa5982f7e2964")
.then(console.log).catch(console.log)
/*
{ amount: 0,
  fee: -0.0000748,
  confirmations: 0,
  trusted: true,
  txid: '20ed6e71b8f5ec326c625159169b38fa468975f1802e9dede26aa5982f7e2964',
  walletconflicts: [],
  time: 1526550661,
  timereceived: 1526550661,
  'bip125-replaceable': 'no',
  details:
   [ { account: '',
       address: 'muEXBrBuJiYPngDVQMssf65mHS3hJ6jqWY',
       category: 'send',
       amount: -10,
       label: '',
       vout: 0,
       fee: -0.0000748,
       abandoned: false },
     { account: '',
       address: 'muEXBrBuJiYPngDVQMssf65mHS3hJ6jqWY',
       category: 'receive',
       amount: 10,
       label: '',
       vout: 0 } ],
  hex: '0200000002c958512bc4075d151011a4f6f1c75be99dd29752e8cf17da8be9477bccf63396010000006a4730440220205ee08fec5dc8b424da1c989467f348399b2d5990b229a892a67e33d87afbc30220798fa1866f33d393ad99ff400356bc080763c9c0d1333d7bb852af0ff84526d7012103b3ba7aa451e7d6f2452cedc50ae2de4e81cde09c81a4afc50ee5e1dad30124d2fefffffff409f3e9c069cfb3b47a2f0170e6bde88816a830daa62f949bcc45f06fd78f2a000000006b483045022100bf54cbc68b5dfb94eb4638aafb6c536d45a35adea5717684ab2442e6db878838022077ea9c0f7c9a3a494f67e68393d6bc5bf0b59b9c322749b5a06a5146205622d1012103b3ba7aa451e7d6f2452cedc50ae2de4e81cde09c81a4afc50ee5e1dad30124d2feffffff0200ca9a3b000000001976a914967625b752cc8f53868876a90c92dd7478f1809988ac00e88602000000001976a91476cca40421f64ce77d2f38acd83dc4ec938a01b588acf6000000' }
 */
