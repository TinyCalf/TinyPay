const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  alias:                   {type:String, required:true, default:"ether"},
  symbol:                  {type:String, required:true, default:"ether"},
  transactionHash:         {type:String, required:true, unique:true},
  confirmations:           {type:Number, required:true, default:0},
  sender:                  {type:String, required:true}, // address of from
  localReceiver:           {type:String, required:true},// address of to
  blockHash:               {type:String, required:true},
  blockNumber:             {type:Number, required:true},
  value:                   {type:String, required:true}, // Wei
  amount:                  {type:String, required:true}, // 18 demicals
});

var EtherIncome = mongoose.model("EtherIncome", schema)

/*export model*/
exports.model = EtherIncome

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
    EtherIncome.collection.insert(incomes, function(err, ret){
      if(err && err.code != 11000) return reject(err)
      if(err && err.code == 11000) return resolve()
      resolve()
    })
  })
}


this.updateConfirmationByBlockHash = (confirmations, blockHash) =>{
  return new Promise( (resolve, reject)=>{
    var conditions = {blockHash : blockHash}
    var update = {$set : { confirmations : confirmations }}
    EtherIncome.update(conditions, update,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}

this.findIncomesByBlockHash = (blockHash) => {
  return new Promise( (resolve, reject)=>{
    var conditions = {blockHash : blockHash}
    var fields = "-_id"
    EtherIncome.find(conditions, fields,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}
