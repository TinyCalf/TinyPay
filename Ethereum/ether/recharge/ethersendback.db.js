const mongoose = require("../../mongoose")

const schema = new mongoose.Schema({
  /*address in which token should be send back to main */
  address: {
    type: String,
    required: true,
    unique: true,
  },
  localSender: {
    type: String,
    required: true
  },
  /*if sent back to the main account,0 have not, 1 pending , 2 succeed*/
  sentBackStatus: {
    type: Number,
    default: 0
  },
  sentBackTransactionHash: {
    type: String,
    default: ""
  },
  etherUsed: {
    type: String,
    default: 0
  },
  value: {
    type: String,
    default: ""
  },
  amount: {
    type: String,
    default: ""
  },
  errorLogs: {
    type: Array,
    default: []
  }
})
let Model = mongoose.model("EtherSendback", schema)

let EtherSendBackModel = class EtherSendBackModel {
  /*add new record*/
  create(address) {
    return new Promise((resolve, reject) => {
      var q = new Model()
      q.address = address
      q.localSender = address
      q.save((err, ret) => {
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

  addSentBackTransaction(address, hash, value, amount, etherUsed) {
    return new Promise((resolve, reject) => {
      let conditions = {
        address: address
      }
      let update = {
        $set: {
          sentBackTransactionHash: hash,
          sentBackStatus: 1,
          etherUsed: etherUsed,
          value: value,
          amount: amount
        }
      }
      Model.update(conditions, update, (err, ret) => {
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

  confirmSentBack(sentBackTransactionHash) {
    return new Promise((resolve, reject) => {
      let conditions = {
        sentBackTransactionHash: sentBackTransactionHash
      }
      let update = {
        $set: {
          sentBackStatus: 2,
          address: sentBackTransactionHash
        }
      }
      Model.update(conditions, update, (err, ret) => {
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

  findOneNoSentBack() {
    return new Promise((resolve, reject) => {
      let conditions = {
        sentBackStatus: 0
      }
      let fields = "address"
      Model.findOne(conditions, fields, (err, ret) => {
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

  findAllSentBackButNoConfirmedAddress() {
    return new Promise((resolve, reject) => {
      let conditions = {
        sentBackStatus: 1
      }
      let fields = "address sentBackTransactionHash"
      Model.find(conditions, fields, (err, ret) => {
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

  addErrorLogs(address, msg) {
    return new Promise((resolve, reject) => {
      let conditions = {
        address: address
      }
      let update = {
        $push: {
          errorLogs: msg
        }
      }
      Model.update(conditions, update, (err, ret) => {
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

  check(sentBackTransactionHash) {
    return new Promise((resolve, reject) => {
      let conditions = {
        sentBackTransactionHash: sentBackTransactionHash
      }
      let fields = "etherUsed amount localSender sentBackTransactionHash"
      Model.findOne(conditions, fields, (err, ret) => {
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

}


module.exports = new EtherSendBackModel()