const zmq = require('zmq')
//const sock = zmq.socket('push')

var ports = [1999, 2999]

var socks = new Array()
ports.forEach((p) => {
  socks.push(zmq.socket('push').bindSync('tcp://0.0.0.0:'+String(p)))
})

var log = require('../Logs/log.js')("ZMQ")
log.info('Zmq server has bound on ports ' + ports)

/*
发送接受到的交易信息
*/
exports.sendReceivedTxs = (msg) => {
  return new Promise ( (resolve, reject) => {
    socks.forEach((sock) => {
      sock.send( JSON.stringify(msg) );
    })
    log.info("zmq sent msg: " + JSON.stringify(msg))
    resolve();
  })
}
