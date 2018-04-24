var logger = require("tinycalf-logger")

logger.init({
  mongodb:"mongodb://localhost:27017/kingdapp",
  // email:{
  //   smtp:{
  //     host: 'smtp.exmail.qq.com',
  //     port: 465,
  //     secure: true,
  //     auth: {
  //       user: 'zhujiasheng@h5edu.cn',
  //       pass: 'Zjs1993'
  //     }
  //   },
  //   from: "My project", //'"Bitgogogo by TinyCalf" <zhujiasheng@h5edu.cn>'
  //   receivers:["839560084@qq.com"]
  // },
})
