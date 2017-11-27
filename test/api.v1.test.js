const expect = require('chai').expect
const rebuild = require('../PrivateBlockchain/rebuild')
rebuild.start()
.then(ret=>process.exit())
.catch(ret=>process.exit())

// describe('API v1', function() {
//   var apiv1 = require("../api/v1")
//   var request = require('supertest')(apiv1.app)
//   describe('# /v1/getnewaddress 获取地址接口', function() {
//     it('name=rbtc时应正确返回地址', function(done) {
//       request
//         .get('/v1/getnewaddress?name=rbtc')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .end((err, res) => {
//           if(err) return done(err)
//           expect(res.body.err).to.equal(0)
//           expect(res.body.msg).to.be.a('string')
//           done()
//         })
//     });
//     it('参数为 etc 应正确返回地址', function(done) {
//       request
//         .get('/v1/getnewaddress?name=etc')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .end((err, res) => {
//           if(err) return done(err)
//           expect(res.body.err).to.equal(0)
//           expect(res.body.msg).to.be.a('string')
//           done()
//         })
//     });
//     it('参数为 空 应返回错误', function(done) {
//       request
//         .get('/v1/getnewaddress')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .end((err, res) => {
//           if(err) return done(err)
//           expect(res.body.err).to.not.equal(0)
//           expect(res.body.msg).to.be.a('string')
//           done()
//         })
//     });
//     it('参数为 未知币种 应返回错误', function(done) {
//       request
//         .get('/v1/getnewaddress?name=fuckyou')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .end((err, res) => {
//           if(err) return done(err)
//           expect(res.body.err).to.not.equal(0)
//           expect(res.body.msg).to.be.a('string')
//           done()
//         })
//     });
//   });
//   // describe('# /v1/sendtransaction 发送交易', function() {
//   //   before( done => {
//   //
//   //   })
//   //   it('name=rbtc时应正确返回地址', function(done) {
//   //     request
//   //       .get('/v1/getnewaddress?name=rbtc')
//   //       .set('Accept', 'application/json')
//   //       .expect(200)
//   //       .end((err, res) => {
//   //         if(err) return done(err)
//   //         expect(res.body.err).to.equal(0)
//   //         expect(res.body.msg).to.be.a('string')
//   //         done()
//   //       })
//   //   });
//   //   it('参数为 etc 应正确返回地址', function(done) {
//   //     request
//   //       .get('/v1/getnewaddress?name=etc')
//   //       .set('Accept', 'application/json')
//   //       .expect(200)
//   //       .end((err, res) => {
//   //         if(err) return done(err)
//   //         expect(res.body.err).to.equal(0)
//   //         expect(res.body.msg).to.be.a('string')
//   //         done()
//   //       })
//   //   });
//   //   it('参数为 空 应返回错误', function(done) {
//   //     request
//   //       .get('/v1/getnewaddress')
//   //       .set('Accept', 'application/json')
//   //       .expect(200)
//   //       .end((err, res) => {
//   //         if(err) return done(err)
//   //         expect(res.body.err).to.not.equal(0)
//   //         expect(res.body.msg).to.be.a('string')
//   //         done()
//   //       })
//   //   });
//   //   it('参数为 未知币种 应返回错误', function(done) {
//   //     request
//   //       .get('/v1/getnewaddress?name=fuckyou')
//   //       .set('Accept', 'application/json')
//   //       .expect(200)
//   //       .end((err, res) => {
//   //         if(err) return done(err)
//   //         expect(res.body.err).to.not.equal(0)
//   //         expect(res.body.msg).to.be.a('string')
//   //         done()
//   //       })
//   //   });
//   // });
//   after( () => process.exit() );
// });
