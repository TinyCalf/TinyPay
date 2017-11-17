const zmq = require('zmq')
const sock = zmq.socket('push')

sock.bindSync('tcp://0.0.0.0:1999')


var log = require('../Logs/log.js')("ZMQ")
log.info('Zmq server has bound on port 1999')
/*
发送接受到的交易信息
*/
exports.sendReceivedTxs = (msg) => {
  return new Promise ( (resolve, reject) => {
    sock.send( JSON.stringify(msg) );
    log.info("zmq sent msg: " + JSON.stringify(msg))
    resolve();
  })
}
