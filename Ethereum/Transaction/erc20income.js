require("../../log")
var fs = require("fs")
var path = require("path")
var web3 = require("../web3")
var config = require("../../Config")
var account = require("../Account")

var abi = JSON.parse(
  fs.readFileSync(__dirname + "/erc20.abi").toString())
var kingInstance = new web3.eth.Contract(abi, config.king.contractAddress)
var contractInstances = {
  king: kingInstance
}

/*
EXAMPLE
_getTransactions("king",0,"latest").then(console.log).catch(console.log)
RETURN
[ { blockHash: '0xed5bbfea73ca999e1d983eb1a241a7479dbf7fc06b6875f63f7c5c4df242cf2d',
    blockNumber: 3104400,
    transactionHash: '0x093304f1f54332cd1fa3ffd6bea38c8d30e9a50ff624eb623724894ddac8a4e6',
    transactionIndex: 0,
    from: '0x53565FEbe212Fc43392Fdf01aE19CCd3d492695A',
    to: '0x853187De87527E3dd9d9887Ee9FaB5D3cb4965B1',
    value: '1000000000000000000000' } ,...]

*/
var _getTransactions = (alias, fromBlock, toBlock) =>{
  return new Promise ( (resolve, reject) => {
    account.getAddressesByAlias(alias)
    .then(addresses=>{
      contractInstances[alias].getPastEvents('Transfer',{
        filter:{to:addresses},
        fromBlock:fromBlock,
        toBlock: toBlock
      }, function(error, data){
        if(error) return reject(error)
        var result = []
        data.forEach( t=>{
          var res = {
            blockHash: t.blockHash,
            blockNumber: t.blockNumber,
            transactionHash: t.transactionHash,
            transactionIndex: t.transactionIndex,
            from: t.returnValues.from,
            to: t.returnValues.to,
            value : t.returnValues.value
          }
          result.push(res)
        })
        resolve(result)
      })
    })
    .catch(err=>reject(err))
  })
}
