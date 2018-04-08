const db = require("../Database")
const Log = require("./model")
exports.append = (tag, type, msg, date) => {
  return new Promise ( (resolve, reject) => {
    var newlog = new Log()
    newlog.tag = tag
    newlog.type = type
    newlog.msg = msg
    newlog.date = date
    newlog.save( (err, ret) => {
      if(err) return reject(err)
      resolve()
    })
  })
}
