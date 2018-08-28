const mongoose = require("./mongoose")

var schema = new mongoose.Schema({
  alias: {
    type: String,
    required: true,
    unique: true
  },
  lastCheckedHeight: {
    type: Number,
    required: true,
    default: 20
  },
});

var Currency = mongoose.model("Ethereum", schema);

exports.model = Currency

/*
init all currency
*/
exports.init = new Function("currencies")

/*
update currency height
*/
exports.updateHeight = new Function("alias", "height")

/*
check currency height
*/
exports.checkHeight = new Function("alias")


this.init = (height) => {
  return new Promise((resolve, reject) => {
    // Currency.collection.insert(currencies, function (err, ret) {
    //   if (err && err.code != 11000) return reject(err)
    //   if (err && err.code == 11000) return resolve(ret)
    //   resolve(ret)
    // })
    let currency = new Currency()
    currency.alias = "ether"
    currency.lastCheckedHeight = height
    currency.save((err, ret) => {
      if (err && err.code != 11000) return reject(err)
      if (err && err.code == 11000) return resolve(ret)
      resolve(ret)
    })
  })
}

this.updateHeight = (alias, height) => {
  return new Promise((resolve, reject) => {
    var data = {
      $set: {
        lastCheckedHeight: height
      }
    }
    Currency.findOneAndUpdate({
      alias: alias
    }, data, (err, ret) => {
      if (err) return reject(err);
      resolve();
    })
  })
}

this.checkHeight = (alias) => {
  return new Promise((resolve, reject) => {
    Currency.findOne({
      alias: alias
    }, (err, ret) => {
      if (err) return reject(err);
      resolve(ret.lastCheckedHeight);
    })
  })
}