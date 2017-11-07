var zmq = require('zmq');
var bitcore = require('bitcore-lib');

var node = [];

var _initZmqSubSocket = function(node, zmqUrl) {
  node.zmqSubSocket = zmq.socket('sub');

  node.zmqSubSocket.on('connect', function(fd, endPoint) {
    console.log('ZMQ connected to:', endPoint);
  });

  node.zmqSubSocket.on('connect_delay', function(fd, endPoint) {
    console.log('ZMQ connection delay:', endPoint);
  });

  node.zmqSubSocket.on('disconnect', function(fd, endPoint) {
    console.log('ZMQ disconnect:', endPoint);
  });

  node.zmqSubSocket.on('monitor_error', function(err) {
    console.log('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
  });

  node.zmqSubSocket.monitor(500, 0);
  node.zmqSubSocket.connect(zmqUrl);
};

var _subscribeZmqEvents = function(node) {
  var self = this;
  // node.zmqSubSocket.subscribe('rawblock');
  node.zmqSubSocket.subscribe('rawtx');
  node.zmqSubSocket.on('message', function(topic, message) {
    var topicString = topic.toString('utf8');
    if (topicString === 'rawtx') {
      var hash = bitcore.crypto.Hash.sha256sha256(message);
      var txid = bitcore.util.buffer.reverse(hash).toString('hex');
      console.log(txid);
    } else if (topicString === 'rawblock') {

    }
  });
};

// var _zmqTransactionHandler = function(node, message) {
//   var self = this;
//   var hash = bitcore.crypto.Hash.sha256sha256(message);
//   var id = hash.toString('binary');
//   if (!self.zmqKnownTransactions.get(id)) {
//     self.zmqKnownTransactions.set(id, true);
//     self.emit('tx', message);
//
//     // Notify transaction subscribers
//     for (var i = 0; i < this.subscriptions.rawtransaction.length; i++) {
//       this.subscriptions.rawtransaction[i].emit('bitcoind/rawtransaction', message.toString('hex'));
//     }
//
//     var tx = bitcore.Transaction();
//     tx.fromString(message);
//     var txid = bitcore.util.buffer.reverse(hash).toString('hex');
//     self._notifyAddressTxidSubscribers(txid, tx);
//
//   }
// };

//_zmqBlockHandler
//_zmqTransactionHandler


_initZmqSubSocket(node, 'tcp://127.0.0.1:28332');
_subscribeZmqEvents(node);
