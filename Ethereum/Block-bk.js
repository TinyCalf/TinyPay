const Web3 = require("web3")
const config = require("../Config")
var web3 = new Web3(Web3.givenProvider || "ws://"+ config.ethereum.host + ":" + config.ethereum.wsport)
var log = require("../Log")("Ethereum/Block")
var blockdb = require("./Database/EthereumBlock.db")

/*
check the hash of one block.
if not wrong , update comformations of releated txs.
*/



/*
start to subscript new block. once found, save into database
*/
var startToSubscriptNewBlock = () => {
  log.success("start to subscript new block")
  var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (error) log.err(error)
  })
  .on("data", function(blockHeader){
    var blockNumber = blockHeader.number
    var blockHash = blockHeader.hash
    log.success(`new block discovered ${blockNumber}, ${blockHash}`)
    web3.eth.getBlock(blockNumber)
    .then(ret=>{
      return blockdb.insert({
        number:blockNumber,
        hash: blockHash,
        txids:ret.transactions
      })
    })
    .then(ret=>{
      log.success(`added block ${blockNumber} into database`)
    })
    .catch(err=>log.err(err))
  })
}
exports.startToSubscriptNewBlock = startToSubscriptNewBlock


// var subscription = web3.eth.subscribe('logs', {
//     fromBlock:"0x" + (30000).toString(16),
//     // toBlock:"0x" + (38630).toString(16),
// }, function(error, result){
//     if (!error)
//         console.log(result);
// })
// .on("data", function(log){
//     console.log(log);
// })
// .on("changed", function(log){
// });

var subscription = web3.eth.subscribe('pendingTransactions', function(error, result){
    if (!error)
        console.log(result);
})
.on("data", function(transaction){
    console.log(transaction);
});



// web3.eth.subscribe('logs',{
//     fromBlock:"0x" + (30000).toString(16),
//     // toBlock:"0x" + (38630).toString(16),
//     // topics:[null],
//     address: ["0x738489ac06e9a9071fa7fc2098a0c4221f7834a9", "0x6178076b384a3a1fd04608977c0cdca92d41bf45"]
// },function(error, result){
//     if (!error)
//         console.log(result);
//     else console.log(error)
// })
// .on("data", function(log){
//     console.log(log);
// })
// .on("changed", function(log){
//   console.log(log)
// });
//
// var addresses = web3.eth.accounts
// console.log(addresses)
// var filter = web3.eth.filter({
//   fromBlock:0,
//   toBlock:38610,
//   address:["0x6178076b384a3a1fd04608977c0cdca92d41bf45","0xc3d8b4569d3affb2e9cbe511b244978bd1c824d6"]
// })

//
//
//
// var filter1 = web3.eth.filter("latest--wsorigins")
//
// filter.get( function(err, ret){
//   if(err) return console.log(err)
//   console.log(ret.length)
// })

// var subscription = web3.eth.subscribe('logs', {
//     // fromBlock:38000
//     // address: ["0x6178076b384a3a1fd04608977c0cdca92d41bf45","0xc3d8b4569d3affb2e9cbe511b244978bd1c824d6"],
// }, function(error, result){
// console.log(error)
//     if (!error)
//
//         console.log('res',result);
// })
// .on("data", function(log){
//     console.log(log);
// })
// .on("changed", function(log){
// });

// filter.watch( (err, ret) => {
//   if(err) return console.log(err)
//   console.log(ret)
// })


//

//
// // Additionally you can start watching right away, by passing a callback:
// web3.eth.filter(options, function(error, result){
//   if (!error)
//     console.log(result);
// });
