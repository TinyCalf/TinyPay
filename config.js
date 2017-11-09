module.exports = {
  db:{
    host: "mongodb://localhost:27017/bitgogogo",
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
}
