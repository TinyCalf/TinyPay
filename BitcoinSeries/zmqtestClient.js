const zmq = require('zmq')
const sock = zmq.socket('pull')

sock.connect("tcp://120.92.91.36:1999");
console.log('Worker connected to port 1999')

sock.on('message', (msg) => {
    console.log(msg.toString());
});
