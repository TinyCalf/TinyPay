const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  address:        {type:String, required:true, unique:true},
  prikey:         {type:String, required:true},
  pubkey:         {type:String, required:true},
  path:           {type:String, required:true},
  mnemonic:       {type:String, required:true},
  symbol:         {type:String, required:true},
  category:       {type:String, required:true},
});

var EthereumAccount = mongoose.model("EthereumAccount", schema)

/*export model*/
exports.model = EthereumAccount

/*
add a new account

EXAMPLE
db.insert({
  address
  prikey
  pubkey
  path
  mnemoic
  alias
  symbol
  category
}).then(console.log).catch(console.log)
*/
exports.insert = new Function("params")

/*
find the prikey for an account

EXAMPLE
this.getPrikey("0xb479714e75cbba8e96fd0aea364da7f4b84d7e43")
.then(console.log).catch(console.log)
*/
exports.getPrikey = new Function("address")


/*
find all addresses by symbol

*/
exports.getAddressesBySymbol = new Function("symbol")



/*add a new account*/
this.insert = (params) => {
  return new Promise ( (resolve, reject) => {
    var nAccount = new EthereumAccount()
    nAccount.address = params.address
    nAccount.prikey = params.prikey
    nAccount.pubkey = params.pubkey
    nAccount.path = params.path
    nAccount.mnemonic = params.mnemonic
    nAccount.name = params.name
    nAccount.symbol = params.symbol
    nAccount.category = params.category
    nAccount.save( (err, ret) => {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}

this.getPrikey = (address) => {
  return new Promise ( (resolve, reject) => {
    EthereumAccount.findOne({address:address}, "prikey", (err, ret) => {
      if(err) return reject(err.code)
      if(!ret) return reject(new Error("address not found"))
      if(!ret.prikey) return reject(new Error("prikey not found"))
      resolve(ret.prikey)
    })
  })
}

this.getAddressesBySymbol = (symbol) => {
  return new Promise ( (resolve, reject) => {
    EthereumAccount.find({symbol:symbol}, "-_id address", (err, ret) => {
      if(err) return reject(err.code)
      if(!ret) return reject(new Error("addresses not found"))
      resolve(ret)
    })
  })
}
