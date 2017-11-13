var zmq = require('zmq')
  , sock = zmq.socket('pub');

sock.bindSync('tcp://127.0.0.1:3000');
console.log('Publisher bound to port 3000');

var count = 0

setInterval(function(){
  console.log('send ' + count);
  sock.send(['tx', count]);
  count++
}, 500);
