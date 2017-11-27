var Rpc = require("./Rpc")

var etc = new Rpc("etc")
etc.getMainAccount()
.then(ret => console.log(ret))
.catch(err => console.log(err))

//
// var rpc = new Rpc("eth")
//
// rpc.post();
// rpc.get();
