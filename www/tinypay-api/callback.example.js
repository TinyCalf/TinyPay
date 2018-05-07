const express = require("express");
const bodyParser = require('body-parser')
var app = express();

//设置跨与访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use(bodyParser.json())


app.post('/', function(req, res) {
  console.log(req.body)
  /*

{ type: 'newIncome',
  msg:
   { alias: 'king',
     symbol: 'KING(KingCoin)',
     transactionHash: '0x905c1adc8da51530ab73c36ec70840bd689e063f3558dd139ed3d188d5ee7a44',
     confirmations: 0,
     sender: '0xEE6A7a60f2f8D1e45A15eebb91EEc41886d4FA08',
     localReceiver: '0x212e754b95F99799AaB5686ab21Cf45A5F7E4000',
     blockHash: '0x57caae2893b335f072d22b3b18c86636d98c27fa6ec8b8e4447e12b2738fe3da',
     blockNumber: 3153166,
     value: '20000000000000000000',
     amount: '20' } }

{ type: 'confirmationUpdate',
  msg:
   { alias: 'king',
     symbol: 'KING(KingCoin)',
     transactionHash: '0x859f74930c601c85ff8fdd8239cad6e38f9a50db6d143f1ce9f3d450056bbc11',
     confirmations: 14,
     sender: '0xEE6A7a60f2f8D1e45A15eebb91EEc41886d4FA08',
     localReceiver: '0x212e754b95F99799AaB5686ab21Cf45A5F7E4000',
     blockHash: '0x43154ed0d11d0393eb67d782dc3472a756746b6ed7e102984aee74674a879a07',
     blockNumber: 3153102,
     value: '20000000000000000000',
     amount: '20' } }

{ type: 'outcomeSuccess',
  msg:
   { recordTime: 2018-05-04T07:48:44.000Z,
  recordTimestamp: 1525420124559,
  gasPrice: 4000000000,
  amount: '0.001',
  value: '1000000000000000',
  receiver: '0xc66bbb755a375b7bb2ff142eea8967246722a2b6',
  localSender: '0xee6a7a60f2f8d1e45a15eebb91eec41886d4fa08',
  transactionHash: '0xe67e8cfdaa2d19c8a7c727863d18bc85dd5ef00f6148ead4ab013d05a03ac4ab',
  success: true,
  confirmations: 0,
  __v: 0,
  gasUsed: 21000,
  etherUsed: 0.000084,
  blockHash: '0xa54ef2f3cf2bbe12248337549271204515eb6829d023dcd9689fcbd79093afa9',
  blockNumber: 3165551,
  blockTimestamp: 1525420225,
  blockTime: 2018-05-04T07:50:29.000Z }}
  */
  res.send("ok")
});

app.listen(30000);
console.log("callback listening on 30000" );
