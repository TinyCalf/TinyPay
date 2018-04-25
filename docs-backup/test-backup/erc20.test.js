const expect = require('chai').expect
const config = require("../config").currencies
const erc20 = require("../EthereumSeries/ERC20")
const erc20db = require("../Database/erc20")

describe('EthereumSeries/ERC20', function() {
  this.timeout(5 * 1000); // 5s
  var tokens = []
  if(config.eth && config.eth.erc20){
    tokens = config.eth.erc20;
  } else return;
  describe('# getNewAccount 获取新账户', function() {
    for(var i in tokens) {
      (function(){
        it(tokens[i].symbol + ' 应获取到正确的hash地址并在数据库中保留记录', function(done) {
          erc20.getNewAccount(tokens[i].symbol)
          .then(ret=>{
            expect(ret).to.be.a("string");
            expect(ret.length).to.be.equal(42);
            erc20db.hasAddress(tokens[i].symbol, ret)
            .then(ret=>{
              expect(ret).to.be.equal(true)
              done();
            })
          })
          .catch(err=>{
            throw new Error(err);
          })
        })
      })(i)
    }
  });
})
