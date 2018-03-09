const expect = require('chai').expect
const MessageStack = require('../Database/MessageStack')

describe('Database/MessageStack 消息栈数据库操作', function() {
  this.timeout(5 * 1000); // 5s
  var txid1=Math.ceil(Math.random()*100000).toString()
  var txid2=Math.ceil(Math.random()*100000).toString()
  describe('# push 推入新信息', function() {
    it('插入新txid的信息时应该增加新条目', function(done) {
      MessageStack.push(
        "test"+txid1,
        JSON.stringify({txid:txid1}))
      .then(ret=>{
        expect(ret).to.be.a("string");
        expect(ret).to.be.equal("ADDED");
        console.log(ret)
        done();
      })
      .catch(err=>{
        expect(err).to.be.equal(0);
        done();
      })
    })
    it('插入新txid的信息时应该增加新条目', function(done) {
      MessageStack.push(
        "test"+txid2,
        JSON.stringify({txid:txid2}))
      .then(ret=>{
        expect(ret).to.be.a("string");
        expect(ret).to.be.equal("ADDED");
        console.log(ret)
        done();
      })
      .catch(err=>{
        expect(err).to.be.equal(0);
        done();
      })
    })
    it('插入已存在txid的信息时应该覆盖', function(done) {
      MessageStack.push(
        "test"+txid1,
        JSON.stringify({txid:txid1}))
      .then(ret=>{
        expect(ret).to.be.a("string");
        expect(ret).to.be.equal("UPDATED");
        console.log(ret)
        done();
      })
      .catch(err=>{
        expect(err).to.be.equal(0);
        done();
      })
    })
  });
  describe('# deleteByTxids 批量删除信息', function() {
    it('消息都合法应返回已删除', function(done) {
      MessageStack.deleteByTxids([txid1,txid2])
      .then(ret=>{
        console.log(ret)
        expect(ret).to.be.a("string");
        expect(ret).to.be.equal("DELETED");
        done();
      })
      .catch(err=>{
        console.log(ret)
        expect(err).to.be.equal(0);
        done();
      })
    })
    it('消息有不合法的应该返回已删除', function(done) {
      MessageStack.deleteByTxids([txid1,txid2,"dfdsafdsa"])
      .then(ret=>{
        console.log(ret)
        expect(ret).to.be.a("string");
        expect(ret).to.be.equal("DELETED");
        done();
      })
      .catch(err=>{
        console.log(err)
        expect(err).to.be.equal(0);
        done();
      })
    })
  });
  describe('# pull 拉取所有信息', function() {
    it('应返回所有消息', function(done) {
      MessageStack.pull()
      .then(ret=>{
        console.log(ret)
        expect(ret).to.be.a("array");
        done();
      })
      .catch(err=>{
        console.log(ret)
        expect(err).to.be.equal(0);
        done();
      })
    })
  });
})
