const assert = require("assert")

let block = require("../Ethereum/block")

let ether = require("../Ethereum/ether")

let user1 = {}
let withdrawHash = ""

describe('Ethereum', function () {

  this.timeout(1000 * 5 * 60)

  describe('# Ethereum/lib/block', () => {
    it(`should emit a block import event`, done => {
      block.newBlock.once("newBlock", block => {
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

    it(`should lauch withdraw tx and receive receipt correctly`, done => {

      ether.withdraw.Events.once("confirmedNewTx", ret => {
        assert(typeof ret.transactionHash === "string")
      })

      ether.recharge.Events.on("newRecharge", ret => {})

      ether.recharge.Events.on("confirmationUpdate", ret => {
        if (ret.confirmations >= 20) done()
      })

      ether.withdraw.lauchTransaction(user1.wallet.address, "0.01")
        .then(ret => {
          assert(typeof ret === "string",
            "expect transaction hash to be a string")
          withdrawHash = ret
        })

    })

    it(`should get events of sendback`, done => {
      ether.recharge.Events.on("newSendback", ret => {
        assert(typeof ret === "string",
          'expect transactionHash to be a string')
      })

      ether.recharge.Events.on('confirmedSendback', ret => {
        assert(typeof ret === 'string',
          'expect transactionHash to be a string')
        done()
      })

    })



  })



})