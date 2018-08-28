const hdkey = require("ethereumjs-wallet/hdkey")
const bip39 = require("bip39")

class Account {

  constructor() {
    let mnemonic = bip39.generateMnemonic()
    let seed = bip39.mnemonicToSeed(mnemonic)
    let path = "m/44'/60'/0'/24";
    let hdwallet = hdkey.fromMasterSeed(seed)
    let wallet = hdwallet.derivePath(path).getWallet()
    let prikey = wallet.getPrivateKey().toString("hex")
    let pubkey = wallet.getPublicKey().toString("hex")
    let address = wallet.getChecksumAddressString().toLowerCase()
    this.mnemonic = mnemonic
    this.path = path
    this.address = address
    this.prikey = prikey
    this.pubkey = pubkey
  }

}
module.exports = Account