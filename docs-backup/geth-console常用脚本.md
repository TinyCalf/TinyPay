### 以太坊检测余额脚本
```javascript
for(var i=0;i<eth.accounts.length;i++){
  var balance=web3.fromWei(eth.getBalance(eth.accounts[i]));
  if(balance>0){console.log(i,balance)}
}
```

### 将所有子账户余额打入主账户
```javascript
for(var i=1;i<eth.accounts.length;i++){
  var balance=eth.getBalance(eth.accounts[i]);
  balance=web3.toBigNumber(balance);
  if(balance>0){
    console.log(i,web3.fromWei(balance));
    personal.unlockAccount(eth.accounts[i],"77e7c96a",100000);
    tx={
      from:eth.accounts[i],
      to:eth.accounts[0],
      value:balance
    }
    var gasPrice=eth.gasPrice;
    var gas=eth.estimateGas(tx);
    tx.gasPrice=gasPrice;
    tx.gas=gas;
    tx.value=balance.minus(gasPrice*gas).toString();
    console.log("sending")
    console.log(i,tx.value.toString(10))
    eth.sendTransaction(tx)
  }
}
```
超大数例子：123499999999999999800

### 发送交易
```javascript
personal.unlockAccount(eth.accounts[0],"77e7c96a",100000);
eth.sendTransaction({
  from:eth.accounts[0],
  to:eth.accounts[2320],
  value:"1431000000000000"
})
```


### ERC20相关
#### 创建合约实例
```javascript
var theContract=eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]);
var contractInstance = theContract.at("0x6b6b298a5a7d71de1d534c8a54eb29d68a168f9b")
```

#### 获取某账户余额
```javascript
contractInstance.balanceOf("0x6b6b298a5a7d71de1d534c8a54eb29d68a168f9b")
```

#### 发送token
```javascript
var to = my
var from = main
personal.unlockAccount(from,"77e7c96a",100000)
contractInstance.transfer(to,web3.toWei(1.22),{from:from})
```
```javascript
var to = eth.accounts[0]
var from = "0x41510245d7da3145512612ebf7562e22b8274958"
personal.unlockAccount(from,"77e7c96a",100000)
contractInstance.transfer(to,web3.toWei(1.21),{from:from})
```
-
### 允许某账户提自己的token
```javascript
personal.unlockAccount("0x41510245d7da3145512612ebf7562e22b8274958","77e7c96a",100000)
var account = "0x41510245d7da3145512612ebf7562e22b8274958"
var spender = eth.accounts[0]
var value = 1000000000000
personal.unlockAccount(account,"77e7c96a",1000000)
contractInstance.approve(spender,value,{from:account})
```
### 从授权的其他账户提取token
```javascript
personal.unlockAccount(eth.accounts[0],"77e7c96a",100000)
contractInstance.transferFrom(eth.accounts[1],eth.accounts[3],web3.toWei(900000),{from:eth.accounts[0]})
```


#### 获取某块上的交易
```javascript
eth.getBlock(3511).transactions

{
  blockHash: "0x2a5be303d5326d1004b9bcd840120648f898914f9b8e879b19d072bb19fd9434",
  blockNumber: 3511,
  from: "0xecf6e8cbb8633a3c490d587fa357ad20e21d4b93", //发出地址
  gas: 90000,
  gasPrice: 0,
  hash: "0x506fea5ae6d5bf08df79b3f2371b553c974a61ba9949225dac9a45017fd0d86d",
  input: "0xa9059cbb00000000000000000000000089bb2b310f9379986972bc2940461540591a332d00000000000000000000000000000000000000000000043c33c1937564800000",
  nonce: 12,
  r: "0xe78e51d3acf99d105441e24b2b932f1977a9f8cd23d628fb5f96157400f5c82f",
  s: "0x7510a065705b144920d93fffb00ab036d9af9ad5ca458ca285cfb1d131f99c",
  to: "0xae4193c5100e173c123619fc2b3845e1091e1aa8", //这个是合约地址
  transactionIndex: 0,
  v: "0xa96",
  value: 0
}
```

#### watch
```
txs.watch(function(error, result){
  if (!error)
    console.log(result);
});
```




### watch中发出来的消息
```javascript
{ address: '0xae4193c5100e173c123619fc2b3845e1091e1aa8',
  blockNumber: 3519,
  transactionHash: '0xa4aedd34557884e977f0981ab55035527fd990efbee9115d2b37df51ee79180e',
  transactionIndex: 0,
  blockHash: '0x860ed4316ecd45b58e439f195a0312111c3e7ef73666d37f382ac2f64b2ce213',
  logIndex: 0,
  removed: false,
  event: 'Transfer',
  args:
   { from: '0xecf6e8cbb8633a3c490d587fa357ad20e21d4b93',
     to: '0x89bb2b310f9379986972bc2940461540591a332d',
     value: { [String: '2e+22'] s: 1, e: 22, c: [Array] } } }
```
