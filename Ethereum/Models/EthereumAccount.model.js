/*
币种信息
*/
const mongoose = require("mongoose");

var EthereumAccount = new mongoose.Schema({
  name:           {type:String, required:true}, // ETH KING PAY ...
  category:       {type:String, required:true}, // ether erc20 erc233 ....
  appid:          {type:String},
  address:        {type:String, required:true},
  prikey:         {type:String, required:true},
  path:           {type:String, required:true},
  mnemonic:       {type:String, required:true}
});

module.exports = mongoose.model("EthereumAccount", EthereumAccount);
