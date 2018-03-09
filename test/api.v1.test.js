const expect = require('chai').expect
// const rebuild = require('../PrivateBlockchain/rebuild')
const config = require("../config")


describe('API v1', function() {
  var apiv1 = require("../api/v1")
  var request = require('supertest')(apiv1.app)
  this.timeout(1000*5); // 5min
  var etcAddr = "" //保留etc地址，用于后续测试
  var rbtcAddr = "" //保留rbtc地址

  //把所有注册的币中包括ERC20的名称退入数组allCurr
  var currencies = config.currencies;
  var allCurr = [];
  for(var key in currencies) {
    allCurr.push({
      name:key,
      coldwallet:currencies[key].coldwallet
    })
  }
  if(currencies.eth && currencies.eth.erc20){
    for(var key in currencies.eth.erc20) {
      allCurr.push({
        name:currencies.eth.erc20[key].symbol,
        coldwallet:currencies.eth.coldwallet
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
              console.log(res.body)
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
          console.log(res.body)
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
          console.log(res.body)
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
  describe('# /v1/sendtransaction 发起提现交易', function() {
    for(var key in allCurr) {
      (function(key) {
        var name = allCurr[key].name;
        var coldwallet = allCurr[key].coldwallet;
        //构成一个8位随机小数
        var random = function(){
          var num = Math.ceil(Math.random()*1000)%10
          num = num.toString()+ "."
          for(var i = 0 ; i < 8 ; i ++)
            num += (Math.ceil(Math.random()*1000)%10).toString()
          return num
        }
        var ran = random()
        it('应该成功发送' + ran + name +'交易并返回交易hash值 ', function(done) {
          request
            .post('/v1/sendtransaction')
            .send({
              name: name,
              to: coldwallet,
              amount: ran,
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
              console.log(res.body)
              if(err) return done(err)
              expect(res.body.err).to.equal(0)
              expect(res.body.msg).to.be.a('string')
              done()
            })
        });
      })(key)
    }
  })
  describe('# /v1/pulltxs 从消息队列获取所有充值交易', function() {
    it('应返回充值交易数组', function(done) {
      request
        .get('/v1/pulltxs')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          console.log(res.body)
          expect(res.body.err).to.be.equal(0)
          expect(res.body.msg).to.be.a("array")
          done()
        })
    });
  })
  describe('# /v1/confirmtxs 确认交易处理完成', function() {
    it('参数正确应返回充值交易数组', function(done) {
      request
        .post('/v1/confirmtxs')
        .send(
          {
            txids:[
              "test57896",
              "test30600"
            ]
          }
        )
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          console.log(res.body)
          expect(res.body.err).to.be.equal(0)
          expect(res.body.msg).to.be.equal("DELETED")
          done()
        })
    });
    it('参数名不正确时应返回错误', function(done) {
      request
        .post('/v1/confirmtxs')
        .send(
          {
            txifds:[
              "test57896",
              "test30600"
            ]
          }
        )
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          console.log(res.body)
          expect(res.body.err).to.be.not.equal(0)
          done()
        })
    });
    it('参数不是数组时应返回错误', function(done) {
      request
        .post('/v1/confirmtxs')
        .send(
          {
            txids:[
              {fdsafd:120321}
            ]
          }
        )
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          console.log(res.body)
          expect(res.body.err).to.be.not.equal(0)
          done()
        })
    });
  })
})
