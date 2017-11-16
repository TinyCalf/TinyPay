module.exports = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo",
  },
  apiv1:{
    port:1990,
    whitelist:["0.0.0.0"]
  },
  BitcoinSeries: [
    {
      name:'btc',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'8332',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 5 * 60 * 1000,// 5min
      category:'prod',
    },
    {
      name:'bcc',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10081',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 2 * 60 * 1000,// 2min
      category:'prod',
    },
    {
      name:'ltc',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10000',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 2 * 60 * 1000,// 2min
      category:'prod',
    },
    {
      name:'rbtc',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10084',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 1000,// 1sec
      category:'test',
    }
  ],
  currencies:[
    {
      name:'btc',
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'8332',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 5 * 60 * 1000,// 5min
      env:'prod',
    },
    {
      name:'bcc',
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10081',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 2 * 60 * 1000,// 2min
      env:'prod',
    },
    {
      name:'ltc',
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10000',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 2 * 60 * 1000,// 2min
      env:'prod',
    },
    {
      name:'rbtc',
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10084',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 1000,// 1sec
      env:'test',
    },
    {
      name:'eth',
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'8545',
    	user:'',
    	pass:'',
      txCheckDuration: 1000,// 1sec
      env:'prod',
    },
    {
      name:'etc',
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'8546',
    	user:'',
    	pass:'',
      txCheckDuration: 1000,// 1sec
      env:'prod',
    }
  ]
}
