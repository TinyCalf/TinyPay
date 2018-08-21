const assert = require("assert")
let block = require("../Ethereum/lib/block")
let ether = require("../Ethereum/ether")

let user1 = {}

describe('Ethereum', function () {

  this.timeout(1000 * 5 * 60)

  describe('# Ethereum/lib/block', () => {
    it(`should emit a block import event`, done => {
      block.newBlock.on("newBlock", block => {
        assert(block.number > 0,
          `expect block number to be over 0 but got ${block.number}`)
        done()
      })
    })
  })

  describe("# Ethereum/ether", function () {
    it(`should get new account correctly`, done => {
      ether.account.getNew()
        .then(ret => {
          assert(typeof ret.mnemonic == "string",
            "expect monemonic to be a string")
          assert(typeof ret.address === "string",
            "expect address to be a string")
          assert(typeof ret.prikey === "string",
            "expect prikey to be a string")
          user1.wallet = ret
          done()
        })
        .catch(err => {
          throw new Error(err)
        })
    })


  })

  describe("# Ethereum/withdraw", function () {
    it(`should lauch withdraw tx correctly`, done => {
      ether.withdraw.lauchTransaction(user1.wallet.address, "0.01")
        .then(ret => {
          console.log(ret)
          done()
        })
        .catch(err => {
          throw new Error(err)
          assert(false, "expect to have no err")
          done()
        })
    })
  })

  //describe("# /tools/rcsign", function() {
  //    it(`should get signed data correctly`, function(done) {
  //        request
  //            .post('/tools/rcsign')
  //            .send({
  //                prikey: testwallet.prikey,
  //                sha3data: testsha3data
  //            })
  //            .set('Accept', 'application/json')
  //            .expect(200)
  //            .end(function(err, res) {
  //                if (err) return done(err)
  //                let result = res.body
  //                console.log(result)
  //                assert(result.err == 0,
  //                    "expect to have no err")
  //                assert(typeof result.msg == "string",
  //                    "expect signed data to be a string")
  //                done()
  //            })
  //    })
  //})

})