// subber.js
var zmq = require('zmq')
  , sock = zmq.socket('sub');

// Create a socket

// Register to monitoring events
sock.on('connect',       function(fd, ep) {console.log('connect, endpoint:', ep);});
sock.on('connect_delay', function(fd, ep) {console.log('connect_delay, endpoint:', ep);});
sock.on('connect_retry', function(fd, ep) {console.log('connect_retry, endpoint:', ep);});
sock.on('listen',        function(fd, ep) {console.log('listen, endpoint:', ep);});
sock.on('bind_error',    function(fd, ep) {console.log('bind_error, endpoint:', ep);});
sock.on('accept',        function(fd, ep) {console.log('accept, endpoint:', ep);});
sock.on('accept_error',  function(fd, ep) {console.log('accept_error, endpoint:', ep);});
sock.on('close',         function(fd, ep) {console.log('close, endpoint:', ep);});
sock.on('close_error',   function(fd, ep) {console.log('close_error, endpoint:', ep);});
sock.on('disconnect',    function(fd, ep) {console.log('disconnect, endpoint:', ep);});

// Handle monitor error
sock.on('monitor_error', function(err) {
    console.log('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
    setTimeout(function() { socket.monitor(500, 0); }, 5000);
});

// Call monitor, check for events every 500ms and get all available events.
console.log('Start monitoring...');
sock.monitor(500, 0);
sock.connect('tcp://127.0.0.1:3000');

setTimeout(function() {
    console.log('Stop the monitoring...');
    sock.unmonitor();
}, 20000);


sock.subscribe('tx');
console.log('Subscriber connected to port 3000');

sock.on('message', function(topic, message) {
  topic = topic.toString();
  message = message.toString();
  console.log('received a message related to:', topic, 'containing message:', message);
});
