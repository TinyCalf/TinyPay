module.exports = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo",
  },
  apiv1:{
    port:1990,
    whitelist:["127.0.0.1","60.29.18.51","120.92.192.219"]
  },
  currencies:{
    /****************************比特币系列**************************************/
    btc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'8332',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 5 * 60 * 1000,// 5min
      incomeLimit:0.001, // 最小充值提现下限
      outcomeLimit:1, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    bcc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10081',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 0.5 * 60 * 1000,// 2min
      incomeLimit:0.01, // 最小充值提现下限
      outcomeLimit:10, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    ltc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10000',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 2 * 60 * 1000,// 2min
      incomeLimit:0.01, // 最小充值提现下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    utc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'1995',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 1 * 60 * 1000,// 1min
      incomeLimit:1, // 最小充值提现下限
      outcomeLimit:10000, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    tch:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10010',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 1 * 60 * 1000,// 1min
      incomeLimit:1, // 最小充值提现下限
      outcomeLimit:10000, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    /****************************比特币系列 私有链********************************/
    // rbtc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8330',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   txCheckDuration: 0.5 * 60 * 1000,// 30s
    //   incomeLimit:1, // 最小充值提现下限
    //   outcomeLimit:10000, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },

    /****************************以太坊系列**************************************/
    //TODO： 主钱包地址为数据库第一条，之后需要全部删除
    // etc:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10060',
    //   txCheckDuration: 1 * 60 * 1000,// 1min
    //   incomeLimit:1, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:6, // 交易确认数
    //   env:'prod',
    // },
    eth:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10070',
      txCheckDuration: 1 * 60 * 1000,//  1min
      incomeLimit:1, // 最小充值下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    /**************************************************************************/
  }
}
