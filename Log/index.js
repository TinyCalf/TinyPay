const chalk = require('chalk');
const config = require('../Config')
const db = require("./db")

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt
    .replace(RegExp.$1, (this.getFullYear() + "")
    .substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt))
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

const _getFullTime = () => {
  return new Date().Format("yyyy-MM-dd hh:mm:ss");
}

var _console = (date, tag ,type , msg) => {
  var colortype = ""
  var date = chalk.blue("[" + date + "]")
  var tag = chalk.magenta.bold(tag)
  switch(type) {
    case 'INFO':  colortype =chalk.blueBright(type); break;
    case 'ERROR':   colortype =chalk.redBright(type); break;
    case 'SUCCESS': colortype =chalk.greenBright(type); break;
    default:      return;
  }
  if(type == "ERROR") {
    if(msg instanceof Error) {
      console.log(date, colortype, msg.message)
      console.log(msg.stack)
    }else{
      console.log(date, tag, colortype, msg)
    }
  }else{
    console.log(date, tag, colortype, msg)
  }
}

var _dbInsert = (date, tag, type, msg) => {
  if(msg instanceof Error) {
    db.append(tag, type, msg.message + '\n' + msg.stack, date).then().catch()
  } else if(type=="SUCCESS") {
    db.append(tag, type, msg, date).then().catch()
  }
}

var _print = (tag, type, msg) => {
  var date = _getFullTime()
  _console(date, tag ,type , msg)
  _dbInsert(date, tag ,type , msg)
}


module.exports = (tag) => {
  return {
    info:(msg) => _print(tag, 'INFO', msg),
    err:(msg) => _print(tag, 'ERROR', msg),
    success:(msg) => _print(tag, 'SUCCESS', msg),
  };
}
