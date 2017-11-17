const chalk = require('chalk');
var fs = require('fs');
var path = require('path');

module.exports = (tag) => {
  return {
    info:(msg) => _print(tag, 'info', msg),
    err:(msg) => _print(tag, 'err', msg),
    warn:(msg) => _print(tag, 'warn', msg),
    print:(msg) => _print(tag, 'print', msg)
  };
}

/*
时间格式化
*/
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
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/*
获取时间
*/
const _getYMD = () => {
  return new Date().Format("yyyy-MM-dd");
}

const _getHMS = () => {
  return new Date().Format("hh:mm:ss");
}

const _getFullTime = () => {
  return new Date().Format("yyyy-MM-dd hh:mm:ss");
}

/*
记录到日志中
*/
var _log = function(msg){
	var date = _getYMD();
  // TODO 文件路径做成输入指定
  fs.appendFile(path.resolve('./') + "/Logs/files/" + date + ".log", msg + "\n", null ,(error) => { /* handle error */ });

}

/*
输出并打印 type = info | warn | err
*/
var _print = (tag, type=null, msg) => {
  var time = '[' + _getHMS() + ']';
  type = type.toUpperCase();
  var colortype = "";
  switch(type) {
    case 'INFO':  colortype =chalk.blueBright(type); break;
    case 'ERR':   colortype =chalk.redBright(type); break;
    case 'WARN':  colortype =chalk.yellowBright(type); break;
    default:      {_log(msg);console.log(msg);return;}
  }
  var fulllog = time + " " + tag + " " + type + " ";
  var colorlog = chalk.blue(time) + " "
    + chalk.magenta.bold(tag) + " "
    + colortype + " ";
  if(type!="ERR"){
    _log(fulllog + msg);
    console.log(colorlog + msg);
  } else if ( type=="ERR" ) {
    _log(fulllog)
    _log(msg.toString())
    console.log(colorlog)
    console.log(msg)
  }
  return;
}
