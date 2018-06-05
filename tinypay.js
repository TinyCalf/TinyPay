console.log(`
   _______             ____
 /_  __(_)___  __  __/ __ \\____ ___  __
  / / / / __ \\/ / / / /_/ / __ \`/ / / /
 / / / / / / / /_/ / ____/ /_/ / /_/ /
/_/ /_/_/ /_/\\__, /_/    \\__,_/\\__, /
            /____/            /____/

Digital Currencies Pay - Powered by tiny-calf.com`)


var config = require("./Config")

if(config.ethereum.disable != true)
  var Ethereum = require("./Ethereum")

if(config.btc.disable != true)
  var Bitcoin = require("./Bitcoin")
  
var www = require("./www")
