/*
币种信息
*/
const mongoose = require("mongoose");

var OutcomeSchema = new mongoose.Schema({
  name:            {type:String, required:true},
  txid:            {type:String, required:true,unique:true},
  to:              {type:String},
  from:            {type:String, required:true},
  amount:          {type:Number, required:true},
  time:            {type:Date, required:true},
  remarks:         {type:String, required:false},
});

module.exports = mongoose.model("Outcome", OutcomeSchema);
