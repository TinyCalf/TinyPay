/*
ETC 账户
*/
const mongoose = require("mongoose")

var ETCAccountsSchema = new mongoose.Schema({
  address:            {type:String, required:true, unique:true}
});

module.exports = mongoose.model("ETCAccounts", ETCAccountsSchema)
