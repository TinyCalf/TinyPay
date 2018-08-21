const dbconnect = require("../../mongoose")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  prikey: {
    type: String,
    required: true
  },
  pubkey: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mnemonic: {
    type: String,
    required: true
  },

});

let EtherAccount = mongoose.model("EtherAccount", schema)


/*add a new account*/
exports.add = (params) => {
  return new Promise((resolve, reject) => {
    var nAccount = new EtherAccount()
    nAccount.address = params.address
    nAccount.prikey = params.prikey
    nAccount.pubkey = params.pubkey
    nAccount.path = params.path
    nAccount.mnemonic = params.mnemonic
    nAccount.save((err, ret) => {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}

this.getPrikeyByAddress = (address) => {
  return new Promise((resolve, reject) => {
    EtherAccount.findOne({
      address: address
    }, "prikey", (err, ret) => {
      if (err) return reject(err.code)
      if (!ret) return reject(new Error("address not found"))
      if (!ret.prikey) return reject(new Error("prikey not found"))
      resolve(ret.prikey)
    })
  })
}

this.selectExistedAddresses = (addresses) => {
  return new Promise((resolve, reject) => {
    var conditions = {
      address: {
        $in: addresses
      }
    }
    EtherAccount.find(conditions, "-_id address", (err, ret) => {
      if (err) return reject(err.code)
      if (!ret) return reject(new Error("addresses not found"))
      var res = []
      ret.forEach((address) => {
        res.push(address.address)
      })
      resolve(res)
    })
  })
}