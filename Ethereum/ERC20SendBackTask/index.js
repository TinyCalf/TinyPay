const Queue = require("./QueueModel")
const Event = require("events")
require("../../log")

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
    this.events = new Event()
  }

  /* add one address into the queue to be sent back to main*/
  addAddressToBeSentBack (address) {
    return this.queue.create(address)
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
            value: this.estimatedGas,
            nonce: nonce,
        }
        this.web3.eth.sendTransaction(tx)
        .on('transactionHash', function(hash){
          console.success(`sent needed gas for account
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
  // _findOneAndConfirmSentGas () {
  //   return new Promise ( (resolve, reject) => {
  //     let address = ""
  //     return findOneSentGasButNoConfirmedAddress()
  //     .then(ret=>{
  //       if(ret && ret.address) address = ret.address
  //       if(!ret.sentGasTransactionHash)
  //         return reject(new Error("no sentGasTransactionHash found"))
  //       return this.web3.eth.getTransactionReceipt(ret.sentGasTransactionHash)
  //     })
  //     .then(ret=>{
  //       if(!ret) return resolve()
  //
  //       return this.queue.confirmSentGas(address, )
  //     })
  //   })
  // }








}
