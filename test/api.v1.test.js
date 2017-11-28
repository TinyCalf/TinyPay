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
    it("name:rbtc,to:正常地址,amount:正常数量 应返回交易单信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"rbtc",
          "to":rbtcAddr,
          "amount":config.currencies.rbtc.outcomeLimit*0.9
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.equal(0)
          expect(res.body.msg).to.be.a('string')
          done()
      })
    });
    it("name:rbtc,to:正常地址,amount:大于提币上限 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"rbtc",
          "to":rbtcAddr,
          "amount":config.currencies.rbtc.outcomeLimit+1
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
    it("name:rbtc,to:正常地址,amount:小于最小下限 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"rbtc",
          "to":rbtcAddr,
          "amount":config.currencies.rbtc.incomeLimit*0.9
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
    it("name:rbtc,to:正常地址,amount:非正常浮点数 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"rbtc",
          "to":rbtcAddr,
          "amount":"0.15891871165415645646797"
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          console.log(res.body.msg)
          expect(res.body.msg).to.equal('Invalid amount')
          done()
      })
    });
    it("name:rbtc,to:错误地址,amount:正常数量 应返回错误信息", (done)=>{
      request
        .post('/v1/sendtransaction')
        .set('Accept', 'application/json')
        .send({
          "name":"rbtc",
          "to":"4945dfsadjfoafdaks",
          "amount":config.currencies.rbtc.outcomeLimit*0.9
        })
        .expect(200)
        .end((err, res) => {
          if(err) return done(err)
          expect(res.body.err).to.not.equal(0)
          expect(res.body.msg).to.be.a('string')
          console.log(res.body.msg )
          expect(res.body.msg).to.equal('Invalid Bitcoin address')
          done()
      })
    });
  });
  //
  // after( (done) => {
  //   done()
  //   setTimeout(function(){
  //     //生成报告
  //     var open = require("open");
  //     open("./mochawesome-report/mochawesome.html");
  //   },2000)
  // })
})

describe('Transaction Dealer 新增交易消息处理队列', function() {
  var BitcoinSeriesTxsDealer = require('../BitcoinSeries/TransactionDealer')
  var EthereumSeriesTxsDealer = require('../EthereumSeries/TransactionDealer')
  var btcrpc = require("../BitcoinSeries/RPCMethods")
  var zmq = require('zmq')
    , sock = zmq.socket('pull');

  this.timeout(1000*5*60); // 5min
  before( (done) => {
      //开启zmq客户端
    setTimeout( ()=>{

      done()
    },4000)
  })
  it('产生RBTC交易，生成6个区块，应收到正确的消息', function(done) {
    //启动比特币系列消息队列
    BitcoinSeriesTxsDealer.start()
    .catch ( (err)=>log.err(err) )
    //上面已经产生了RBTC交易，只需产生6个区块 TODO:6从config中提取
    btcrpc.generate("rbtc",6)
    .then(ret=>{
      //正听是否收到消息
      sock.connect('tcp://127.0.0.1:1999');
      sock.on('message', function(message) {
        message = message.toString();
        message = JSON.parse(message)
        if(message.name=="rbtc"){
          console.log(message)
          expect(message.category).to.equal('receive')
          expect(message.confirmations).to.be.above(5)
          sock.disconnect('tcp://127.0.0.1:1999')
          done()
        }
      });
    })
    .catch(err=>{
      return done(err)
    })
  });
  it('产生ETC交易，生成6个区块，应收到正确的消息', function(done) {
    /*
    启动以太放系列消息队列
    */
    EthereumSeriesTxsDealer.start()
    .then( ()=>{
      //上面已经产生了ETC交易，只需产生6个区块 TODO:6从config中提取
      sock.connect('tcp://127.0.0.1:1999');
      sock.on('message', function(message) {
        message = message.toString();
        message = JSON.parse(message)
        if(message.name=="etc"){
          console.log(message)
          expect(message.category).to.equal('receive')
          //TODO 需要判断确认数
          sock.disconnect('tcp://127.0.0.1:1999')
          done()
        }
      });
    })
    .catch ( (err)=>log.err(err) )
  });
  after( (done) => {
    done()
    setTimeout(function(){
      //生成报告
      var open = require("open");
      open("./mochawesome-report/mochawesome.html");
    },2000)
  })
})
