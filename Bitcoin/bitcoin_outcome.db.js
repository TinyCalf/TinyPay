const dbconnect = require("../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  alias:                   {type:String, required:true, default:"btc"},
  symbol:                  {type:String, required:true, default:"btc"},
  transactionHash:         {type:String, required:true, unique:true},
  confirmations:           {type:Number, required:true, default:0},
  localSender:             {type:String, required:true, default:"main"},
  receiver:                {type:String, required:true},
  amount:                  {type:String, required:true}, // 18 demicals
  success:                 {type:Boolean, required:true, default:false}
});

var Model = mongoose.model("bitcoin_outcome", schema)

/*export model*/
exports.model = Model

this.appendRecord = (outcome) => {
  return new Promise( (resolve, reject)=>{
    if(outcome.length == 0) return resolve()
    Model.collection.insert(outcome, function(err, ret){
      if(err && err.code != 11000) return reject(err)
      if(err && err.code == 11000) return resolve()
      resolve()
    })
  })
}



this.findIncomesNotSuccess = () => {
  return new Promise( (resolve, reject)=>{
    var conditions = {success : false}
    var fields = "-_id"
    Model.find(conditions, fields,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}

this.confirmSuccess = (transactionHash) => {
  return new Promise( (resolve, reject)=>{
    var conditions = {transactionHash : transactionHash}
    var update =
    {
      $set:{
        success:true
      }
    }
    Model.update(conditions, update,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}
