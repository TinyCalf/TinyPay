var request = require('request')
var config = require("./config")
class Parity {
  constructor(rpcuri) {
    if (!rpcuri) return new Error("no rpcuri found!")
    this.id = 1
    this.jsonrpc = "2.0"
    this.rpcuri = rpcuri
  }

  _sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      var data = {
        method: method,
        params: params,
        id: this.id,
        jsonrpc: this.jsonrpc
      }
      var options = {
        uri: this.rpcuri,
        method: 'POST',
        json: data,
        headers: {
          "Content-Type": "application/json"
        }
      }
      request(options, function (error, response, body) {
        if (error) return reject(error)
        resolve(body)
      })
    })
  }

  nextNonce(address) {
    return new Promise((resolve, reject) => {
      this._sendRequest("parity_nextNonce", [address])
        .then(ret => resolve(ret.result))
        .catch(err => reject(err))
    })
  }

}

module.exports = new
Parity(`http://${config.ethereum.host}:${config.ethereum.rpcport}`)

// var parity = new Parity("http://127.0.0.1:8545")

// parity.nextNonce("0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08")
// .then(console.log).catch(console.log)