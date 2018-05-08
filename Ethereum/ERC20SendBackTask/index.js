const Queue = require("./QueueModel")
const Event = require("events")
const fs = require("fs")
const path = require("path")
Promise = require("bluebird")
require("../../log")
const account = require("../Account")

module.exports = class ERC20SendBackTask {

/*
{
  alias: "king",
  contractAddress: "0x53565FEbe212Fc43392Fdf01aE19CCd3d492695A",
  mainPrivateKey:"0xe78dd8f82f884b144381fa7c722fdef191273b8955306cf0129ff8b80c5390c6",
  estimatedGas : (ether)
  gas:
  gasPrice :
  mongoose : mongoose,
  web3: web3,
  parity: parity,
}
*/
  constructor(config) {
    this.config = config
    this.queue = new Queue(
      config.alias,
      config.contractAddress,
      config.mongoose)
    this.web3 = config.web3
    this.mainAccount = this.web3.eth.accounts.wallet.add(
        config.mainPrivateKey
    );
    this.mainAddress = this.mainAccount.address.toLowerCase()
    this.gas = config.gas
    this.gasPrice = config.gasPrice
    this.estimatedGas = config.estimatedGas
    this.parity = config.parity
    this.contractAddress = config.contractAddress
    this.events = new Event()
    let abi = JSON.parse(
      fs.readFileSync(__dirname + "/erc20.abi").toString())
    this.contractInstance =
      new this.web3.eth.Contract(abi, this.contractAddress)
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
      this.parity.nextNonce(this.mainAddress)
      .then(ret=>{
        nonce = ret
        return this.queue.findOneNoSentGasAddress ()
      })
      .then(ret=>{
        if(ret && ret.address) address = ret.address
        else return resolve()
        let tx = {
            from: this.mainAddress,
            to: address,
            gas: this.gas,
            gasPrice: this.gasPrice,
            value: this.web3.utils.toBN(this.estimatedGas)
            .mul(this.web3.utils.toBN(this.gasPrice)),
            nonce: nonce,
        }
        this.web3.eth.sendTransaction(tx)
        .on('transactionHash', function(hash){
          console.success(`sent needed gas for ${self.config.alias} ${address}
            tranactionHash ${hash}`)
          self.queue.addSentGasTransaction(address, hash)
          .then(ret=>resolve()).catch(err=>{throw err})
        })
        .on('error', err=>reject(err));
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
            this.web3.eth.getTransactionReceipt(tx.sentGasTransactionHash)
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
              let etherUsed = this.web3.utils
                .fromWei(
                  this.web3.utils.toBN(receipt.gasUsed)
                  .mul(this.web3.utils.toBN(this.gasPrice))
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
        return this.parity.nextNonce(address)
      })
      .then(ret=>{
        nonce = ret
        return account.getPrivateKeyForAccount(address)
      })
      .then( prikey=>{
        let a = this.web3.eth.accounts.wallet.add(prikey);
        return this.contractInstance.methods.balanceOf(address).call()
      })
      .then(ret=>{
        this.contractInstance.methods.transfer(this.mainAddress,
          this.web3.utils.toBN(ret) ).send({
          from: address,
          nonce: nonce,
          gas: this.estimatedGas,
          gasPrice:this.gasPrice
        })
        .on('transactionHash', function(hash){
          console.success(`sent back all token for ${self.config.alias} ${address}
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
            this.web3.eth.getTransactionReceipt(tx.sentBackTransactionHash)
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
