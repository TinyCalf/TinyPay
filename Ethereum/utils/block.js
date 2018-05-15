require("./log")
var web3 = require("./web3")
var Event = require("events")


/*
emit when a new block is found

EXAMPLE
var block = require("Block")
block.newBlock.on('newblock', (blockHeader) => {
  {
  hash: '0xf406f9cecd53be021970098cf6145ad62f93ff889e28d42950a94da612f36dad',,
  number: 3104162,
  }
});
*/
var newBlockEmitter = new Event()
exports.newBlock = newBlockEmitter

/*
get block by number or hash
*/
exports.getBlock = (block) => { return web3().eth.getBlock(block) }

/*
get current height
*/
exports.getCurrentHeight = new Function()



var blockNumber = 0
var updateBlockHeight = () =>{
  web3().eth.getBlockNumber()
  .then(ret=>{
    blockNumber=ret
    console.info(`current height changed to ${blockNumber}`)
  })
  .catch(err=>{
    console.error(err)
  })
}
updateBlockHeight()

this.getCurrentHeight = () => {
  return new Promise ((resolve, reject)=>{
    if(blockNumber==0){
      web3().eth.getBlockNumber()
      .then(ret=>{
        resolve(ret)
      })
      .catch(err=>reject(err))
    }
    else resolve(blockNumber)
  })
}


/*
start to subscript new block. once found, emit Event
run when is required
*/
var _startToSubscriptNewBlock = () => {
  console.info("start to subscript new block")
  var subscription = web3().eth.subscribe(
    'newBlockHeaders',
    function(error, result)
  {
    if (error) console.err(error)
  })
  .on("data", function(blockHeader){
    console.info(`find new block ${blockHeader.number}`)
    newBlockEmitter.emit("newblock", blockHeader)
    updateBlockHeight()
  })
}
_startToSubscriptNewBlock()
