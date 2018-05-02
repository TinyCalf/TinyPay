const crypto = require("crypto")
var request = require('request');



class Tinypay {
  constructor(config) {
    this.appKey = config.appKey
    this.appSecret = config.appSecret
    this.apiUri = config.apiUrl || "http://127.0.0.1:1990"
  }

  _sortParams(params) {
    var res = []
    var keys = Object.getOwnPropertyNames(params).sort()
    keys.forEach( (key)=>{
      res.push(`${key}=${params[key].toString()}`)
    })
    return res.join()
  }

  _sign(params)  {
    var timestamp = Date.now()
    var str = this._sortParams(params) + this.appSecret + timestamp
    console.log(str)
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    var sign = sha1.digest('hex')
    var obj = {
      timestamp:timestamp,
      appkey:this.appKey,
      signature:sign,
      params:params
    }
    console.log(obj)
    return obj
  }

  // get new account for one coin
  getNewAccount (alias) {
    return new Promise ( (resolve, reject)=>{
      var params = this._sign({alias:alias})
      var options = {
        uri: `${this.apiUri}/v1/getnewaccount`,
        method: 'POST',
        json: params
      };
      request(options, function (error, response, body) {
        if(error) return reject(error)
        return resolve(body)
      });
    })
  }


}
module.exports = Tinypay
