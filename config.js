module.exports = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo",
  },
  apiv1:{
    port:1990,
    whitelist:["127.0.0.1","60.29.18.51"]
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
      env:'prod',
    },
    // bcc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'1996',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   txCheckDuration: 2 * 60 * 1000,// 2min
    //   confirmationsLimit:6, // 交易确认数
    //   env:'prod',
    // },
    // ltc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'120.92.91.36',
    // 	port:'10000',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //  txCheckDuration: 2 * 60 * 1000,// 2min
    //  outcomeLimit:1, // 最大提币上限
    //  confirmationsLimit:6 // 交易确认数
    //  env:'prod',
    // },
    rbtc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10084',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 1000, // 1sec 新交易查询间隔，如果是测试币就设置低一点
      incomeLimit:0.01, // 最小充值提现下限
      outcomeLimit:1, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'test',
    },

    /****************************以太坊系列**************************************/
    //TODO： 主钱包地址为数据库第一条，之后需要全部删除
    // etc:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8546',
    //   //coldWalletAccount:'', //冷钱包地址，超过上限的币将打到这个地址
    //   //mainLimit:10,         //主钱包存储上限
    //   txCheckDuration: 1000,//  2min
    //   incomeLimit:1, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:6, // 交易确认数
    //   env:'test',
    // },
    // eth:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8545',
    //   //主钱包地址，所有存在的交易将汇总到这里
    //   coldWalletAccount:'', //冷钱包地址，超过上限的币将打到这个地址
    //   mainLimit:10,         //主钱包存储上限
    //   txCheckDuration: 1000,// 2min
    //   outcomeLimit:100, // 最大提币上限
    //   incomeLimit:0.01, // 最小充值下限
    //   confirmationsLimit:6, // 交易确认数
    //   env:'prod',
    // },
    // retc:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8546',
    //   //主钱包地址，所有存在的交易将汇总到这里
    //   coldWalletAccount:'', //冷钱包地址，超过上限的币将打到这个地址
    //   mainLimit:10,         //主钱包存储上限
    //   txCheckDuration: 2 * 60 * 1000,//  2min
    //   env:'prod',
    // },
    // reth:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8545',
    //   //主钱包地址，所有存在的交易将汇总到这里
    //   coldWalletAccount:'', //冷钱包地址，超过上限的币将打到这个地址
    //   mainLimit:10,         //主钱包存储上限
    //   txCheckDuration: 2 * 60 * 1000,// 2min
    //   env:'prod',
    // },
    /**************************************************************************/
  }
}
