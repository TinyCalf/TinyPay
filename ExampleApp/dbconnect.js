const mongoose = require("mongoose")
mongoose.Promise = require('bluebird')
const config = require("./config.json")
const host = config.mongodb
mongoose.connect(host, {
  useMongoClient: true
});
exports.mongoose = mongoose