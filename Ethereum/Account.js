require("../log")
var hdkey = require("ethereumjs-wallet/hdkey")
var bip39 = require("bip39");
var db = require("./Database/EthereumAccount.db")
var config = require("../Config")



/*
create a new account (generate and insert into database)
EXAMPLE:
createNewAccount()
.then().catch(err=>log.err(err))
*/
exports.createNewAccount = new Function("alias")

/*
find the prikey of account
*/
exports.getPrivateKeyForAccount = new Function("address")

/*
find addresses by alias
EXAMPLE
account.getAddressesByAlias("king").then(console.log).catch(console.log)
RETURN 
[ '0xbf0d681a164367b7fcef9435d32a23889fed100d',
  '0x199c22f08dec6e189ac1c6b768919097be24f965',
  '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  '0xf02ee1ec37fd6aa356029f7dec2f5eb081a5bbce' ]
*/
exports.getAddressesByAlias = new Function("alias")


var _getCurrencyByAlias = (alias) => {
  if(!config[alias]) throw new Error("ALIAS_NOT_FOUND")
  return config[alias]
}


/*generate a new account*/
var _generate = () => {
  let mnemonic = bip39.generateMnemonic()
  let seed = bip39.mnemonicToSeed(mnemonic)
  let path = "m/44'/60'/0'/24";
  let hdwallet = hdkey.fromMasterSeed(seed)
  let wallet = hdwallet.derivePath(path).getWallet()
  let prikey = wallet.getPrivateKey().toString("hex")
  let pubkey = wallet.getPublicKey().toString("hex")
  let address = "0x" + wallet.getAddress().toString("hex")
  return {
    mnemonic:mnemonic,
    path: path,
    address:address,
    prikey:prikey,
    pubkey:pubkey,
  }
}

this.createNewAccount = (alias) => {
  return new Promise ( (resolve, reject) => {
    var account = _generate()
    currency = _getCurrencyByAlias(alias)
    account.name = currency.name
    account.symbol = currency.symbol
    account.category  = currency.category
    db.insert(account)
    .then(ret=>{
      var account = {}
      account.address = ret.address
      account.name = ret.name
      account.symbol = ret.symbol
      account.category = ret.category
      resolve(account)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

this.getPrivateKeyForAccount = (address) =>{
    return db.getPrikey(address)
}

this.getAddressesByAlias = (alias) => {
  return new Promise ( (resolve, reject) =>{
    var symbol = _getCurrencyByAlias(alias).symbol
    db.getAddressesBySymbol(symbol)
    .then(ret=>{
      var array = []
      ret.forEach((line)=>{
        array.push(line.address)
      })
      resolve(array)
    })
    .catch(err=>reject(err))
  })
}
