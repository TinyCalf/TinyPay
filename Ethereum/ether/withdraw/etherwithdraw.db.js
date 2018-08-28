const mongoose = require("../../mongoose")

let schema = new mongoose.Schema({

  /*needed when create*/
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  confirmations: {
    type: Number,
    default: 0
  },
  localSender: {
    type: String,
    required: true
  }, // address of from
  receiver: {
    type: String,
    required: true
  }, // address of to
  value: {
    type: String,
    required: true
  }, // Wei
  amount: {
    type: String,
    required: true
  }, // 18 demicals
  recordTimestamp: {
    type: Number,
    required: true
  },
  recordTime: {
    type: Date,
    required: true
  },
  /*needed when confirm*/
  success: {
    type: Boolean,
    required: true,
    default: false
  },
  gasUsed: {
    type: Number
  }, //Wei
  gasPrice: {
    type: Number
  }, //Wei
  etherUsed: {
    type: Number
  }, //Ether
  blockHash: {
    type: String
  },
  blockNumber: {
    type: Number
  },
  blockTimestamp: {
    type: Number
  },
  blockTime: {
    type: Date
  },
});

let EtherWithdraw = mongoose.model("EtherWithdraw", schema)

exports.add = (outcome) => {
  return new Promise((resolve, reject) => {
    var nOutcome = new EtherWithdraw()
    /*needed*/
    nOutcome.transactionHash = outcome.transactionHash
    nOutcome.localSender = outcome.localSender
    nOutcome.receiver = outcome.receiver
    nOutcome.value = outcome.value
    nOutcome.amount = outcome.amount
    nOutcome.gasPrice = outcome.gasPrice
    /*culculate*/
    nOutcome.recordTimestamp = parseInt(Date.now() / 1000)
    nOutcome.recordTime = Date()
    nOutcome.save((err, ret) => {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}


exports.confirmSuccess = (params) => {
  return new Promise((resolve, reject) => {
    var conditions = {
      transactionHash: params.transactionHash
    }
    var update = {
      $set: {
        success: true,
        gasUsed: params.gasUsed,
        etherUsed: params.etherUsed,
        blockHash: params.blockHash,
        blockNumber: params.blockNumber,
        blockTimestamp: params.blockTimestamp,
        blockTime: Date(params.blockTimestamp)
      }
    }
    EtherWithdraw.update(conditions, update, function (err, ret) {
      if (err) return reject(err)
      resolve(ret)
    });
  })
}


exports.findUnconfirmedTransactions = () => {
  return new Promise((resolve, reject) => {
    var conditions = {
      success: false
    }
    var fields = "-_id"
    EtherWithdraw.find(conditions, fields, (err, ret) => {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}

exports.findTransactionByHash = (hash) => {
  return new Promise((resolve, reject) => {
    var conditions = {
      transactionHash: hash
    }
    var fields = "-_id -__v"
    EtherWithdraw.findOne(conditions, fields, (err, ret) => {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}