require("../log")
var Ethereum = require("../Ethereum")
var config = require("../Config")
var db = require("./Database/Callbackqueue.db")
var request = require("request")

var findOneAndSend = () => {
  db.findOneUnreceived()
  .then(ret=>{
    if(!ret) return
    console.info(`callback queue sending new message id:${ret.id}`)
    var options = {
      uri: config.www.callbackUri,
      method: 'POST',
      timeout: 20000,
      json: {
        type:ret.type,
        msg:JSON.parse(ret.message)
      }
    };
    request(options, function (error, response, body) {
      if(error) return console.error(error)
      //has got response, indicating that this message is solved
      db.markReceived(ret._id).catch(err=>console.error(err))
      console.info(`new message received by client id:${ret.id}`)
    });
  })
  .catch(err=>console.error(err))
}
setInterval(findOneAndSend, 5000)

Ethereum.Transaction.king.getEvents
.on('outcomeSuccess', (income) => {
  console.info(`callback queue has new outcomeSuccess message`)
  db.add(JSON.stringify(income), "outcomeSuccess").catch(console.error)
})

Ethereum.Transaction.etheroutcome.getEvents
.on('outcomeSuccess', (income) => {
  console.info(`callback queue has new outcomeSuccess message`)
  db.add(JSON.stringify(income), "outcomeSuccess").catch(console.error)
})


Ethereum.Transaction.erc20income.getEvents
.on('newIncome', (income) => {
  console.info(`callback queue has new newIncome message`)
  db.add(JSON.stringify(income), "newIncome").catch(console.error)
})
.on('confirmationUpdate',(transaction) => {
  db.add(JSON.stringify(transaction), "confirmationUpdate").catch(console.error)
})


Ethereum.Transaction.etherincome.getEvents
.on('newIncome', (income) => {
  console.info(`callback queue has new newIncome message`)
  db.add(JSON.stringify(income), "newIncome").catch(console.error)
})
.on('confirmationUpdate',(transaction) => {
  console.info(`callback queue has new confirmationUpdate message`)
  db.add(JSON.stringify(transaction), "confirmationUpdate").catch(console.error)
})
