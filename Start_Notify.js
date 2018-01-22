
var fs = require('fs')
var S = require('string')
var nodemailer = require('nodemailer')
var config = require('./config')
var web3 = require('web3_extended')

var noticeConfig = {
  checkInterval: 60, // 1 min
  sendNoticeInterval: 30 * 60, // 30 min
  warningBlocks: 1000
}

var smtpConfig = {
  host: 'smtp.126.com',
  port: 465,
  secure: true,
  auth: {
    user: 'luo_yong_biz@126.com',
    pass: '123456aabbcc'
  }
}

var mailConfig = {
  from: '"Luo Yong" <luo_yong_biz@126.com>'
}

var lastMessageSentTime = null;

function readEmailAddrStep(context) {
  fs.readFile('email.txt', {encoding:'UTF-8', flag:'r'}, (err, data) => {
    if (err) {
      console.log('ERROR: ')
      console.log(err)
    }else {
      let lines = data.split("\n")
      let addrs = new Array()
      if (lines) {
        lines.forEach((line) => {
          if (!S(line).isEmpty()) {
            addrs.push(line.trim())
          }
        })
      }
      
      sendEmailStep(addrs, context)
    }
  })
}

function sendEmailStep(addrs, context) {

  if ((Date.now() - lastMessageSentTime) < noticeConfig.sendNoticeInterval * 1000) {
    return
  }

  let mailContent = {
    from: mailConfig.from,
    to: addrs.join(', '),
    subject: `区块同步缓慢 Current:${context.syncing.currentBlock} High:${context.syncing.highestBlock}`,
    text: `区块同步缓慢 当前块:${context.syncing.currentBlock} 最高块:${context.syncing.highestBlock}`,
    //html: '<b>Hello world?</b>' // html body
  }
  
  let transporter = nodemailer.createTransport(smtpConfig)
  
  transporter.sendMail(mailContent, (error, info) => {
    if (error) {
      console.log('ERROR: ')
      console.log(error);
    }else {
      lastMessageSentTime = Date.now()
      console.log('Message sent: %s', info.messageId);
    }
  });
}

function checkSyncingInfo() {
  let currencies = Object.keys(config.currencies)
  currencies.forEach((currency) => {
    if (config.currencies[currency].category == 'ethereum') {
      let options = {
        host: "http://" + config.currencies[currency].host + ":" + config.currencies[currency].port,
        personal: true,
        admin: true,
        debug: true
      }
      let rpc = web3.create(options)
      
      let syncingInfo = rpc.eth.syncing
      if (syncingInfo) {
        if ((syncingInfo.highestBlock - syncingInfo.currentBlock) > noticeConfig.warningBlocks) {
          let context = {syncing: syncingInfo}
          readEmailAddrStep(context)
        }
      }
    }
  })
}

function firstStep() {
  setInterval(function() { checkSyncingInfo() }, noticeConfig.checkInterval * 1000)
}

firstStep()
//checkSyncingInfo()
