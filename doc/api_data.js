define({ "api": [
  {
    "type": "post",
    "url": "/v1/newaccount",
    "title": "get a new account for some coin",
    "name": "NewAccount",
    "group": "v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "alias",
            "description": "<p>Alias for a coin.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>new address for the account.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "www/v1.js",
    "groupTitle": "v1"
  }
] });
