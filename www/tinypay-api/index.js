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
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    var sign = sha1.digest('hex')
    var obj = {
      timestamp:timestamp,
      appkey:this.appKey,
      signature:sign,
      params:params
    }
    return obj
  }
  // TODO:can make a factory function
  // get info of the main account
  getInfo () {
    return new Promise ( (resolve, reject)=>{
      var params = this._sign({})
      var options = {
        uri: `${this.apiUri}/v1/getinfo`,
        method: 'POST',
        json: params
      };
      request(options, function (error, response, body) {
        if(error) return reject(error)
        if(body.err != 0) {
          var e = new Error(body.msg)
          e.code = body.err
          return reject(e)
        }
        resolve(body.msg)
      });
    })
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
        if(body.err != 0) {
          var e = new Error(body.msg)
          e.code = body.err
          return reject(e)
        }
        resolve(body.msg)
      });
    })
  }

  // get new account for one coin
  transferKingToAddresses (tos, amounts) {
    return new Promise ( (resolve, reject)=>{
      var params = this._sign({tos:tos, amounts:amounts})
      var options = {
        uri: `${this.apiUri}/v1/transferkingtoaddresses`,
        method: 'POST',
        json: params
      };
      request(options, function (error, response, body) {
        if(error) return reject(error)
        if(body.err != 0) {
          var e = new Error(body.msg)
          e.code = body.err
          return reject(e)
        }
        resolve(body.msg)
      });
    })
  }

  withdraw (alias, to, amount) {
    return new Promise ( (resolve, reject)=>{
      var params = this._sign({alias:alias, to:to, amount:amount})
      var options = {
        uri: `${this.apiUri}/v1/withdraw`,
        method: 'POST',
        json: params
      };
      request(options, function (error, response, body) {
        if(error) return reject(error)
        if(body.err != 0) {
          console.log(body)
          var e = new Error(body.msg)
          e.code = body.err
          return reject(e)
        }
        resolve(body.msg)
      });
    })
  }

  sendBack (address) {
    return new Promise ( (resolve, reject)=>{
      var params = this._sign({address:address})
      var options = {
        uri: `${this.apiUri}/v1/sendback`,
        method: 'POST',
        json: params
      };
      request(options, function (error, response, body) {
        if(error) return reject(error)
        if(body.err != 0) {
          console.log(body)
          var e = new Error(body.msg)
          e.code = body.err
          return reject(e)
        }
        resolve(body.msg)
      });
    })
  }


}
module.exports = Tinypay
