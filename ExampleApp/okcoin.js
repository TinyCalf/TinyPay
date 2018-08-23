let request = require('request');


let ticker = {
  btc: {
    cny: "fetching...",
    usd: "fetching..."
  },
  eth: {
    cny: "fetching...",
    usd: "fetching..."
  }
}

let req = () => {
  request('https://www.okcoin.com/api/v1/ticker.do?symbol=btc_usd',
    (error, response, body) => {
      if (error) return
      let ret = JSON.parse(body)
      ticker.btc.usd = ret.ticker.last
      ticker.btc.cny = (ret.ticker.last / 0.15).toFixed(2)
    });

  request('https://www.okcoin.com/api/v1/ticker.do?symbol=eth_usd',
    (error, response, body) => {
      if (error) return
      let ret = JSON.parse(body)
      ticker.eth.usd = ret.ticker.last
      ticker.eth.cny = (ret.ticker.last / 0.15).toFixed(2)
    });
}

setInterval(req, 1000)

exports.getTicker = () => {
  return ticker
}