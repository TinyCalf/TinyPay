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
    //   protocol:"http",
    //   host:'127.0.0.1',
    //   port:'8332',
    //   user:'ebo',
    //   pass:'ebo123',
    //   coldwallet:"mwzq3m7dexveMYZjW1w4163yys7X4K3tCn",
    //   maxStore:0.2,
    //   txCheckDuration: 1 * 60 * 1000,// 1min
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    bch:{
      category:'bitcoin',
      protocol:"http",
      host:'127.0.0.1',
      port:'10081',
      user:'ebo',
      pass:'ebo123',
      coldwallet:"n2cqkqmG5rCfnxMjG2AuXJmg1NnLm9bC2V",
      maxStore:5,
      txCheckDuration: 0.5 * 60 * 1000,// 30s
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
      coldwallet:"",
      maxStore:10000,
      txCheckDuration: 30 * 1000,// 30s
      incomeLimit:0.001, // 最小充值提现下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:10, // 交易确认数
      env:'prod',
    },
    utc:{
      category:'bitcoin',
      protocol:"http",
      host:'127.0.0.1',
      port:'1995',
      user:'ebo',
      pass:'ebo123',
      coldwallet:"",
      maxStore:10000,
      txCheckDuration: 1 * 60 * 1000,// 1min
      incomeLimit:0.00001, // 最小充值提现下限
      outcomeLimit:10000, // 最大提币上限
      confirmationsLimit:6, // 交易确认数
      env:'prod',
    },
    // tch:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10010',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:10000,
    //   txCheckDuration: 10 * 1000,// 10s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10000, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    // },
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
    //   maxStore:2,
    //   incomeLimit:0.001, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    // },
    eth:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10070',
      coldwallet:"",
      txCheckDuration: 20 * 1000,// 20s
      maxStore:2,
      incomeLimit:0.001, // 最小充值下限
      outcomeLimit:100, // 最大提币上限
      confirmationsLimit:12, // 交易确认数
      erc20:[
        {
          symbol:"PAY",
          contractAddress:"0xb97048628db6b661d4c2aa833e95dbe1a905b280",
          maxStore:800,
        },
        {
          symbol:"1ST",
          contractAddress:"0xaf30d2a7e90d7dc361c8c4585e9bb7d2f6f15bc7",
          maxStore:2000,
        }
      ]
    },
    /*****************************以太坊系列END**************************************/
  }
}


/*******************************************************************************

                                   开发环境参数

*******************************************************************************/
const dev = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo_dev",
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
    //   coldwallet:"",
    //   maxStore:0.2,
    //   txCheckDuration: 5 * 1000, //5s
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
    //   maxStore:0.2,
    //   txCheckDuration: 5 * 1000,
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
    //   maxStore:0.2,
    //   txCheckDuration: 5 * 1000,// 5s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
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
    //   maxStore:0.2,
    //   txCheckDuration: 5 * 1000,// 5s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10000, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数balance
    //   env:'prod',
    // },

    /****************************以太坊系列**************************************/
    // etc:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10060',
    //   coldwallet:"0xecf6e8cbb8633a3c490d587fa357ad20e21d4b93",
    //   txCheckDuration: 5 * 1000,// 20s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:100, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    eth:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'10070',
      coldwallet:"0xa3bc33f5889547e79a204b5ada9d8e197292a171",
      txCheckDuration: 20 * 1000, // 20s
      maxStore:800,
      incomeLimit:0.00001,       // 最小充值下限
      outcomeLimit:100,
      incomeLimit:3,       // 最大提币上限
      confirmationsLimit:10,   // 交易确认数
      erc20:[
        {
          symbol:"tinycalf",
          contractAddress:"0x6b6b298a5a7d71de1d534c8a54eb29d68a168f9b",
          maxStore:800,
        },
      ]
    },

    // rbtc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8330',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"msYVkZgGZs4nhuXWst8Baf3zggdr3KbAkt",
    //   maxStore:50,
    //   txCheckDuration: 5 * 1000,// 30s
    //   incomeLimit:0.00001, // 最小充值提现下限JonQzjnN7LFX6KKaBkyBq46K8ac3q9NocV
    //   outcomeLimit:10000, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    //   env:'prod',
    // },
    /**************************************************************************/
  }
}



/*
更换exports的内容来切换开发环境和正式环境
*/
module.exports = prod
