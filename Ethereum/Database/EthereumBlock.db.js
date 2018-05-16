const dbconnect = require("../../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  number:           {type:String, required:true,  unique:true},
  hash:             {type:String, required:true,  unique:true},
  txids:            {type:Array,   default:[]}
});

var EthereumBlock = mongoose.model("EthereumBlock", schema)

/*export model*/
exports.model = EthereumBlock

/*Add a new block. If total number of lines is above 10000, delete the first line

params
{
 number:1000,
 hash:jfidsahfnsdka,
 txids:[]
}

*/
exports.insert = (params) => {
  return new Promise ( (resolve, reject) => {
    var nBlock = new EthereumBlock()
    nBlock.number = params.number
    nBlock.hash = params.hash
    nBlock.txids = params.txids
    nBlock.save( (err, ret) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

/*
get the highest blocknumber that has been checked by coolpay
(not the blockchain height) TODO:finish this
*/
exports.getCheckedHeight = () => {
  return new Promise ( (resolve, reject) => {
    EthereumBlock.find({},["number"],{
      skip:0,
      limit:1,
      sort:{
          number: -1
      }
    },(err,ret)=>{
    })
  })
}

/*

*/




/*

*/

// exports.findOneByAddress(address)
