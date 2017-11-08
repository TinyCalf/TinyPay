const zmq = require('zmq')
const sock = zmq.socket('push')

sock.bindSync('tcp://127.0.0.1:1999')
console.log('Zmq server has bound on port 1999')


/*
发送接受到的交易信息
*/
exports.sendReceivedTxs = (msg) => {
  return new Promise ( (resolve, reject) => {
    sock.send(['receivedTxs',msg]);
    console.log('sent msg '+ JSON.stringify(msg));
    resolve();
  })
}
