var eth = require("./EthereumSeries/demo.js");

eth.getBlock(48, (err, ret) => {
  console.log(err);
  console.log(ret);
});
