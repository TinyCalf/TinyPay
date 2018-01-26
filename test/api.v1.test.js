const expect = require('chai').expect
// const rebuild = require('../PrivateBlockchain/rebuild')
const config = require("../config")


describe('API v1', function() {
  var apiv1 = require("../api/v1")
  var request = require('supertest')(apiv1.app)
  this.timeout(1000*5*60); // 5min
  var etcAddr = "" //保留etc地址，用于后续测试
  var rbtcAddr = "" //保留rbtc地址

  //把所有注册的币中包括ERC20的名称退入数组allCurr
  var currencies = config.currencies;
  var allCurr = [];
  for(var key in currencies) {
    allCurr.push({
      name:key,
    })
  }
  if(currencies.eth && currencies.eth.erc20){
    for(var key in currencies.eth.erc20) {
      allCurr.push({
        name:currencies.eth.erc20[key].symbol,
      })
    }
  }
  describe('# /v1/getnewaddress 获取地址接口', function() {
    for(var key in allCurr) {
      (function(key) {
        var nname = allCurr[key].name;
        it('参数为 name:' + nname +' 时应正确返回地址', function(done) {
          request
            .get('/v1/getnewaddress?name=' + nname)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
              if(err) return done(err)
              expect(res.body.err).to.equal(0)
              expect(res.body.msg).to.be.a('string')
              rbtcAddr=res.body.msg
              done()
            })
        });
      })(key)
    }
    it('参数为 空 应返回错误', function(done) {
      request
        .get('/v1/getnewaddress')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          expect(res.body.msg).to.equal('NO_SUCH_CURRENCY_CONFIGURED')
          done()
        })
    });
    it('参数为 未知币种 应返回错误', function(done) {
      request
        .get('/v1/getnewaddress?name=fuckyou')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          expect(res.body.msg).to.equal('NO_SUCH_CURRENCY_CONFIGURED')
          done()
        })
    });
  })
  describe('# /v1/getinfo 获取主钱包地址', function() {
    it('应返回所有注册币种的主钱包信息', function(done) {
      request
        .get('/v1/getinfo')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          console.log(res.body)
          done()
        })
    });
  })
})
