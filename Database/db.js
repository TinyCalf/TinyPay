const mongoose = require("mongoose");
const host = require("../config.js").db.host;
mongoose.connect(host, {useMongoClient:true});
//这里加useMongoClient这个参数是为了防止mongoose一个bug导致的warn，详见
//https://github.com/Automattic/mongoose/issues/5399
var log = require('../Logs/log.js')("db")

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
      if(err) return reject(err);
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
      if(err) return reject(err);
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
      if(err) return reject(err);
      resolve(ret);
    })
  });
}

/*
创建新币 如果创建过了不要返回错误
*/
exports.createNewCurrency = (name, height) => {
  return new Promise ( (resolve, reject) => {
    this.checkCurrencyByName(name)
    .then(ret=>{
      if(ret) {
        log.info(name + " has been created! nothing done.")
        resolve()
        return;
      }
      //创建新币种
      var newcurr = new Currency();
      newcurr.name = name;
      newcurr.lastCheckedHeight = height;
      newcurr.save((err,ret)=>{
        if(err) return reject(err);
        resolve();
      })
    })
    .catch(err=>{reject(err)})
  });
}

/*
初始化某币种的数据库
*/
exports.initCurrencyDB = ( name ,callback) => {
  //判断是否已经创建该币种
  var promiseFindOutIfExisted = new Promise((resolve, reject) => {
    Currency.findOne({name:name}).exec((err,ret) => {
      if(err || ret) return reject(err);
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

/*
删除某币的数据库
*/
exports.delCurrency = (name) => {
  return new Promise( (resolve, reject) => {
    var conditions = {name:name}
    Currency.remove(conditions, (err) => {
      if(err) return reject(err)
      resolve("deleted!")
    })
  })
}

/*******************************************************************************

以太坊系列账户相关 ETH | ETC  ETHAccounts ETCAccounts

以太坊系列的货币账户地址都用独立的collection保存

********************************************************************************/
const ETHAccounts = require("./Models/ETHAccounts.model");
const ETCAccounts = require("./Models/ETCAccounts.model");
/*
增加以太坊账户
name,address=>null
"eth","0xlldlsafdhjsaa"=>null
*/
exports.addAccountOfEthereumSeries = (name, address) => {
  return new Promise ( (resolve, reject) => {
    var Nmodel = null
    switch (name) {
      case "eth": {Nmodel=ETHAccounts;break;}
      case "etc": {Nmodel=ETCAccounts;break;}
      default: return reject("invalid currency name!")
    }
    var newAccount = new Nmodel();
    newAccount.address = address;
    newAccount.save( (err,ret) => {
      if(err) return reject(err)
      resolve()
    });
  });
}

/*
查询某地址是否已经记录
name(币种名称)，address=>
null | {...}
*/
exports.checkHasAddress = (name, address) => {
  return new Promise ( (resolve, reject) => {
    var Nmodel = null
    switch (name) {
      case "eth": {Nmodel = ETHAccounts;break;}
      case "etc": {Nmodel = ETCAccounts;break;}
      default: return reject("invalid currency name!")
    }
    Nmodel.findOne({address:address}).exec((err,ret) => {
      if(err) return reject(err);
      resolve(ret);
    });
  });
}

/*
清空ETC的accounts数据表，该方法目前仅可应用于测试环境
*/
exports.clearETCAccounts = () => {
  return new Promise( (resolve, reject) => {
    var conditions = {}
    ETCAccounts.remove(conditions, (err) => {
      if(err) return reject(err)
      resolve("deleted!")
    })
  })
}

/*******************************************************************************

log 数据库

********************************************************************************/

const Income = require("./Models/Income.model");
const Outcome = require("./Models/Outcome.model");


/*
增加充值记录
该方法不返回错误信息
*/
exports.addIncomeLog = (name, txid, from, to, amount) => {
  return new Promise ( (resolve, reject) => {
      //创建新币种
      var income = new Income();
      income.name = name;
      income.txid = txid;
      income.to = to;
      income.from = from;
      income.amount = amount;
      income.time = new Date();
      income.save((err,ret)=>{
        resolve();
      })
  });
}

/*
增加充值记录
该方法不返回错误信息
*/
exports.addOutcomeLog = (name, txid, from, to, amount) => {
  return new Promise ( (resolve, reject) => {
      //创建新币种
      var income = new Income();
      income.name = name;
      income.txid = txid;
      income.to = to;
      income.from = from;
      income.amount = amount;
      income.time = new Date();
      income.save((err,ret)=>{
        resolve();
      })
  });
}
