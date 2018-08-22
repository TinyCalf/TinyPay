const assert = require("assert")

let bitcoin = require("../Bitcoin")
let address = ""

describe('Bitcoin', function () {

  this.timeout(1000 * 5 * 60)

  it(`should get new account correctly`, done => {
    bitcoin.getNewAccount()
      .then(ret => {
        console.log(ret)
        address = ret.address
        done()
      })
      .catch(console.err)
  })

  it(`should withdraw correctly `, done => {
    bitcoin.withdraw(address, 0.1)
      .then(ret => {
        console.log(ret)
      })
    bitcoin.events.once("outcomeSuccess", ret => {
      console.log("outcomeSuccess")
      console.log(ret)
    })
    bitcoin.events.once("newIncome", ret => {
      console.log("newIncome")
      console.log(ret)
    })
    bitcoin.events.on("confirmationUpdate", ret => {
      console.log("confirmationUpdata")
      console.log(ret)
      assert(typeof ret.confirmations === "number")
      done()
    })
  })


})