const utils = require("./utils")
const config = utils.config
const web3 = utils.web3
const ether = require("./ether")
const erc20 = require("./erc20")
const eth_util = require("ethereumjs-util")
const Event = require("events")


exports.Transaction = require("./Transaction")
exports.Account = require("./Account")


let erc20sendback = require("./erc20/sendback")
erc20sendback.startAll()
let ethersendback = require("./ether/sendback")
ethersendback.start()

/*
listen to income and sendback

*/



/*
Provide the funcions below:

1. get all kinds of balance of the main account

2. get a new account of ether or erc20 tokens

3. withdraw ether of erc20 tokens from main account

4. an event emitter of all kings of info like "newincome comformationupdate txsuccess"

*/

/*
1. get all kinds of balance of the main account
return
[ { alias: 'king',
    symbol: 'KING(KingCoin)',
    name: 'KingCoin',
    balance: '999497.344429999013367925' },
  { alias: 'tiny',
    symbol: 'TINY',
    name: 'Tiny Calf',
    balance: '1000000' },
  { alias: 'ether',
    symbol: 'ether',
    name: 'ether',
    balance: '1.540200950899799' } ]

UNKNOW_ERROR

*/
exports.getinfo = () =>{
  return new Promise ((resolve, reject)=>{
    let result = []
    erc20.getBalanceOfMain()
    .then(ret=>{
      result = result.concat(ret)
      return ether.getBalanceOfMain()
    })
    .then(ret=>{
      result = result.concat(ret)
      resolve(result)
    })
    .catch(err=>{
      console.error(err)
      reject(new Error("UNKNOW_ERROR"))
    })
  })
}


/*
2. get a new account of ether or erc20 tokens
params ether|king|tiny
result
{ address: '0xd0f1d390033d18617fb4d6835f561d5467f80756',
  name: 'ether',
  symbol: 'ether',
  alias: 'ether',
  category: 'ether' }
{ address: '0xbcfbd11f3db008c710d3b6836828440e1e2542f3',
  name: 'KingCoin',
  symbol: 'KING(KingCoin)',
  alias: 'king',
  category: 'erc20' }
{ address: '0x8b88e7157a887c89592d2106d41c593669aacf13',
  name: 'Tiny Calf',
  symbol: 'TINY',
  alias: 'tiny',
  category: 'erc20' }

  INVAILD_ALIAS
  UNKNOW_ERROR
*/
exports.getNewAccount = (alias) =>{
  return new Promise ((resolve, reject)=>{
    if(!config[alias] || !config[alias].category)
      return reject(new Error("INVAILD_ALIAS"))
    let nCurrency = config[alias]
    this.Account.createNewAccount(alias)
    .then(ret=>resolve(ret))
    .catch(err=>{
      console.error(err)
      return reject(new Error("UNKNOW_ERROR"))
    })
  })
}


/*
3. withdraw ether of erc20 tokens from main account
params
  alias    ether|king|tiny
  to       address
  amount
result
  hash

INVAILD_ALIAS
INVAILD_ADDRESS
INVAILED_AMOUNT
SEND_TOO_OFTEN
INSUFFICIENT_FUNDS
UNKNOW_ERROR
*/
exports.withdraw = (alias, to, amount) => {
  return new Promise( (resolve, reject) => {
    if(!config[alias] || !config[alias].category)
      return reject(new Error("INVAILD_ALIAS"))
    let nCurrency = config[alias]
    if(!eth_util.isValidAddress(to) )
      return reject(new Error("INVAILD_ADDRESS"))
    to = to.toLowerCase()
    if(typeof amount != "string")
      return reject(new Error("INVAILED_AMOUNT"))
    try{
      let value = web3.utils.toWei(amount)
    }
    catch(e){
      return reject(new Error("INVAILED_AMOUNT"))
    }
    switch(nCurrency.category){
      case "ether":{
        this.Transaction.etheroutcome.transferEtherInEther(
          to,
          amount
        )
        .then(ret=>resolve(ret))
        .catch(err=>{
          if(err.message == "SEND_TOO_OFTEN")
            return reject(new Error("SEND_TOO_OFTEN"))
          if(err.message.search(/Insufficient funds/i))
            return reject(new Error("INSUFFICIENT_FUNDS"))
          else return reject(new Error("UNKNOW_ERROR"))
        })
        break
      }
      case "erc20" : {
        this.Transaction.erc20outcome.transferERC20InEther(
          alias,
          to,
          amount
        )
        .then(ret=>resolve(ret))
        .catch(err=>{
          if(err.message == "SEND_TOO_OFTEN")
            return reject(new Error("SEND_TOO_OFTEN"))
          if(err.message == "Insufficient funds")
            return reject(new Error("INSUFFICIENT_FUNDS"))
          else return reject(new Error("UNKNOW_ERROR"))
        })
        break
      }
      default: reject(new Error("UNKNOW_ERROR"))
    }
  })
}

/*
4. an event emitter of all kings of info like "newincome comformationupdate txsuccess"
*/
let events = new Event()
exports.events = events


this.Transaction.etheroutcome.getEvents
.on('outcomeSuccess', (outcome) => {
  events.emit("outcomeSuccess", outcome)
})

this.Transaction.erc20outcome.getEvents
.on('outcomeSuccess', (outcome) => {
  events.emit("outcomeSuccess", outcome)
})

this.Transaction.erc20income.getEvents
.on('newIncome', (income) => {
    events.emit("newIncome", income)
})
.on('confirmationUpdate',(transaction) => {
    events.emit("confirmationUpdate", transaction)
    if(transaction.confirmations >=20){
      erc20sendback.addAddress(transaction.alias, transaction.localReceiver)
      .catch(err=>console.error(err))
    }
})

this.Transaction.etherincome.getEvents
.on('newIncome', (income) => {
    events.emit("newIncome", income)
})
.on('confirmationUpdate',(transaction) => {
    events.emit("confirmationUpdate", transaction)
    if(transaction.confirmations >=20){
      ethersendback.addAddress(transaction.localReceiver)
      .catch(err=>console.error(err))
    }
})
