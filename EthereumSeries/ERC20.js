var Rpc = require("./Rpc")
var ethrpc = new Rpc("eth")
var log = require('../Logs/log.js')("ERC20")
const ERC20ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]

/*
用主账户发起新的ERC20代币
仅测试私有链中使用
*/

/*TEST*/
// this.deployNewERC20InPrivateChain(5000000,"TCT","TCT")
// .then(contract=>console.log("good")))
// .catch(err=>console.log(err))
exports.deployNewERC20InPrivateChain = (initialSupply, tokenName, tokenSymbol) => {
  return new Promise( (resolve, reject) => {
    var mainAccount = "";
    ethrpc.getMainAccount()
    .then(ret=>{
      mainAccount=ret;
      return ethrpc.unlock(mainAccount)
    })
    .then(()=>{
      var tokenerc20Contract = ethrpc.getRpc().eth.contract(ERC20ABI);
      var tokenerc20 = tokenerc20Contract.new(
         initialSupply,
         tokenName,
         tokenSymbol,
         {
           from: mainAccount,
           data: '0x60606040526012600260006101000a81548160ff021916908360ff16021790555034156200002c57600080fd5b604051620012263803806200122683398101604052808051906020019091908051820191906020018051820191905050600260009054906101000a900460ff1660ff16600a0a8302600381905550600354600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508160009080519060200190620000d8929190620000fb565b508060019080519060200190620000f1929190620000fb565b50505050620001aa565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200013e57805160ff19168380011785556200016f565b828001600101855582156200016f579182015b828111156200016e57825182559160200191906001019062000151565b5b5090506200017e919062000182565b5090565b620001a791905b80821115620001a357600081600090555060010162000189565b5090565b90565b61106c80620001ba6000396000f3006060604052600436106100ba576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100bf578063095ea7b31461014d57806318160ddd146101a757806323b872dd146101d0578063313ce5671461024957806342966c681461027857806370a08231146102b357806379cc67901461030057806395d89b411461035a578063a9059cbb146103e8578063cae9ca511461042a578063dd62ed3e146104c7575b600080fd5b34156100ca57600080fd5b6100d2610533565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101125780820151818401526020810190506100f7565b50505050905090810190601f16801561013f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561015857600080fd5b61018d600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506105d1565b604051808215151515815260200191505060405180910390f35b34156101b257600080fd5b6101ba61065e565b6040518082815260200191505060405180910390f35b34156101db57600080fd5b61022f600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610664565b604051808215151515815260200191505060405180910390f35b341561025457600080fd5b61025c610791565b604051808260ff1660ff16815260200191505060405180910390f35b341561028357600080fd5b61029960048080359060200190919050506107a4565b604051808215151515815260200191505060405180910390f35b34156102be57600080fd5b6102ea600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506108a8565b6040518082815260200191505060405180910390f35b341561030b57600080fd5b610340600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506108c0565b604051808215151515815260200191505060405180910390f35b341561036557600080fd5b61036d610ada565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103ad578082015181840152602081019050610392565b50505050905090810190601f1680156103da5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156103f357600080fd5b610428600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610b78565b005b341561043557600080fd5b6104ad600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610b87565b604051808215151515815260200191505060405180910390f35b34156104d257600080fd5b61051d600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610d05565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105c95780601f1061059e576101008083540402835291602001916105c9565b820191906000526020600020905b8154815290600101906020018083116105ac57829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506001905092915050565b60035481565b6000600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482111515156106f157600080fd5b81600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550610786848484610d2a565b600190509392505050565b600260009054906101000a900460ff1681565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156107f457600080fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816003600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a260019050919050565b60046020528060005260406000206000915090505481565b600081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561091057600080fd5b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561099b57600080fd5b81600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816003600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a26001905092915050565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b705780601f10610b4557610100808354040283529160200191610b70565b820191906000526020600020905b815481529060010190602001808311610b5357829003601f168201915b505050505081565b610b83338383610d2a565b5050565b600080849050610b9785856105d1565b15610cfc578073ffffffffffffffffffffffffffffffffffffffff16638f4ffcb1338630876040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610c91578082015181840152602081019050610c76565b50505050905090810190601f168015610cbe5780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b1515610cdf57600080fd5b6102c65a03f11515610cf057600080fd5b50505060019150610cfd565b5b509392505050565b6005602052816000526040600020602052806000526040600020600091509150505481565b6000808373ffffffffffffffffffffffffffffffffffffffff1614151515610d5157600080fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610d9f57600080fd5b600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401111515610e2d57600080fd5b600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401905081600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a380600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020540114151561103a57fe5b505050505600a165627a7a723058202861256968d059ffb411ef8860042741722f2607dc0a14a469db96d019cbb9e60029',
           gas: '4700000'
         },
         function (e, contract){
           /*
            该过程需要等待新的区块生成
           */
          //  console.log(contract)
          if (typeof contract.address !== 'undefined') {
            log.info('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash)
            return resolve(contract)
          }
          if(e) return reject(e)
       })
    })
    .catch(err=>{
      if(err) return reject(err)
    })
  })
}




/*
发送代币
@param from 发出交易的帐号地址
@param to 接收交易的帐号地址
@param value 交易数量
@param contractAddr 合约地址

@return txHash 交易单号
*/

/*TEST*/
// this.transferTokens(
//   "0x29800baedfb23c6a1a23239c08850c83a6193fec",
//   "0xe69f092d9b28ecb3b5500558e3931c2a47e18dd9",
//   5000,
//   "0xa40ae7435c6a12c78b9260d5641fbb89e439f6bc"
// )
// .then(ret=>console.log(ret))
// .catch(err=>console.log(err))
exports.transferTokens = (from, to, value, contractAddr) => {
  return new Promise( (resolve, reject) => {
    ethrpc.unlock(from)
    .then( ()=>{
      var theContract = ethrpc.getRpc().eth.contract(ERC20ABI)
      var contractInstance = theContract.at(contractAddr)
      contractInstance.transfer(
        to,
        value,
        { from: from }, function (err, txHash) {
        if (err) return reject(err)
        if (txHash) {
          return resolve(txHash)
        }
      })
    })
    .catch(err=>reject(err))
  })
}



/*
获取某帐号某token数量

@param account 帐号地址
@param contractAddr 合约地址

@return balance token余额
*/

/*TEST*/
// this.getBalance("0xe69f092d9b28ecb3b5500558e3931c2a47e18dd9",
// "0xa40ae7435c6a12c78b9260d5641fbb89e439f6bc")
// .then(ret=>console.log(ret))
// .catch(err=>console.log(err))
exports.getBalance = (account, contractAddr) => {
  return new Promise( (resolve, reject) => {
    ethrpc.unlock(account)
    .then( ()=>{
      var theContract = ethrpc.getRpc().eth.contract(ERC20ABI)
      var contractInstance = theContract.at(contractAddr)
      var balance = contractInstance.balanceOf(account);
      resolve(balance)
    })
    .catch(err=>reject(err))
  })
}





/*

*/
