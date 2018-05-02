define({ "api": [
  {
    "type": "post",
    "url": "/v1/newaccount",
    "title": "获取某币种的新帐号",
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
            "description": "<p>币种的代称，目前仅支持 king</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"appkey\": \"YOUR_APPKEY\",\n  \"signature\": \"SIG\",\n  \"timestamp\": \"789463135\",\n  \"params\":{\n     \"alias\":\"king\"\n    }\n}",
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
            "description": "<p>返回成功时为新帐号的地址</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "www/v1.js",
    "groupTitle": "V1"
  }
] });
