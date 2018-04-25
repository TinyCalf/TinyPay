require("../log")
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
exports.getBlock = (block) => { return web3.eth.getBlock(block) }


/*
start to subscript new block. once found, emit Event
run when is required
*/
var _startToSubscriptNewBlock = () => {
  console.info("start to subscript new block")
  var subscription = web3.eth.subscribe(
    'newBlockHeaders',
    function(error, result)
  {
    if (error) console.err(error)
  })
  .on("data", function(blockHeader){
    newBlockEmitter.emit("newblock", blockHeader)
  })
}
_startToSubscriptNewBlock()
