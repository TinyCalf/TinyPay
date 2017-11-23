// subber.js
var zmq = require('zmq')
  , sock = zmq.socket('pull');

sock.connect('tcp://120.92.192.127:1999');
console.log('Subscriber connected to port 1999');

sock.on('message', function(message) {
  message = message.toString();
  console.log(message);
});
