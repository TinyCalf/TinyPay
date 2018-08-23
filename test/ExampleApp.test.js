const assert = require("assert")
let api = require("../ExampleApp/index.js")
let request = require("supertest")(api.app)

user = {
  mobile: "15061518961",
  password: "whatthefuck"
}

describe('Example App', function () {

  this.timeout(1000 * 5 * 60)

  describe("# /register", function () {
    it(`should get new wallet correctly`, function (done) {
      request
        .post('/register')
        .send({
          mobile: user.mobile,
          password: user.password
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          done()
        })
    })
  })

  describe("# /login", function () {
    it(`should get token when params are right`, function (done) {
      request
        .post('/login')
        .send({
          mobile: user.mobile,
          password: user.password
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          console.log(result)
          done()
        })
    })

    it(`should get err if mobile or password is wrong`, done => {
      request
        .post('/login')
        .send({
          mobile: "123123",
          password: user.password
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          let result = res.body
          assert(result.err == "USER_NOT_FOUND",
            `expect err to be USER_NOT_FOUND`)
          console.log(result)
          done()
        })
    })
  })


})