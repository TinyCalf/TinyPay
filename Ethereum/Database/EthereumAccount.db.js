const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  name:           {type:String, required:true}, // ETH KING PAY ...
  category:       {type:String, required:true}, // ether erc20 erc233 ....
  appid:          {type:String},
  address:        {type:String, required:true, unique:true},
  prikey:         {type:String, required:true},
  pubkey:         {type:String, required:true},
  path:           {type:String, required:true},
  mnemonic:       {type:String, required:true}
});

var EthereumAccount = mongoose.model("EthereumAccount", schema)

/*export model*/
exports.model = EthereumAccount

/*add a new account*/
exports.insert = (params) => {
  return new Promise ( (resolve, reject) => {
    var nAccount = new EthereumAccount()
    nAccount.name = params.name
    nAccount.category = params.category
    nAccount.appid = params.appid
    nAccount.address = params.address
    nAccount.prikey = params.prikey
    nAccount.pubkey = params.pubkey
    nAccount.path = params.path
    nAccount.mnemonic = params.mnemonic
    nAccount.save( (err, ret) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

// exports.findOneByAddress(address)
