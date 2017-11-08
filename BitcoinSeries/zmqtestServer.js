const zmq = require('zmq')
const sock = zmq.socket('push')

sock.bindSync('tcp://127.0.0.1:1999')
console.log('Producer bound to port 1999')

var num = 0 ;
setInterval(() => {
  sock.send(['txs',"num is"+ num]);
  console.log('now num is '+ num);
  num ++;
}, 100);
