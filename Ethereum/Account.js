var hdkey = require("ethereumjs-wallet/hdkey")
var bip39 = require("bip39");
var db = require("./Database/EthereumAccount.db")
var log = require("../Log")("Ethereum/Account")

/* generate a new account*/
var _generate = () => {
  let mnemonic = bip39.generateMnemonic()
  let seed = bip39.mnemonicToSeed(mnemonic)
  let path = "m/44'/60'/0'/24";
  let hdwallet = hdkey.fromMasterSeed(seed)
  let wallet = hdwallet.derivePath(path).getWallet()
  let prikey = wallet.getPrivateKeyString()
  let pubkey = wallet.getPublicKeyString()
  let address = "0x" + wallet.getAddress().toString("hex")
  return {
    mnemonic:mnemonic,
    path: path,
    address:address,
    prikey:prikey,
    pubkey:pubkey,
  }
}

/*
create a new account (generate and insert into database)

EXAMPLE:
createNewAccount("ETH" ,"ether", "123809128301")
.then().catch(err=>log.err(err))
*/
var createNewAccount = (name, category, appid) => {
  return new Promise ( (resolve, reject) => {
    var account = _generate()
    account.name = name
    account.category = category
    account.appid = appid
    db.insert(account)
    .then(ret=>{
      log.success("Created New Account " + account.address)
      resolve()
    })
    .catch(err=>{
      reject(err)
    })
  })
}




// for(let i=0; i< 10000; i++){
//   createNewAccount("ETH" ,"ether", "123809128301")
//   .then(ret=>console.log(i)).catch(err=>log.err(err))
// }
