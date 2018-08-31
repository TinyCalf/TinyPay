const mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
const host = require("../../config").get().get("mongodb");
console.log(host)
mongoose.connect(host, {
  useMongoClient: true
});

var schema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  times: {
    type: Number,
    required: true,
    default: 0
  },
  received: {
    type: Boolean,
    required: true,
    default: false
  }
});

var Callbackqueue = mongoose.model("Callbackqueue", schema);

exports.model = Callbackqueue

/*
add new line
*/
exports.add = new Function("message", "type")

/*
find the last one that is unreceived
*/
exports.findOneUnreceived = new Function()

/*
update the received state to true
*/
exports.markReceived = new Function("id")


this.add = (message, type, uuid) => {
  return new Promise((resolve, reject) => {
    Callbackqueue.collection.insert([{
      message: message,
      type: type,
      uuid: uuid,
      received: false
    }], function (err, ret) {
      if (err && err.code == 11000) return resolve()
      if (err) return reject(err)
      resolve()
    })
  })
}

this.findOneUnreceived = () => {
  return new Promise((resolve, reject) => {
    Callbackqueue.findOne({
      received: false
    }, "_id message type", (err, ret) => {
      if (err) return reject(err);
      resolve(ret);
    })
  })
}

this.markReceived = (id) => {
  return new Promise((resolve, reject) => {
    var data = {
      $set: {
        received: true
      }
    }
    Callbackqueue.findOneAndUpdate({
      _id: id
    }, data, (err, ret) => {
      if (err) return reject(err);
      resolve();
    })
  })
}