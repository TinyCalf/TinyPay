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
eth.sendTransaction({
  from:eth.accounts[0],
  to:eth.accounts[4],
  value:"1234999999999999998444"
})
```
