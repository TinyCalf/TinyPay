const dbconnect = require("../../mongoose")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
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
    required: true
  }, // address of from
  localReceiver: {
    type: String,
    required: true
  }, // address of to
  blockHash: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  value: {
    type: String,
    required: true
  }, // Wei
  amount: {
    type: String,
    required: true
  }, // 18 demicals
});

let EtherRecharge = mongoose.model("EtherRecharge", schema)

exports.add = (txs) => {
  return new Promise((resolve, reject) => {
    if (txs.length == 0) return resolve()
    EtherRecharge.collection.insert(txs, function (err, ret) {
      if (err && err.code != 11000) return reject(err)
      if (err && err.code == 11000) return resolve()
      resolve()
    })
  })
}


exports.updateConfirmationByBlockHash = (confirmations, blockHash) => {
  return new Promise((resolve, reject) => {
    var conditions = {
      blockHash: blockHash
    }
    var update = {
      $set: {
        confirmations: confirmations
      }
    }
    EtherRecharge.update(conditions, update, function (err, ret) {
      if (err) return reject(err)
      resolve(ret)
    });
  })
}

exports.findIncomesByBlockHash = (blockHash) => {
  return new Promise((resolve, reject) => {
    var conditions = {
      blockHash: blockHash
    }
    var fields = "-_id"
    EtherRecharge.find(conditions, fields, function (err, ret) {
      if (err) return reject(err)
      resolve(ret)
    });
  })
}