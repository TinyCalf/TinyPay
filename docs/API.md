# Bitgogogo API 文档初稿

> 目前API功能尚未开发完成，本文档预先制定基本API，上线后会有较大变动

***

## 获取地址

#### METHOD: POST
#### URL: http://bitgogogo.com/api/v1/getaddress
#### PARAMS :
* currency (String 货币名称，目前包括 btc / ltc / bcc / eth /etc )

#### EXSAMPLE

```bash
curl -X POST --data '{"currency":"btc"}' http://bitgogogo.com/api/v1/getaddress
```

#### RESPONSE

```bash
{"err":null,"msg":"1CQaJB4WvbLdD8eSe6ZrvXX4KkAELEJy7J"}
```

***

## 充值
充值完成的信息由第三方消息队列系统提供

#### RESPONSE

* txid (交易id，需要记录用于查询确认数)
* to (本次交易目标地址，该地址应该为曾从getaddress方法获取并记录的地址，用于标记该地址输入某一用户)
* amount (货币数量)

```bash
{
  "txid":"8f559cd6554956bc631026f904df4c9cb7aad8d8c14f4a3ed1d9c8f0cb19be82",
  "to":"34otGUJWrgcdL1ny5u2DYxAh9dCJBjBLbN",
  "amount":8000000
}
```

***

## 提现

#### COMMENT
对于提币上限本接口有固定限制，不同用户身份的不同每日上限由接入方自行完成

#### METHOD: POST
#### URL: http://bitgogogo.com/api/v1/withdraw
#### PARAMS :
* currency  (String 货币名称，目前包括 btc / ltc / bcc / eth /etc )
* amount    (String 数量，以货币最小单位为单位，1BTC 即 100000000bit)
* from      (String 本地用户地址，因从getaddress方法中获取并记录)
* to        (String 用户提供的目标地址)


#### EXSAMPLE

```bash
curl -X POST --data '{"currency":"btc","amount":50000000,"from":"1CQaJB4WvbLdD8eSe6ZrvXX4KkAELEJy7J","to":"34otGUJWrgcdL1ny5u2DYxAh9dCJBjBLbN"}' http://bitgogogo.com/api/v1/withdraw
```

#### RESPONSE

* txid      (String 本次交易的交易单号，可用于查询交易确认数)

```bash
{
  "err":null,
  "msg": {
    "currency":"btc",
    "txid":"8f559cd6554956bc631026f904df4c9cb7aad8d8c14f4a3ed1d9c8f0cb19be82"
  }
}
```



***

## 查询交易信息

#### COMMENT
充值或者提现的地址由接入方自行记录，本接口提供对某一地址的查询以便获取交易确认信息

#### METHOD: POST
#### URL: http://bitgogogo.com/api/v1/checkaddress
#### PARAMS :
* currency  (String 货币名称，目前包括 btc / ltc / bcc / eth /etc )
* address   (String 货币地址)
* txid      (String 交易单号)

#### EXSAMPLE

```bash
curl -X POST --data '{"currency":"btc","address":"1CQaJB4WvbLdD8eSe6ZrvXX4KkAELEJy7J","txid":"8f559cd6554956bc631026f904df4c9cb7aad8d8c14f4a3ed1d9c8f0cb19be82"}' http://bitgogogo.com/api/v1/checkaddress
```

#### RESPONSE
* comfirmation (确认数)
* amount (货币数量)

```bash
{
  "err":null,
  "msg": {
    "comfirmation":6，
    "amount":50000000
  }
}
```
