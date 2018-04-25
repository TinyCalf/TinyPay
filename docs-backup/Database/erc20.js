var db = require("./db")
const ERC20 = require("./Models/ERC20Accounts.model");

/*
增加记录
@param symbol  symbol of token
@param address address of eth account
@return undefined
*/
exports.addAccount = (symbol, address) => {
  return new Promise ( (resolve, reject) => {
    var newAccount = new ERC20();
    newAccount.address = address;
    newAccount.symbol = symbol;
    newAccount.save( (err,ret) => {
      if(err) return reject(err)
      resolve()
    });
  });
}
/*TEST*/
// this.addAccount("TCC","fdasdfsdfadsa")
// .then(console.log)
// .catch(console.err)


/*
查询某地址是否存在
@param symbol  symbol of token
@param address address of eth account
@return true | false
*/
exports.hasAddress = (symbol, address) => {
  return new Promise ( (resolve, reject) => {
    ERC20.findOne({address:address,symbol:symbol}).exec((err,ret) => {
      if(err) return reject(err);
      (ret) ? resolve(true) : resolve(false) ;
    });
  });
}
/*TEST*/
// this.hasAddress("TCC","fdasdfsdfadsa")
// .then(console.log)
// .catch(console.err)
