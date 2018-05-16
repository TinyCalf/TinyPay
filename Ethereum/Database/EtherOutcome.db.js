const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  /*needed when create*/
  transactionHash:         {type:String, required:true, unique:true},
  confirmations:           {type:Number, default:0},
  localSender:             {type:String, required:true}, // address of from
  receiver:                {type:String,  required:true},// address of to
  value:                   {type:String, required:true}, // Wei
  amount:                  {type:String, required:true}, // 18 demicals
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

var EtherOutcome = mongoose.model("EtherOutcome", schema)

/*export model*/
exports.model = EtherOutcome

/*
add records of transactions
{
transactionHash
localSender
receiver
value
amount
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
    var nOutcome = new EtherOutcome()
    /*needed*/
    nOutcome.transactionHash = outcome.transactionHash
    nOutcome.localSender = outcome.localSender
    nOutcome.receiver = outcome.receiver
    nOutcome.value = outcome.value
    nOutcome.amount = outcome.amount
    nOutcome.gasPrice = outcome.gasPrice
    /*culculate*/
    nOutcome.recordTimestamp = parseInt(Date.now() / 1000)
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
    EtherOutcome.update(conditions, update,function(err, ret){
      if(err) return reject(err)
      resolve(ret)
    });
  })
}


this.findUnconfirmedTransactions = ()=> {
  return new Promise ( (resolve,reject) => {
    var conditions = {success:false}
    var fields = "-_id"
    EtherOutcome.find(conditions, fields , (err,ret)=>{
      if(err) return reject(err)
      resolve(ret)
    })
  })
}

this.findTransactionByHash = (hash) => {
  return new Promise ( (resolve,reject) => {
    var conditions = {transactionHash : hash}
    var fields = "-_id"
    EtherOutcome.findOne(conditions, fields , (err,ret)=>{
      if(err) return reject(err)
      resolve(ret)
    })
  })
}
