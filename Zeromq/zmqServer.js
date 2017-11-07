const zmq = require('zmq')
const sock = zmq.socket('push')

sock.bindSync('tcp://127.0.0.1:1999')
console.log('Zmq server has been online.')

var num = 0 ;
setInterval(() => {
  sock.send("num is"+ num);
  console.log('now num is '+ num);
  num ++;
}, 1000);
