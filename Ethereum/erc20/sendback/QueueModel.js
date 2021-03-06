require("../../utils").mongoose
let mongoose = require("mongoose")


const schema = new mongoose.Schema({
  alias:                      {type:String, required:true},
  contractAddress:            {type:String, required:true},
  /*address in which token should be send back to main */
  address:                    {type:String, required:true, unique:true},
  /*if got needed gas to transfer all the tokens out*/
  sentGasStatus:              {type:Number, default:0},
  /*the transaction hash of the needed gas transfer into this address*/
  sentGasTransactionHash:      {type:String, default:""},
  /*if sent back to the main account,0 have not, 1 pending , 2 succeed*/
  sentBackStatus:             {type:Number, default:0},
  sentBackTransactionHash:    {type:String, default:""},
  /*used ether (unit ether)*/
  etherUsed:                  {type:Number, default:0},
  errorLogs:                     {type:Array, default:[]}
});
let Model = mongoose.model("ethereum_erc20_sendbackqueue", schema)

module.exports = class QueueModel {

  constructor(alias, contractAddress) {
    this.alias = alias
    this.contractAddress = contractAddress
  }

  /*add new record*/
  create(address) {
    return new Promise ( (resolve, reject) => {
      var q = new Model()
      q.address = address
      q.contractAddress = this.contractAddress
      q.alias = this.alias
      q.save( (err, ret)=>{
        if (err) return reject(err)
        resolve(ret)
      })
    })
  }

  /*update gotgastranaction*/
  addSentGasTransaction(address, hash) {
    return new Promise ( (resolve, reject) => {
      let conditions = {contractAddress:this.contractAddress,address:address}
      let update = {$set:{
        sentGasTransactionHash:hash,
        sentGasStatus:1
      }}
      Model.update(conditions, update, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  /*confirm has got gas needed*/
  confirmSentGas (sentGasTransactionHash, etherUsed) {
    return new Promise ( (resolve, reject) => {
      let conditions =
      {contractAddress:this.contractAddress,
        sentGasTransactionHash:sentGasTransactionHash}
      let update = { $set:{
        etherUsed: etherUsed,
        sentGasStatus : 2
      }}
      Model.update(conditions, update, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  addSentBackTransaction (address, hash) {
    return new Promise ( (resolve, reject) => {
      let conditions = {contractAddress:this.contractAddress,address:address}
      let update = { $set:{
        sentBackTransactionHash: hash,
        sentBackStatus: 1
      }}
      Model.update(conditions, update, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  confirmSentBack (sentBackTransactionHash) {
    return new Promise ( (resolve, reject) => {
      let conditions =
      {contractAddress:this.contractAddress,
        sentBackTransactionHash:sentBackTransactionHash}
      let update = { $set:{
        sentBackStatus: 2
      }}
      Model.update(conditions, update, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  findOneNoSentGasAddress () {
    return new Promise ( (resolve, reject) => {
      let conditions = {contractAddress:this.contractAddress,sentGasStatus:0}
      let fields = "address"
      Model.findOne(conditions, fields, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  findAllSentGasButNoConfirmedAddress () {
    return new Promise ( (resolve, reject) => {
      let conditions = {contractAddress:this.contractAddress,
        sentGasStatus:1}
      let fields = "address sentGasTransactionHash"
      Model.find(conditions, fields, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  findOneSentGasButNoSentBackAddress () {
    return new Promise ( (resolve, reject) => {
      let conditions = {contractAddress:this.contractAddress,
        sentBackStatus:0,
        sentGasStatus:2}
      let fields = "address"
      Model.findOne(conditions, fields, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  findAllSentBackButNoConfirmedAddress () {
    return new Promise ( (resolve, reject) => {
      let conditions = {contractAddress:this.contractAddress,
        sentBackStatus:1}
      let fields = "address sentBackTransactionHash"
      Model.find(conditions, fields, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

  addErrorLogs (address, msg) {
    return new Promise ( (resolve, reject) => {
      let conditions = {contractAddress:this.contractAddress,address:address}
      let update = { $push:{
        errorLogs: msg
      }}
      Model.update(conditions, update, (err, ret) => {
        if(err) return reject(err)
        resolve(ret)
      })
    })
  }

}
