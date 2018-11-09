const assert = require("assert")

let ether = require("../Ethereum/ether")

let callback = require("../www/callback")

let user1 = {}
let withdrawHash = ""
let localSender = ""

describe('Ethereum', function () {

  this.timeout(1000 * 5 * 60)

  before(done => {
    setTimeout(done, 1000)
  })

  describe("# Ethereum/ether", function () {
    it(`should get new account correctly`, done => {
      ether.account.getNew()
        .then(ret => {
          console.log(ret)
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

    it(`should lauch withdraw tx and receive receipt correctly`, done => {

      ether.withdraw.Events.once("confirmedNewTx", ret => {
        console.log("confirmedNewTx")
        console.log(ret)
        assert(typeof ret.transactionHash === "string")
      })

      ether.recharge.Events.on("newRecharge", ret => {
        console.log("newRecharge")
        console.log(ret)
      })

      ether.recharge.Events.on("confirmationUpdate", ret => {
        console.log("confirmationUpdate")
        console.log(ret)
        if (ret.confirmations >= 20) done()
      })

      ether.withdraw.lauchTransaction(user1.wallet.address, "0.01")
        .then(ret => {
          console.log(ret)
          assert(typeof ret.transactionHash === "string",
            "expect transaction hash to be a string")
          withdrawHash = ret
        })
    })

    it(`should get events of sendback`, done => {
      ether.recharge.Events.on("newSendback", ret => {
        console.log("newSendback")
        console.log(ret)
        assert(typeof ret === "string",
          'expect transactionHash to be a string')
      })

      ether.recharge.Events.on('confirmedSendback', ret => {
        console.log("confirmedSendback")
        console.log(ret)
        localReceiver = ret.localSender
        assert(typeof ret === 'object',
          'expect transactionHash to be a string')
        done()
      })
    })

    it(`should get balance of the localSender above and returns 0`, done => {
      ether.getBalance(localReceiver)
        .then(ret => {
          console.log(ret)
          assert(ret == "0")
          done()
        })
    })

  })


})