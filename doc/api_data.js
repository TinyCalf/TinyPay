define({ "api": [
  {
    "type": "post",
    "url": "/v1/withdraw",
    "title": "提现",
    "name": "__",
    "group": "V1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "alias",
            "description": "<p>币种名称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>发送地址</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "amount",
            "description": "<p>目标数量 （单位ether）注：不接受number类型</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"appkey\": \"YOUR_APPKEY\",\n  \"signature\": \"SIG\",\n  \"timestamp\": \"789463135\",\n  \"params\":{\n     \"alias\":\"ether\"\n     \"to\":\"0x1230182931012312312312\"\n     \"amount\": 1.2\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误码， 0时为成功</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>返回成功时为交易哈希值</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "body",
          "content": "{\n err:0,\n msg:\"0xba47d6fa65bdee2a0039797de77c1c8b2030be7f05be0debf00aaac387c0f5c7\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UNKNOW_ERROR",
            "description": "<p>未知错误</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVAILD_ALIAS",
            "description": "<p>alias参数不合法</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVAILD_ADDRESS",
            "description": "<p>address参数不合法</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVAILED_AMOUNT",
            "description": "<p>amount参数不合法</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SEND_TOO_OFTEN",
            "description": "<p>发送过于频繁</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INSUFFICIENT_FUNDS",
            "description": "<p>主账户余额不足</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Example",
          "content": "{err:999,msg:\"UNKNOW_ERROR\"}\n{err:10001,msg:\"INVAILD_ALIAS\"}\n{err:10002,msg:\"INVAILD_ADDRESS\"}\n{err:10003,msg:\"INVAILED_AMOUNT\"}\n{err:10004,msg:\"SEND_TOO_OFTEN\"}\n{err:10005,msg:\"INSUFFICIENT_FUNDS\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "www/v1.js",
    "groupTitle": "V1"
  },
  {
    "type": "post",
    "url": "/v1/getinfo",
    "title": "获取主账户余额信息",
    "name": "_________",
    "group": "V1",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"appkey\": \"YOUR_APPKEY\",\n  \"signature\": \"SIG\",\n  \"timestamp\": \"789463135\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误码， 0时为成功</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>返回成功时为主账户余额信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "alias",
            "description": "<p>货币代称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "symbol",
            "description": "<p>货币在ethereum上的缩写</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>货币在ethereum上的全称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "balance",
            "description": "<p>货币余额（单位：ether）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example",
          "content": "{\n  err:0,\n  msg:[\n    { alias: 'king',\n      symbol: 'KING(KingCoin)',\n      name: 'KingCoin',\n      balance: '999497.344429999013367925' },\n    { alias: 'tiny',\n      symbol: 'TINY',\n      name: 'Tiny Calf',\n      balance: '1000000' },\n    { alias: 'ether',\n      symbol: 'ether',\n      name: 'ether',\n      balance: '1.540200950899799' } ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UNKNOW_ERROR",
            "description": "<p>未知错误</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Example",
          "content": "{err:999,msg:\"UNKNOW_ERROR\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "www/v1.js",
    "groupTitle": "V1"
  },
  {
    "type": "post",
    "url": "/v1/getnewaccount",
    "title": "获取新帐号",
    "name": "_________",
    "group": "V1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "alias",
            "description": "<p>币种的代称，在配置文件中包含所有币种信息,如 ether|eos|...</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"appkey\": \"YOUR_APPKEY\",\n  \"signature\": \"SIG\",\n  \"timestamp\": \"789463135\",\n  \"params\":{\n     \"alias\":\"ether\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误码， 0时为成功</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>返回成功时为新帐号信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "alias",
            "description": "<p>货币代称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "symbol",
            "description": "<p>货币在ethereum上的缩写</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>货币在ethereum上的全称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>分类 ether|erc20</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "address",
            "description": "<p>新帐号</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example",
          "content": "{\n  err:0,\n  msg:{\n   address: '0xd0f1d390033d18617fb4d6835f561d5467f80756',\n   name: 'ether',\n   symbol: 'ether',\n   alias: 'ether',\n   category: 'ether' }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UNKNOW_ERROR",
            "description": "<p>未知错误</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVAILD_ALIAS",
            "description": "<p>alias参数不合法</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Example",
          "content": "{err:999,msg:\"UNKNOW_ERROR\"}\n{err:10000,msg:\"INVAILD_ALIAS\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "www/v1.js",
    "groupTitle": "V1"
  }
] });
