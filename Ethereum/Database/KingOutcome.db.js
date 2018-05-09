const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  /*needed when create*/
  transactionHash:         {type:String, required:true, unique:true},
  confirmations:           {type:Number, default:0},
  localSender:             {type:String, required:true}, // address of from
  receivers:               {type:Array,  required:true},// address of to
  values:                  {type:Array, required:true}, // Wei
  amounts:                 {type:Array, required:true}, // 18 demicals
  recordTimestamp:         {type:Number, required:true},
  recordTime:              {type:Date,   required:true},
  /*needed when confirm*/
  success:                 {type:Boolean,required:true,default:false},
  gasUsed:                 {type:Number}, //Wei
  gasPrice:                {type:Number}, //Wei
  etherUsed:               {type:Number}, //Ether
  blockHash:               {type:String},
  blockNumber:             {type:Number},
  blockTimestamp:          {type:Number},
  blockTime:               {type:Date},
});

var KingOutcome = mongoose.model("KingOutcome", schema)

/*export model*/
exports.model = KingOutcome

/*
add records of transactions
{
transactionHash
localSender
receivers
values
amounts
}
*/
exports.appendRecord = new Function("Outcome")

/*
confirmsuccess
{
transactionHash
gasUsed
gasPrice
etherUsed
blockHash
blockNumber
blockTimestamp
}
*/
exports.confirmSuccess = new Function("params")


/*
find unconfirmed transactions
*/
exports.findUnconfirmedTransactions = new Function()

/*
find transaction by hash
*/
exports.findTransactionByHash = new Function("hash")


this.appendRecord = (outcome) => {
  return new Promise( (resolve, reject)=>{
    var nOutcome = new KingOutcome()
    /*needed*/
    nOutcome.transactionHash = outcome.transactionHash
    nOutcome.localSender = outcome.localSender
    nOutcome.receivers = outcome.receivers
    nOutcome.values = outcome.values
    nOutcome.amounts = outcome.amounts
    nOutcome.gasPrice = outcome.gasPrice
    /*culculate*/
    nOutcome.recordTimestamp = Date.now()
    nOutcome.recordTime = Date()
    nOutcome.save( (err, ret) => {
      if (err) return reject(err)
      resolve(ret)
    })
  })
}


this.confirmSuccess = (params) =>{
  return new Promise( (resolve, reject)=>{
    var conditions = {transactionHash : params.transactionHash}
    var update = {$set : {
      success:                true,
      gasUsed:                params.gasUsed,
      etherUsed:              params.etherUsed,
      blockHash:              params.blockHash,
      blockNumber:            params.blockNumber,
      blockTimestamp:         params.blockTimestamp,
      blockTime:              Date(params.blockTimestamp)
    }}
    KingOutcome.update(conditions, update,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}


this.findUnconfirmedTransactions = ()=> {
  return new Promise ( (resolve,reject) => {
    var conditions = {success:false}
    var fields = "-_id -__v"
    KingOutcome.find(conditions, fields , (err,ret)=>{
      if(err) return reject(err)
      resolve(ret)
    })
  })
}

this.findTransactionByHash = (hash) => {
  return new Promise ( (resolve,reject) => {
    var conditions = {transactionHash : hash}
    var fields = "-_id"
    KingOutcome.findOne(conditions, fields , (err,ret)=>{
      if(err) return reject(err)
      resolve(ret)
    })
  })
}
