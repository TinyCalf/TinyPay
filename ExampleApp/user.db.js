const dbconnect = require("./dbconnect")
mongoose = require("mongoose")

let schema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  md5pass: {
    type: String,
    require: true
  },
  eth_balance: {
    type: String,
    required: true,
    default: 0
  },
  btc_balance: {
    type: String,
    required: true,
    default: 0
  },
  token: {
    type: String,
    default: null
  }
})

module.exports = mongoose.model("User", schema)