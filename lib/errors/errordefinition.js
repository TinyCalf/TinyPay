let _ = require("lodash")

let ClientError = require('./clienterror')

let errors = {
  UNKNOW_ERROR: "Unknow Error",
  INSUFFICIENT_FUNDS: "Insufficient Funds",
}

let errorObjects = _.zipObject(_.map(errors, (msg, code) => {
  return [code, new ClientError(code, msg)]
}))

errorObjects.codes = _.mapValues(errors, (v, k) => {
  return k
})
console.log(errorObjects)