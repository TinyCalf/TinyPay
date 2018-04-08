var yaml = require("js-yaml");
var fs = require("fs");
var path = require("path")
var load = (name)=>{
  var ymlpath = __dirname + '/' + name+".yml"
  // console.log(ymlpath)
  return yaml.load(fs.readFileSync(ymlpath));
}
var main = load("main")
module.exports = load(main.use)
