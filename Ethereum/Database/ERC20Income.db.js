const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  alias:                   {type:String, required:true},
  symbol:                  {type:String, required:true,},
  transactionHash:         {type:String, required:true, unique:true},
  confirmations:           {type:Number, required:true, default:0},
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

/*
update confirmations of transactions at hash block
*/
exports.updateConfirmationByBlockHash = new Function("confirmations","blockHash")

exports.findIncomesByBlockHash = new Function("blockHash")


this.appendRecords = (incomes) => {
  return new Promise( (resolve, reject)=>{
    if(incomes.length == 0) return resolve()
    ERC20Income.collection.insert(incomes, function(err, ret){
      if(err && err.code != 11000) return reject(err)
      if(err && err.code == 11000) return resolve()
      resolve()
    })
  })
}


this.updateConfirmationByBlockHash = (confirmations, blockHash, alias) =>{
  return new Promise( (resolve, reject)=>{
    var conditions = {blockHash : blockHash, alias:alias}
    var update = {$set : { confirmations : confirmations }}
    ERC20Income.update(conditions, update,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}

this.findIncomesByBlockHash = (blockHash, alias) => {
  return new Promise( (resolve, reject)=>{
    var conditions = {blockHash : blockHash, alias:alias}
    var fields = "-_id"
    ERC20Income.find(conditions, fields,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}
