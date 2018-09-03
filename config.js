let yaml = require("js-yaml")
let fs = require("fs")
let path = require("path")
let convict = require('convict')

let dev = {
  mongodb: "mongodb://localhost:27017/tinypay_dev",
  ethereum: {
    host: "127.0.0.1",
    rpcport: 10001,
    wsport: 10002,
    //冷钱包 prikey 0xae157ea229549c0d4720bef322d1cf1ee0d8d5be5b4b5372eceffa135438a696
    coldAddress: "0x65dd104db7d570121e33bcbfde55721cf2b1018f",
    hotPrikey: "0xae157ea229549c0d4720bef322d1cf1ee0d8d5be5b4b5372eceffa135438a696",
    hotAddress: "0x65dd104db7d570121e33bcbfde55721cf2b1018f",
    confirmations: 20,
    ether: {
      gas: "50000",
      gasPrice: "3000000000",
      startHeight: 220000,
    },
  },
  bitcoin: {
    startHeight: 200,
    host: "47.93.17.111",
    port: 20001,
    user: "root",
    pass: "password",
    confirmations: 20,
  },
  www: {
    callback: "http://127.0.0.1:3333/ether/testcallback"
  }
}

prod = {}

let config = convict({
  mongodb: {
    doc: "mongodb host",
    format: String,
    default: "mongodb://127.0.0.1/tinypay"
  },
  ethereum: {
    host: {
      doc: "host of parity node",
      format: "ipaddress",
      default: "127.0.0.1",
    },
    rpcport: {
      doc: "rpc port of parity node",
      format: "port",
      default: "8545"
    },
    wsport: {
      doc: "ws port of parity node",
      format: "port",
      default: "8546"
    },
    coldAddress: {
      doc: "cold wallet address of ethereum main account",
      format: String,
      default: "0x65dd104db7d570121e33bcbfde55721cf2b1018f"
    },
    hotPrikey: {
      doc: "hot wallet private key of ethereum main account",
      format: String,
      default: "0xae157ea229549c0d4720bef322d1cf1ee0d8d5be5b4b5372eceffa135438a696"
    },
    hotAddress: {
      doc: "hot wallet address of ethereum main account according to hot private key",
      format: String,
      default: "0x65dd104db7d570121e33bcbfde55721cf2b1018f"
    },
    confirmations: {
      doc: "default confirmations that the system will listen for every transaction",
      format: Number,
      default: 20,
    },
    ether: {
      gas: {
        doc: "default gas set for every transaction on ether",
        format: String,
        default: "50000",
      },
      gasPrice: {
        doc: "default gasPrice set for every transaction on ether",
        format: String,
        default: "3000000000"
      },
      startHeight: {
        doc: "the start height that system will listen from",
        format: Number,
        default: "5000000"
      },
    },
  },
  bitcoin: {
    startHeight: {
      doc: "the start height that system will listen for bitcoin",
      format: Number,
      default: "2000000"
    },
    host: {
      doc: "the host of bitcoin core node",
      format: "ipaddress",
      default: "127.0.0.1"
    },
    port: {
      doc: "the port of bitcoin core node",
      format: "port",
      default: "8333"
    },
    user: {
      doc: "the user of bitcoin core node",
      format: String,
      default: "root"
    },
    pass: {
      doc: "the password of bitcoin core node",
      format: String,
      default: "root"
    },
    confirmations: {
      doc: "default confirmations that the system will listen for every transaction",
      format: Number,
      default: 20
    }
  },
  www: {
    callback: {
      doc: "the callback url",
      format: String,
      default: 20,
    }
  }
})

let checksum = (file) => {
  config.load(file)
  config.validate({
    allowed: 'strict'
  });
}

this.path = null

exports.get = () => {
  if (this.path) {
    let file = yaml.load(fs.readFileSync(this.path))
    config.load(file)
    config.validate({
      allowed: 'strict'
    })
    return config
  } else {
    config.load(dev)
    config.validate({
      allowed: 'strict'
    })
    return config
  }
}

// const mongoose = require("mongoose")
// mongoose.Promise = require('bluebird')
// const host = global.config.mongodb
// mongoose.connect(host, {
//   useMongoClient: true
// })
// global.mongoose = mongoose
//

exports.setPath = path => {
  this.path = path
}