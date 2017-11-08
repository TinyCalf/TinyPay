const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/bitgogogo');

/*******************************************************************************

货币模块 Currency

********************************************************************************/
const Currency = require("./Models/Currency.model");

/*
更新某币种的已记录高度
*/
exports.updateCheckedHeight = (name, height) => {
  return new Promise ( (resolve, reject) => {
    var data = {
      $set:{
        lastCheckedHeight:height
      }
    }
    Currency.findOneAndUpdate({name:name}, data, (err,ret)=>{
      if(err) reject(err);
      resolve();
    })
  });
}

/*
查询某币种已记录高度
*/
exports.getCheckedHeight = (name) => {
  return new Promise ( (resolve, reject) => {
    Currency.findOne({name:name}, (err,ret)=>{
      if(err) reject(err);
      resolve(ret.lastCheckedHeight);
    })
  });
}

/*
查询某币信息
*/
exports.checkCurrencyByName = (name) => {
  return new Promise ( (resolve, reject) => {
    Currency.findOne({name:name}, (err,ret)=>{
      if(err) reject(err);
      resolve(ret);
    })
  });
}

/*
创建新币
*/
exports.createNewCurrency = (name) => {
  return new Promise ( (resolve, reject) => {
    var newcurr = new Currency();
    newcurr.name = name;
    newcurr.save((err,ret)=>{
      if(err) reject(err);
      resolve(ret);
    })
  });
}









/*
初始化币种数据库
*/
// var currencies = ['btc','ltc','bcc'];
// exports.initCurrenciesDB = ( callback ) => {
//   var errors = [];
//   var processcount = 0;
//   for(var i = 0 ; i < currencies.length ; i++) {
//     var nowcurr = currencies[i];
//     //判断是否已经创建该币种
//     var promiseFindOutIfExisted = new Promise((resolve, reject) => {
//       processcount ++;
//       Currency.findOne({name:'btc'}).exec((err,ret) => {
//         if(err || ret) reject(err);
//         resolve();
//       });
//     })
//     //未创建则重新创建
//     .then( () => {
//       var newCurr = new Currency();
//       newCurr.name = nowcurr;
//       newCurr.save( (err,ret) => {
//         if(err) errors.push(err);
//         if(processcount >= currencies.length)
//         callback(errors, null);
//       });
//     })
//   }
// }

/*
初始化某币种的数据库
*/
exports.initCurrencyDB = ( name ,callback) => {
  //判断是否已经创建该币种
  var promiseFindOutIfExisted = new Promise((resolve, reject) => {
    Currency.findOne({name:name}).exec((err,ret) => {
      if(err || ret) reject(err);
      resolve();
    });
  })
  //未创建则重新创建
  .then( () => {
    var newCurr = new Currency();
    newCurr.name = name;
    newCurr.save( (err,ret) => {
      callback(err, ret);
    });
  })
  .catch ( (reason)=>{
      callback(reason, reason);
  })
}

//this.initCurrencyDB( 'ltc' , (err,ret)=> {console.log(err,ret)})


// this.initCurrenciesDB((err,ret)=> {console.log(err);})



// var btc = new Currency();
// btc.name = 'btc';
// btc.lastCheckedHeight = 0;
//
// btc.save( (err,ret) => {
//   if(err) console.log(err);
//   console.log(ret);
// } );


// Currency.find({}).exec((err,ret) => {
//   if(err) console.log(err);
//   console.log(ret);
// })

// Currency.findOne({name:'btc'}).exec((err,ret) => {
//   if(err) console.log(err);
//   console.log(ret);
// })
