/*
币种信息
*/
const mongoose = require("mongoose");

var CurrencySchema = new mongoose.Schema({
  name:           {type:String, required:true, unique:true},
  lastCheckedHeight:  {type:Number, required:true, default:0 },
});

module.exports = mongoose.model("Currency", CurrencySchema);
