/*******************************************************************************

                                   正式环境参数

*******************************************************************************/
const prod = {
  db: {
    host: "mongodb://localhost:27017/TinyPay",
  },
  apiv1: {
    port: 1990,
    whitelist: ["127.0.0.1"]
  },
  currencies: {
    /****************************比特币系列**************************************/
    btc: {
      category: 'bitcoin',
      protocol: "http",
      host: '127.0.0.1',
      port: '8332',
      user: 'ebo',
      pass: 'ebo123',
      coldwallet: "",
      maxStore: 1,
      txCheckDuration: 60 * 1000,
      incomeLimit: 0.00001, // 最小充值提现下限
      outcomeLimit: 10, // 最大提币上限
      confirmationsLimit: 10, // 交易确认数
    },

    /****************************比特币系列 私有链********************************/
    rbtc: {
      category: 'bitcoin',
      protocol: "http",
      host: '127.0.0.1',
      port: '8330',
      user: 'ebo',
      pass: 'ebo123',
      coldwallet: "",
      txCheckDuration: 10 * 1000, // 30s
      incomeLimit: 0.00001, // 最小充值提现下限JonQzjnN7LFX6KKaBkyBq46K8ac3q9NocV
      outcomeLimit: 10000, // 最大提币上限
      confirmationsLimit: 10, // 交易确认数
      env: 'prod',
    },

    /****************************以太坊系列**************************************/
    eth: {
      category: 'ethereum',
      protocol: "http",
      host: '127.0.0.1',
      port: '10070',
      coldwallet: "",
      maxStore: 6,
      txCheckDuration: 20 * 1000, // 20s
      incomeLimit: 0.001, // 最小充值下限
      outcomeLimit: 100, // 最大提币上限
      confirmationsLimit: 12, // 交易确认数
      //erc20:[
      //    {
      //    symbol:"PAY",
      //  contractAddress:"0xb97048628db6b661d4c2aa833e95dbe1a905b280",
      //   maxStore:800,
      // },
      // {
      //   symbol:"1ST",
      //   contractAddress:"0xaf30d2a7e90d7dc361c8c4585e9bb7d2f6f15bc7",
      //   maxStore:2000,
      //  }
      //  ]
    }
    /*****************************以太坊系列END**************************************/
  }
}


/*******************************************************************************

                                   开发环境参数

*******************************************************************************/
const dev = {
  db: {
    host: "mongodb://localhost:27017/bitgogogo_dev",
  },
  apiv1: {
    port: 1990,
    whitelist: ["127.0.0.1", "60.29.18.51", "120.92.192.219"]
  },
  currencies: {
    /****************************比特币系列**************************************/
    // btc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'8332',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"mnjuMNdaHm1DcyXFRzSGGVCnkRJxNZKz4D",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000, //5s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    // },
    // bch:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10081',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"musSjKh8ekjujD18hfkKkDMG7fjMy2AEuY",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000,
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    // },
    // ltc:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10000',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000,
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    // },
    // tch:{
    //   category:'bitcoin',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10010',
    // 	user:'ebo',
    // 	pass:'ebo123',
    //   coldwallet:"mviibohv6jVaFfbTp5Ur77WqhQiJEkN7Xa",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000,
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    // },
    // doge:{
    //   category:'bitcoin',
    //   protocol:"http",
    //   host:'127.0.0.1',
    //   port:'8532',
    //   user:'ebo',
    //   pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000,
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数
    // },
    // btg:{
    //   category:'bitcoin',
    //   protocol:"http",
    //   host:'127.0.0.1',
    //   port:'8432',
    //   user:'ebo',
    //   pass:'ebo123',
    //   coldwallet:"",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000,// 1min
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限    // eth:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10070',
    //   coldwallet:"0x738489ac06e9a9071fa7fc2098a0c4221f7834a9",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000, // 20s
    //   incomeLimit:0.00001,       // 最小充值下限
    //   outcomeLimit:10,     // 最大提币上限
    //   confirmationsLimit:10,   // 交易确认数
    //   confirmationsLimit:10, // 交易确认数
    // },

    /****************************以太坊系列**************************************/
    // etc:{
    //   category:'ethereum',
    // 	protocol:"http",
    // 	host:'127.0.0.1',
    // 	port:'10060',
    //   coldwallet:"0xf9c0f774ff2063f451a8abf2c65524ed16862624",
    //   maxStore:1,
    //   txCheckDuration: 5 * 1000,// 5s
    //   incomeLimit:0.00001, // 最小充值提现下限
    //   outcomeLimit:10, // 最大提币上限
    //   confirmationsLimit:10, // 交易确认数\
    // },
    eth: {
      category: 'ethereum',
      protocol: "http",
      host: '127.0.0.1',
      port: '10070',
      coldwallet: "0x738489ac06e9a9071fa7fc2098a0c4221f7834a9",
      maxStore: 1,
      txCheckDuration: 5 * 1000, // 20s
      incomeLimit: 0.00001, // 最小充值下限
      outcomeLimit: 10, // 最大提币上限
      confirmationsLimit: 10, // 交易确认数
      // erc20:[
      //   {
      //     symbol:"tinycalf",
      //     contractAddress:"0x6b6b298a5a7d71de1d534c8a54eb29d68a168f9b",
      //     maxStore:1,
      //   },
      // ]
    },

    rbtc: {
      category: 'bitcoin',
      protocol: "http",
      host: '127.0.0.1',
      port: '8330',
      user: 'ebo',
      pass: 'ebo123',
      coldwallet: "",
      maxStore: 50,
      txCheckDuration: 5 * 1000, // 30s
      incomeLimit: 0.00001, // 最小充值提现下限JonQzjnN7LFX6KKaBkyBq46K8ac3q9NocV
      outcomeLimit: 10000, // 最大提币上限
      confirmationsLimit: 10, // 交易确认数
      env: 'prod',
    },
    /**************************************************************************/
  }
}



/*
更换exports的内容来切换开发环境和正式环境
*/
module.exports = dev