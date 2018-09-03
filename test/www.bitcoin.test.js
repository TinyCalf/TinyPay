const assert = require("assert")
let api = require("../www/index.js")
let request = require("supertest")(api.app)

let user = {}

describe('Bitcoin', function () {

  this.timeout(1000 * 5 * 60)

  before(done => {
    setTimeout(done, 1000)
  })

  describe("# bitcoin/getnewaccount", () => {
    it(`should get new account correctly`, done => {
      request
        .get('/bitcoin/getnewaccount')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          user.address = result.msg
          assert(result.err == 0)
          assert(typeof result.msg == "string")
          done()
        })
    })
  })

  describe("# bitcoin/withdraw", () => {
    it(`should launch withdraw correctly`, done => {
      request
        .post('/bitcoin/withdraw')
        .send({
          address: user.address,
          amount: "0.0001"
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          assert(result.err == 0)
          done()
        })
    })
  })

  describe("# bitcoin/getbalance", () => {
    it(`should get correct balance of address`, done => {
      request
        .post('/bitcoin/getbalance')
        .send({
          address: user.address,
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          assert(result.err == 0)
          done()
        })
    })
  })

  describe("# bitcoin/getbalance", () => {
    it(`should get correct balance of address`, done => {
      request
        .post('/bitcoin/getbalance')
        .send({
          address: "",
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          assert(result.err == 0)
          done()
        })
    })
  })

})