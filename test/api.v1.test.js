const expect = require('chai').expect
const rebuild = require('../PrivateBlockchain/rebuild')
const config = require("../config")


describe('API v1', function() {
  var apiv1 = require("../api/v1")
  var request = require('supertest')(apiv1.app)
  this.timeout(1000*5*60); // 5min
  var etcAddr = "" //保留etc地址，用于后续测试
  var rbtcAddr = "" //保留rbtc地址
  // before( (done) => {
  //   //先重建所有区块链
  //   rebuild.start()
  //   .then( ()=>{
  //       //留出时间来挖矿，主要是给eth,etc
  //       console.log("给以太坊留出2min挖矿")
  //       setTimeout(done,1000*2*60)
  //   })
  //   .catch( err=> {new Error(err)} )
  // })
  describe('# /v1/getnewaddress 获取地址接口', function() {
    it('参数为 name:rbtc 时应正确返回地址', function(done) {
      request
        .get('/v1/getnewaddress?name=rbtc')
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
    it('参数为 name:etc 应正确返回地址', function(done) {
      request
        .get('/v1/getnewaddress?name=etc')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.equal(0)
          expect(res.body.msg).to.be.a('string')
          etcAddr=res.body.msg
          done()
        })
    });
    it('参数为 空 应返回错误', function(done) {
      request
        .get('/v1/getnewaddress')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          expect(res.body.msg).to.equal('no such currency configured!')
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
          expect(res.body.msg).to.equal('no such currency configured!')
          done()
        })
    });
  });
  describe('# /v1/sendtransaction 发送交易', function() {
    it("name:ETC,to:正常地址,amount:正常数量 应返回交易单信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"etc",
          "to":etcAddr,
          "amount":config.currencies.etc.outcomeLimit*0.9
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.equal(0)
          expect(res.body.msg).to.be.a('string')
          done()
      })
    });
    it("name:ETC,to:正常地址,amount:大于提币上限 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"etc",
          "to":etcAddr,
          "amount":config.currencies.etc.outcomeLimit+1
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          expect(res.body.msg).to.equal('amout out of limit!')
          done()
      })
    });
    it("name:ETC,to:正常地址,amount:小于最小下限 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"etc",
          "to":etcAddr,
          "amount":config.currencies.etc.incomeLimit*0.9
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          expect(res.body.msg).to.equal('amout less than limit')
          done()
      })
    });
    it("name:ETC,to:正常地址,amount:非正常浮点数 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"etc",
          "to":etcAddr,
          "amount":"1.15891871165415645646797"
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          expect(res.body.msg).to.equal('Error: Unable to parse number')
          done()
      })
    });
    it("name:ETC,to:错误地址,amount:正常数量 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"etc",
          "to":"4945dfsadjfoafdaks",
          "amount":config.currencies.etc.outcomeLimit*0.9
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          expect(res.body.msg).to.equal('invalid address')
          done()
      })
    });
  });
  after( (done) => {
    done()
    setTimeout(function(){
      process.exit()
    },3000)
  })
})
