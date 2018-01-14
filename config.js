/*******************************************************************************

                                   正式环境参数

*******************************************************************************/
const prod = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo",
  },
  apiv1:{
    port:1990,
    whitelist:["127.0.0.1","60.29.18.51","120.92.192.219"]
  },
  currencies:{
    /****************************比特币系列**************************************/
    // btc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8332',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"", //这里不填则不会往外面转，填写的话到达maxStore的数量就会往外面转
    //   maxStore:0.2,
    //   defaultfee:0.01, //冷钱包转出的时候余额减去这个数转出，保证足够的矿工费
    //   txCheckDuration: 1 * 60 * 1000,// 1min
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    // bch:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10081',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:5,
    //   defaultfee:0.1,
    //   txCheckDuration: 0.5 * 60 * 1000,// 30s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    // ltc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10000',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:10,
    //   defaultfee:0.1,
    //   txCheckDuration: 30 * 1000,// 30s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    // utc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'1995',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   txCheckDuration: 1 * 60 * 1000,// 1min
    //   incomeLimit:1, // 最小充值提现下限
    //   outcomeLimit:10000, // 最大提币上限
    //   confirmationsLimit:6, // 交易确认数
    //   env:'prod',
    // },
    // tch:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10010',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:10,
    //   defaultfee:0.1,
    //   txCheckDuration: 10 * 1000,// 10s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10000, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    doge:{
      category:'bitcoin',
      protocol:"http",
      host:'127.0.0.1',
      port:'8532',
      user:'ebo',
      pass:'ebo123',
      coldwallet:"njWa4FauCDaDzVg64y4cNuMHqDt3hFqBN5",
      maxStore:1000,
      defaultfee:1,
      txCheckDuration: 30 * 1000,// 30s
      incomeLimit:0.001, // 最小充值提现下限
      outcomeLimit:1, // 最大提币上限
      confirmationsLimit:10, // 交易确认数
      env:'prod'
    },
    // btg:{
    //   category:'bitcoin',
    //   protocol:"http",
    //   host:'127.0.0.1',
    //   port:'8432',
    //   user:'ebo',
    //   pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:100,
    //   defaultfee:0.1,
    //   txCheckDuration: 30 * 1000,// 30s
    //   incomeLimit:0.001, // 最小充值提现下限
    //   outcomeLimit:1, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod'
    // }

    /****************************比特币系列 私有链********************************/
    // rbtc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8330',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"",
    //   txCheckDuration: 0.5 * 60 * 1000,// 30s
    //   incomeLimit:0.00001, // 最小充值提现下限JonQzjnN7LFX6KKaBkyBq46K8ac3q9NocV
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
    //   coldwallet:"",
    //   txCheckDuration: 20 * 1000,// 20s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    // eth:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10070',
    //   coldwallet:"",
    //   txCheckDuration: 20 * 1000,// 20s
    //   incomeLimit:0.00001, // 最小充值下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    /**************************************************************************/
  }
}


/*******************************************************************************

                                   开发环境参数

*******************************************************************************/
const dev = {
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
      txCheckDuration: 5 * 1000, //5s
      incomeLimit:0.00001, // 最小充值提现下限
      outcomeLimit:10, // 最大提币上限
      confirmationsLimit:10, // 交易确认数
      env:'prod',
    },
    bch:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10081',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 5 * 1000,
      incomeLimit:0.00001, // 最小充值提现下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:10, // 交易确认数
      env:'prod',
    },
    ltc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10000',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 5 * 1000,// 5s
      incomeLimit:0.00001, // 最小充值提现下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:10, // 交易确认数
      env:'prod',
    },
    tch:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10010',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 5 * 1000,// 5s
      incomeLimit:0.00001, // 最小充值提现下限
      outcomeLimit:10000, // 最大提币上限
      confirmationsLimit:10, // 交易确认数balance
      env:'prod',
    },
    doge:{
      category:'bitcoin',
      protocol:"http",
      host:'127.0.0.1',
      port:'8532',
      user:'ebo',
      pass:'ebo123',
      txCheckDuration: 5 * 60 * 1000,// 5min
      incomeLimit:0.001, // 最小充值提现下限
      outcomeLimit:1, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod'
    },
    btg:{
      category:'bitcoin',
      protocol:"http",
      host:'127.0.0.1',
      port:'8432',
      user:'ebo',
      pass:'ebo123',
      txCheckDuration: 5 * 60 * 1000,// 5min
      incomeLimit:0.001, // 最小充值提现下限
      outcomeLimit:1, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod'
    },

    /****************************以太坊系列**************************************/
    etc:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10060',
      coldwallet:"",
      txCheckDuration: 5 * 1000,// 20s
      incomeLimit:0.00001, // 最小充值提现下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:10, // 交易确认数
      env:'prod',
    },
    eth:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10070',
      coldwallet:"",
      txCheckDuration: 20 * 1000,// 20s
      incomeLimit:0.00001, // 最小充值下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:10, // 交易确认数
      env:'prod',
    },
    /**************************************************************************/
  }
}



/*
更换exports的内容来切换开发环境和正式环境
*/
module.exports = prod
