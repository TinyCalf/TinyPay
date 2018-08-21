const Account = require("../../lib/account")
const db = require("./etheraccount.db")

exports.getNew = () => {
  return new Promise((resolve, reject) => {
    let a = new Account()
    db.add({
        address: a.address,
        prikey: a.prikey,
        pubkey: a.pubkey,
        path: a.path,
        mnemonic: a.mnemonic
      })
      .then(ret => resolve(a))
      .catch(reject)
  })
}