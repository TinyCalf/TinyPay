const mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
const host = require("./Config").mongodb.host;
mongoose.connect(host, {useMongoClient:true});
exports.mongoose = mongoose
