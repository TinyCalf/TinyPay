var db = require("./db")
const Stack = require("./Models/MessageStack.model");


checkByTxid = (txid) => {
  return new Promise ( (resolve, reject) => {
    Stack.findOne({txid:txid}).exec((err,ret) => {
      if(err) return reject(err);
      (ret) ? resolve(true) : resolve(false) ;
    });
  });
}


/*
push一条新信息，如果txid已存在，则更新，不存在则插入
@param txid  symbol of token
@param msg address of eth account
@return null
*/
exports.push = (txid, msg) => {
  return new Promise ( (resolve, reject) => {
    checkByTxid(txid)
    .then((ret)=>{
      if(ret){
        //存在，更新
        var data = {
          $set:{
            msg:msg
          }
        }
        Stack.findOneAndUpdate({txid:txid}, data, (err,ret)=>{
          if(err) return reject(err);
          resolve("UPDATED");
        })
      }
      else{
        //不存在，添加
        var newmsg = new Stack();
        newmsg.txid = txid;
        newmsg.msg = msg;
        newmsg.save( (err,ret) => {
          if(err) return reject(err)
          resolve("ADDED")
        });
      }
    })
    .catch(err=>reject(err))
  });
}

/*
标记为已删除
@param txids array txid数组
@param msg address of eth account
@return null
*/
exports.deleteByTxids = (txids) => {
  return new Promise ( (resolve, reject) => {
    var data = {
      $set:{
        solved:true
      }
    }
    Stack.update({ txid: { $in: txids } }, data, (err,ret)=>{
      if(err) return reject(err)
      return resolve("DELETED")
    })
  });
}
/*
查询所有消息栈记录
@return array
*/
exports.pull = () => {
  return new Promise ( (resolve, reject) => {
    Stack.find({solved:false}, "-_id msg", (err, ret) => {
      if(err) return reject(err)
      var data = []
      for (var key in ret){
        data.push(JSON.parse(ret[key].msg))
      }
      return resolve(data)
    })
  })
}
