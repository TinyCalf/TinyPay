/*
ether/sendback/index.js
*/
const db = require("./ethersendback.db")
const Event = require("events")
const account = require("../account")
const web3 = require('../../lib/web3')
const parity = require('../../lib/parity')
const wallet = require('../../lib/wallet')
const config = require('../../config')
const coldAddress = config.coldAddress
const Promise = require("bluebird")

let EtherSendBack = class EtherSendBack {
  constructor(gas, gasPrice) {
    this.gas = gas
    this.gasPrice = gasPrice
    this.Events = new Event()
  }

  addAddressToBeSentBack(address) {
    return new Promise((resolve, reject) => {
      let gasBeingUsed = 0
      let tx = {}
      web3.eth.getBalance(address)
        .then(ret => {
          if (ret <= 0) return reject(new Error("NO_TOKEN_IN_THIS_ADDRESS"))
          return account.getPrikeyByAddress(address)
        })
        .then(ret => {
          if (!ret) return reject(new Error("INVAILED_ADDRESS"))
          return db.create(address)
        })
        .then(ret => resolve(ret))
        .catch(err => reject(err))
    })
  }

  _findOneAndSendBack() {
    let self = this
    return new Promise((resolve, reject) => {
      let record = {}
      let nonce = 0
      let tx = {}
      let etherUsed = 0
      let localAddress = ""
      db.findOneNoSentBack()
        .then(ret => {
          record = ret
          if (!ret) return resolve()
          return web3.eth.getBalance(record.address)
        })
        .then(ret => {
          console.log(ret)
          tx.value = ret
          tx.gas = self.gas
          tx.gasPrice = self.gasPrice
          tx.from = record.address
          tx.to = coldAddress
          return web3.eth.estimateGas(tx)
        })
        .then(ret => {
          let gasBN = web3.utils.toBN(ret)
          let gasPriceBN = web3.utils.toBN(tx.gasPrice)
          let etherBN = gasBN.mul(gasPriceBN)
          etherUsed = web3.utils.fromWei(etherBN.toString(10))
          let valueBN = web3.utils.toBN(tx.value)
          let actualValue = valueBN.sub(etherBN)
          tx.value = actualValue.toString(10)
          tx.gas = gasBN.toString(10)
          tx.gasPrice = this.gasPrice
          localAddress = tx.from
          return account.getPrikeyByAddress(tx.from)
        })
        .then(ret => {
          let a = web3.eth.accounts.wallet.add("0x" + ret)
          return parity.nextNonce(tx.from)
        })
        .then(ret => {
          nonce = ret
          tx.nonce = nonce
          web3.eth.sendTransaction(tx)
            .on('transactionHash', function (hash) {
              console.success(`ether in ${tx.from} is being sent back to main`)
              db.addSentBackTransaction(
                  tx.from,
                  hash,
                  tx.value,
                  web3.utils.fromWei(tx.value),
                  etherUsed
                )
                .then(ret => resolve()).catch(err => {
                  throw err
                })
              self.Events.emit("newSendback", hash)
              web3.eth.accounts.wallet.remove(localAddress)
            })
            .on('error', err => {
              reject(err)
            })
            .then(ret => {})
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err);
          db.addErrorLogs(tx.from, err.toString())
        })
    })
  }

  _findAllAndConfirmSentBack() {
    return new Promise((resolve, reject) => {
      db.findAllSentBackButNoConfirmedAddress()
        .then(txs => {
          return Promise.map(txs, tx => {
            return new Promise((resolve, reject) => {
              web3.eth.getTransactionReceipt(tx.sentBackTransactionHash)
                .then(ret => {
                  resolve(ret)
                })
                .catch(err => reject(err))
            })
          })
        })
        .then(ret => {
          return Promise.map(ret, receipt => {
            return new Promise((resolve, reject) => {
              if (receipt &&
                receipt.transactionHash) {
                let sentBackTransactionHash = receipt.transactionHash
                db.confirmSentBack(
                    sentBackTransactionHash,
                  ).then(ret => {
                    return db.check(sentBackTransactionHash)
                  })
                  .then(ret => {
                    this.Events.emit("confirmedSendback", ret)
                    resolve()
                  })
                  .catch(err => reject(err))
              } else resolve()
            })
          })
        })
        .then(ret => resolve()).catch(err => reject(err))
    })
  }

  start() {
    console.info(`start dealing with ether sendbacks`)
    setInterval(() => {
      this._findOneAndSendBack().catch(err => console.error(err))
    }, 10000)
    setInterval(() => {
      this._findAllAndConfirmSentBack().catch(err => console.error(err))
    }, 10000)
  }

}

let sendback = new EtherSendBack(config.ether.gas, config.ether.gasPrice)

let start = () => {
  sendback.start()
}

let addAddress = (address) => {
  return sendback.addAddressToBeSentBack(address)
}
exports.start = start
exports.addAddress = addAddress
exports.Events = sendback.Events