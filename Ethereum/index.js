const utils = require("./utils")
const config = utils.config
const ether = require("./ether")
const erc20 = require("./erc20")


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
    .catch(err=>reject(err))
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
  alias ether|king|tiny
  to    address
result
  

*/
