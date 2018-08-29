const assert = require("assert")
let api = require("../www/index.js")
let request = require("supertest")(api.app)

let user1 = {}

describe('Ether', function () {

  this.timeout(1000 * 5 * 60)

  before(done => {
    setTimeout(done, 1000)
  })

  describe("# ether/getnewaccount", function () {
    it(`should get new account correctly`, done => {
      request
        .get('/ether/getnewaccount')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          assert(typeof result.msg.address === 'string',
            `expect address to be a string`)
          assert(typeof result.msg.prikey === 'string',
            `expect address to be a string`)
          user1 = result.msg
          done()
        })
    })
  })

  describe("# ether/withdraw", function () {
    it(`should launch withdraw correctly`, done => {
      request
        .post('/ether/withdraw')
        .send({
          address: user1.address,
          amount: "0.02"
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          user1 = result.msg
          done()
        })
    })
  })


})