/*
ERC20 账户
*/
const mongoose = require("mongoose")

var ERC20AccountsSchema = new mongoose.Schema({
  address:            {type:String, required:true, unique:true},
  symbol:             {type:String, required:true}
});

module.exports = mongoose.model("ERC20Accounts", ERC20AccountsSchema)
