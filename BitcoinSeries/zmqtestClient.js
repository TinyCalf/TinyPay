const zmq = require('zmq')
const sock = zmq.socket('pull')

sock.connect("tcp://127.0.0.1:1999");
console.log('Worker connected to port 1999')

sock.on('message', (msg) => {
    console.log(msg.toString());
});
