module.exports = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo",
  },
  apiv1:{
    port:1990,
    whitelist:["0.0.0.0"]
  },
  currencies:{
    /****************************比特币系列**************************************/
    // btc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'120.92.91.36',
    // 	port:'8332',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   txCheckDuration: 5 * 60 * 1000,// 5min
    //   env:'prod',
    // },
    // bcc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'120.92.91.36',
    // 	port:'10081',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   txCheckDuration: 2 * 60 * 1000,// 2min
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
    //  comfirmationsLimit:6 // 交易确认数
    //  env:'prod',
    // },
    rbtc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10084',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 1000, // 1sec
      outcomeLimit:1, // 最大提币上限
      comfirmationsLimit:6, // 交易确认数
      env:'test',
    },

    /****************************以太坊系列**************************************/
    etc:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'8546',
      mainAccount:'0xae75d8fd4eb3b47e41783437cb8d7f3d1bfed290',
      //主钱包地址，所有存在的交易将汇总到这里
      coldWalletAccount:'', //冷钱包地址，超过上限的币将打到这个地址
      mainLimit:10,         //主钱包存储上限
      txCheckDuration: 1000,//  2min
      outcomeLimit:100, // 最大提币上限
      incomeLimit:0.01, // 最小充值下限
      comfirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    eth:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'8545',
      mainAccount:'0xc1a897977ce8e0e821b573a0f27a256fb1fc1235',
      //主钱包地址，所有存在的交易将汇总到这里
      coldWalletAccount:'', //冷钱包地址，超过上限的币将打到这个地址
      mainLimit:10,         //主钱包存储上限
      txCheckDuration: 1000,// 2min
      outcomeLimit:100, // 最大提币上限
      incomeLimit:0.01, // 最小充值下限
      comfirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    // retc:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8546',
    //   mainAccount:'0xff7d1bbd14407128035a1e6a8287e4f2d74ce798',
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
    //   mainAccount:'0xc1a897977ce8e0e821b573a0f27a256fb1fc1235',
    //   //主钱包地址，所有存在的交易将汇总到这里
    //   coldWalletAccount:'', //冷钱包地址，超过上限的币将打到这个地址
    //   mainLimit:10,         //主钱包存储上限
    //   txCheckDuration: 2 * 60 * 1000,// 2min
    //   env:'prod',
    // },
    /**************************************************************************/
  }
}
