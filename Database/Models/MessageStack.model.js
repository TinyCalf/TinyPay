/*
币种信息
*/
const mongoose = require("mongoose");

var MessageStackSchema = new mongoose.Schema({
  txid:           {type:String, required:true, unique:true},
  msg:            {type:String, required:true },
});

module.exports = mongoose.model("MessageStack", MessageStackSchema);
