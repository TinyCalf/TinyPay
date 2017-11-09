// var log1 = require('./log.js')
// log1.setTag('block');
// var log2= require('./log.js')
// log2.setTag('txs');
//
// setInterval( ()=>{
//   log1.err('hahahha')
// } , 1000)
//
// setInterval( ()=>{
//   log2.warn('buyaoa ')
// } , 1000)

// var log  = require('./log.js').instance('block')
// var log1 = require('./log.js').instance('tx')

var log = require('./log.js')("fdas");
var log1 = require('./log.js')("block");

log.info("hahaha")
log1.err("shit!")
