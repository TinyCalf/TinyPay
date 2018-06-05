const dbconnect = require("../dbconnect")
mongoose = require("mongoose")

var schema = new mongoose.Schema({
  alias:              {type:String, required:true, default:"btc", unique:true},
  lastCheckedHeight:  {type:Number, required:true, default:20},
});


let Model = mongoose.model("bitcoin_height", schema)

exports.model = Model

exports.checkHeight = () => {
  return new Promise ( (resolve, reject)=>{
    Model.findOne({alias:"btc"},(err, ret)=>{
      if(err) return reject(err)
      resolve(ret)
    })
  })
}

exports.updateHeight = (height) => {
  return new Promise ( (resolve, reject)=>{
    this.checkHeight()
    .then(ret=>{
      if(!ret)
        Model.collection.insert({lastCheckedHeight:height,alias:"btc"}, (err, ret)=>{
          if(err) return reject(err);
          return resolve()
        })
      else if(ret.lastCheckedHeight < height)
        Model.findOneAndUpdate({alias:"btc"}, {
              $set:{
                lastCheckedHeight:height
              }
            }, (err,ret)=>{
          if(err) return reject(err);
          return resolve();
        })
      else resolve()
    })
  })
}
