const mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
const host = require("../config").get().get("mongodb");
console.log(host)
mongoose.connect(host, {
  useMongoClient: true
});
module.exports = mongoose