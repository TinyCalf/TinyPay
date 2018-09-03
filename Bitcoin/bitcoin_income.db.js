const mongoose = require("./mongoose")

var schema = new mongoose.Schema({
  alias: {
    type: String,
    required: true,
    default: "btc"
  },
  symbol: {
    type: String,
    required: true,
    default: "btc"
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  confirmations: {
    type: Number,
    required: true,
    default: 0
  },
  sender: {
    type: String,
    required: true,
    default: "user"
  }, // address of from
  localReceiver: {
    type: String,
    required: true
  }, // address of to
  amount: {
    type: String,
    required: true
  },
});

var Model = mongoose.model("bitcoin_income", schema)

/*export model*/
exports.model = Model

this.add = (income) => {
  return new Promise((resolve, reject) => {
    let n = new Model()
    n.transactionHash = income.transactionHash
    n.confirmations = income.confirmations
    n.localReceiver = income.localReceiver
    n.amount = income.amount
    n.save((err, ret) => {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}

this.checkTransactionByHash = (hash) => {
  return new Promise((resolve, reject) => {
    let conditions = {
      transactionHash: hash
    }
    Model.findOne(conditions, function (err, ret) {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}

this.updateConfirmation = (confirmations, transactionHash) => {
  return new Promise((resolve, reject) => {
    var conditions = {
      transactionHash: transactionHash
    }
    var update = {
      $set: {
        confirmations: confirmations
      }
    }
    Model.update(conditions, update, function (err, ret) {
      if (err) return reject(err)
      resolve(ret)
    });
  })
}