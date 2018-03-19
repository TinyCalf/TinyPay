/*
币种信息
*/
const mongoose = require("mongoose");

var IncomeSchema = new mongoose.Schema({
  name:            {type:String, required:true},
  txid:            {type:String, required:true, unique:true},
  address:         {type:String,required:true},
  amount:          {type:Number, required:true},
  time:            {type:Date, required:true},
});

module.exports = mongoose.model("Income", IncomeSchema);
