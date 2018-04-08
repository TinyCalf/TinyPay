const Web3 = require("web3")
const config = require("../Config")

var web3 = new Web3(Web3.givenProvider || "ws://"+ config.ethereum.host + ":" + config.ethereum.wsport)


var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
  if (!error)
    console.log("error",error);
  else console.log("result", result)
})
.on("data", function(blockHeader){
  console.log("new block found")
  var blockNumber = blockHeader.number
  var blockHash = blockHeader.hash
  console.log(blockNumber,  blockHash)
})
.on("error", (err) => {
  console.log("err",err)
})



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
