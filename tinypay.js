const VERSION = "V0.9.0"

console.log(`
   _______             ____
 /_  __(_)___  __  __/ __ \\____ ___  __
  / / / / __ \\/ / / / /_/ / __ \`/ / / /
 / / / / / / / /_/ / ____/ /_/ / /_/ /
/_/ /_/_/ /_/\\__, /_/    \\__,_/\\__, /
            /____/            /____/ ${VERSION}

Digital Currencies Payment System - Powered by tiny-calf.com`)

let program = require('commander')
program
  .version(VERSION)
  .usage(`--config ./prod.yml --daemon`)
  .option(`-c, --config [config]`, `path of yml config file`)
  .option(`-d, --daemon`, `start process using daemon`)
  .option(`-o, --output [output]`, `path of your output file`)
  .parse(process.argv)


let daemon = program.daemon || false
let output = program.output || "./tinypay.log"

let config = require('./config.js')
config.setPath(program.config)