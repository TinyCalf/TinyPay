const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/bitgogogo');


//币种信息
var CurrencySchema = new mongoose.Schema({
  currency:           {type:String},
  lastCheckedHeight:  {type:Number},
});

var CurrencyModel = mongoose.model("Currency", CurrencySchema);

module.exports = mongoose.model("Currency", CurrencySchema);







//CURD


/*
增加
*/
