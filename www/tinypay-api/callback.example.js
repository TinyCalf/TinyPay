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
   { recordTime: '2018-05-02T10:07:18.000Z',
     recordTimestamp: 1525255638178,
     gasPrice: 4000000000,
     localSender: '0xEE6A7a60f2f8D1e45A15eebb91EEc41886d4FA08',
     transactionHash: '0x905c1adc8da51530ab73c36ec70840bd689e063f3558dd139ed3d188d5ee7a44',
     success: false,
     amounts: [ '20', '30' ],
     values: [ '20000000000000000000', '30000000000000000000' ],
     receivers:
      [ '0x212e754b95f99799aab5686ab21cf45a5f7e4000',
        '0x18aa1fe4446719d60a3b8b848e9d8eed37b18718' ],
     confirmations: 0,
     __v: 0 } }
  */
  res.send("ok")
});

app.listen(30000);
console.log("callback listening on 30000" );
