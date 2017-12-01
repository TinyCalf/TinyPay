var Rpc = require("./Rpc")

var etc = new Rpc("etc")
etc.sendToMainAccount("0x739b6f3c2646afd8555b44f104d1093e229f2a50",0.0001)
.then(console.log)
.catch(console.log)

//
// var rpc = new Rpc("eth")
//
// rpc.post();
// rpc.get();
