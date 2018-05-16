/*
erc20/sendback/index.js
*/
const Queue = require("./QueueModel")
const Event = require("events")
const account = require("../../Account")
const utils = require("../../utils")
const web3 = utils.web3
const parity = utils.parity
const mainAddress = utils.wallet.mainAddress
const erc20instances = utils.erc20instances


let SendBack = class SendBack {

  constructor(erc20) {
    this.alias = erc20.alias
    this.symbol = erc20.symbol
    this.name = erc20.name
    this.erc20 = erc20
    this.queue = new Queue(
      erc20.alias,
      erc20.address)
    this.contractInstance = erc20.instance
    this.gas = erc20.gas
    this.gasPrice = erc20.gasPrice
    this.sendBackNeededGas = erc20.sendBackNeededGas
  }

  /*
  1. judge if has token inside
  2. add one address into the queue to be sent back to main
  */
  addAddressToBeSentBack (address) {
    return new Promise( (resolve, reject) => {
      this.contractInstance.methods.balanceOf(address).call()
      .then(ret=>{
        if(ret <= 0) return reject(new Error("NO_TOKEN_IN_THIS_ADDRESS") )
        return account.getPrivateKeyForAccount(address)
      })
      .then(ret=>{
        if(!ret) return reject(new Error("INVAILED_ADDRESS") )
        return this.queue.create(address)
      })
      .then(ret=>resolve(ret))
      .catch(err=>reject(err))
    })
  }

  /*
  1. find one record that has not sent gas
  2. sent ether to the account from main
  3. mark has sent gas
  */
  _findOneAndSendGas () {
    let self = this
    return new Promise ( (resolve, reject) => {
      let address = ""
      let nonce = 0
      parity.nextNonce(mainAddress)
      .then(ret=>{
        nonce = ret
        return this.queue.findOneNoSentGasAddress ()
      })
      .then(ret=>{
        if(ret && ret.address) address = ret.address
        else return resolve()
        let tx = {
            from: mainAddress,
            to: address,
            gas: this.gas,
            gasPrice: this.gasPrice,
            value: web3.utils.toBN(this.sendBackNeededGas)
            .mul(web3.utils.toBN(this.gasPrice)),
            nonce: nonce,
        }
        web3.eth.sendTransaction(tx)
        .on('transactionHash', function(hash){
          console.success(`sent needed gas for ${self.alias} ${address}
            tranactionHash ${hash}`)
          self.queue.addSentGasTransaction(address, hash)
          .then(ret=>resolve()).catch(err=>{throw err})
        })
        .on('error', err=>{reject(err)});
      })
      .catch(err=>{
        this.queue.addErrorLogs(address, err.toString())
        reject(err)
      })
    })
  }

  /*
  1. find if has sent gas
  2. mark got ether
  */
  _findAllAndConfirmSentGas () {
    return new Promise ( (resolve, reject) => {
      let address = ""
      return this.queue.findAllSentGasButNoConfirmedAddress()
      .then(txs=>{
        return Promise.map(txs, tx=>{
          return new Promise ( (resolve, reject) => {
            web3.eth.getTransactionReceipt(tx.sentGasTransactionHash)
            .then(ret=>{
              resolve(ret)
            })
            .catch(err=>reject(err))
          })
        })
      })
      .then(ret=>{
        return Promise.map(ret, receipt=>{
          return new Promise ( (resolve, reject) => {
            if( receipt && receipt.status == '0x1'
                && receipt.transactionHash
                && receipt.gasUsed){
              let etherUsed = web3.utils
                .fromWei(
                  web3.utils.toBN(this.sendBackNeededGas)
                  .mul(web3.utils.toBN(this.gasPrice))
                )
              let sentGasTransactionHash = receipt.transactionHash
              this.queue.confirmSentGas(
                sentGasTransactionHash,
                etherUsed
              ).then(ret=>resolve()).catch(err=>reject(err))
            } else resolve()
          })
        })
      })
      .then(ret=>resolve()).catch(err=>reject(err))
    })
  }

  /*
  1. find one and send back token
  */
  _findOneAndSendBack () {
    let self = this
    return new Promise ( (resolve, reject) => {
      let address = ""
      let nonce = 0
      let transactionHash = ""
      this.queue.findOneSentGasButNoSentBackAddress()
      .then(ret=>{
        if(!ret) return resolve()
        address = ret.address
        return parity.nextNonce(address)
      })
      .then(ret=>{
        nonce = ret
        return account.getPrivateKeyForAccount(address)
      })
      .then( prikey=>{
        let a = web3.eth.accounts.wallet.add(prikey);
        return this.contractInstance.methods.balanceOf(address).call()
      })
      .then(ret=>{
        this.contractInstance.methods.transfer(mainAddress,
          web3.utils.toBN(ret).toString()).send({
          from: address,
          nonce: nonce,
          gas: this.sendBackNeededGas,
          gasPrice:this.gasPrice
        })
        .on('transactionHash', function(hash){
          console.success(`sent back all token for ${self.alias} ${address}
            transactionHash: ${hash}`)
          transactionHash = hash
          self.queue.addSentBackTransaction(address, transactionHash)
          .then(ret=>resolve())
          .catch(err=>{
            self.queue.addErrorLogs(address, err.toString())
            reject(err)
          })
        })
        .on('error', (err)=>{
          self.queue.addErrorLogs(address, err.toString())
          reject(err)
        })
      })
      .catch(err=>{
        self.queue.addErrorLogs(address, err.toString())
        reject(err)
      })
    })
  }

  /*

  */
  _findAllAndConfirmSentBack() {
    return new Promise ( (resolve, reject) => {
      let address = ""
      return this.queue.findAllSentBackButNoConfirmedAddress()
      .then(txs=>{
        return Promise.map(txs, tx=>{
          return new Promise ( (resolve, reject) => {
            web3.eth.getTransactionReceipt(tx.sentBackTransactionHash)
            .then(ret=>{
              resolve(ret)
            })
            .catch(err=>reject(err))
          })
        })
      })
      .then(ret=>{
        return Promise.map(ret, receipt=>{
          return new Promise ( (resolve, reject) => {
            if( receipt && receipt.status == '0x1'
                && receipt.transactionHash){
              let sentBackTransactionHash = receipt.transactionHash
              this.queue.confirmSentBack(
                sentBackTransactionHash,
              ).then(ret=>resolve()).catch(err=>reject(err))
            } else resolve()
          })
        })
      })
      .then(ret=>resolve()).catch(err=>reject(err))
    })
  }


  start() {
    console.info(`start dealing with ${this.alias} sendbacks`)
    setInterval(()=>{
      this._findOneAndSendGas().catch(err=>console.error(err))
    }, 10000)
    setInterval(()=>{
      this._findAllAndConfirmSentGas().catch(err=>console.error(err))
    }, 10000)
    setInterval(()=>{
      this._findOneAndSendBack().catch(err=>console.error(err))
    }, 10000)
    setInterval(()=>{
      this._findAllAndConfirmSentBack().catch(err=>console.error(err))
    }, 10000)
  }

}



let sendbacks = {}
for(var alias in erc20instances) {
  sendbacks[alias] = new SendBack(erc20instances[alias])
}

let startAll = () =>{
  for(var alias in sendbacks){
    sendbacks[alias].start()
  }
}
exports.startAll = startAll

let addAddress = (alias, address) => {
  return sendbacks[alias].addAddressToBeSentBack(address)
}
exports.addAddress = addAddress
