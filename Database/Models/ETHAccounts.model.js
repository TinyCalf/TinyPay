/*
ETH 账户
*/
const mongoose = require("mongoose")

var ETHAccountsSchema = new mongoose.Schema({
  address:            {type:String, required:true, unique:true}
});

module.exports = mongoose.model("ETHAccounts", ETHAccountsSchema)
