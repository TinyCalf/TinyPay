module.exports = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo",
  },
  apiv1:{
    port:1990,
    whitelist:["0.0.0.0"]
  },
  currencies:{
    btc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'8332',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 5 * 60 * 1000,// 5min
      env:'prod',
    },
    bcc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10081',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 2 * 60 * 1000,// 2min
      env:'prod',
    },
    ltc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10000',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 2 * 60 * 1000,// 2min
      env:'prod',
    },
    rbtc:{
      category:'bitcoin',
    	protocol:"http",
    	host:'120.92.91.36',
    	port:'10084',
    	user:'ebo',
    	pass:'ebo123',
      txCheckDuration: 1000,// 1sec
      env:'test',
    },
    etc:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'8546',
    	user:'',
    	pass:'',
      txCheckDuration: 2 * 60 * 1000,//  2min
      env:'prod',
    },
    eth:{
      category:'ethereum',
    	protocol:"http",
    	host:'127.0.0.1',
    	port:'8545',
    	user:'',
    	pass:'',
      txCheckDuration: 2 * 60 * 1000,// 2min
      env:'prod',
    },

  }
}
