const mongoose = require("mongoose");
const host = require("./Config").mongodb.host;
mongoose.connect(host, {useMongoClient:true});
exports.mongoose = mongoose
