const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  alias:                   {type:String, required:true},
  symbol:                  {type:String, required:true,},
  transactionHash:         {type:String, required:true, unique:true},
  confirmations:           {type:Number, required:true, default:0},
  localSender:             {type:String, required:true}, // address of from
  receiver:                {type:String, required:true},// address of to
  blockHash:               {type:String, required:true},
  blockNumber:             {type:Number, required:true},
  value:                   {type:String, required:true}, // Wei
  amount:                  {type:String, required:true}, // 18 demicals
  success:                 {type:Boolean,required:true,default:false}
});

var ERC20Outcome = mongoose.model("ERC20Outcome", schema)

/*export model*/
exports.model = ERC20Outcome

/*
add records of transactions
*/
exports.appendRecords = new Function("transactions")

/*
update success
*/
exports.confirmSuccess = new Function("transactionHash")
//
// exports.findIncomesByBlockHash = new Function("blockHash")


this.appendRecords = (outcomes) => {
  return new Promise( (resolve, reject)=>{
    if(outcomes.length == 0) return resolve()
    ERC20Outcome.collection.insert(outcomes, function(err, ret){
      if(err && err.code != 11000) return reject(err)
      if(err && err.code == 11000) return resolve()
      resolve()
    })
  })
}

//
// this.updateConfirmationByBlockHash = (confirmations, blockHash, alias) =>{
//   return new Promise( (resolve, reject)=>{
//     var conditions = {blockHash : blockHash, alias:alias}
//     var update = {$set : { confirmations : confirmations }}
//     ERC20Income.update(conditions, update,function(err, ret){
//       if(err) return reject(err)
//       resolve(ret)
//     });
//   })
// }
//
// this.findIncomesByBlockHash = (blockHash, alias) => {
//   return new Promise( (resolve, reject)=>{
//     var conditions = {blockHash : blockHash, alias:alias}
//     var fields = "-_id"
//     ERC20Income.find(conditions, fields,function(err, ret){
//       if(err) return reject(err)
//       resolve(ret)
//     });
//   })
// }
