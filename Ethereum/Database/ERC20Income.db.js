const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  alias:                   {type:String, required:true},
  symbol:                  {type:String, required:true,},
  transactionHash:         {type:String, required:true, unique:true},
  conformations:           {type:Number, required:true, default:0},
  sender:                  {type:String, required:true}, // address of from
  localReceiver:           {type:String, required:true},// address of to
  blockHash:               {type:String, required:true},
  blockNumber:             {type:Number, required:true},
  value:                   {type:String, required:true}, // Wei
  amount:                  {type:String, required:true}, // 18 demicals
});

var ERC20Income = mongoose.model("ERC20Income", schema)

/*export model*/
exports.model = ERC20Income

/*
add records of transactions
*/
exports.appendRecords = new Function("transactions")


this.appendRecords = (incomes) => {
  return new Promise( (resolve, reject)=>{
    ERC20Income.collection.insert(incomes, function(err, ret){
      if(err && err.code != 11000) return reject(err)
      if(err && err.code == 11000) return resolve()
      resolve()
    })
  })
}
