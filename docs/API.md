
# 全局参数
目前有以下参数可由Bitgogogo管理员修改，各项目按需提交修改申请

| 参数名称 | 描述 |
|-------|--------|
| incomeLimit | 最小充值提现下限，每个币种都可以设置，如BTC默认为0.01 |
| outcomeLimit | 最大提币上限，每个币种都可以设置，如BTC默认为1 |
| currencies | 接口开放的币种，目前包括 **btc** / **ltc** / **bcc** / **rbtc** /  **etc** / **eth** 跟据项目会有不同|

# 获取新的钱包地址
获取指定币种的新钱包地址，该新地址有服务器主钱包产生，该地址每次请求都是唯一的

### 请求地址
GET http://YOUR_GIVEN_IP_ADDRESS:1990/v1/getnewaddress
<br>(YOUR_GIVEN_IP_ADDRESS为Bitgogogo部署服务器的ip，需要向管理员索要)
<br>所有请求的数据形式为JSON，下同

### 请求参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| name | string | 必需 | 币种的名称， 目前包括 **btc** / **ltc** / **bcc** / **rbtc** /  **etc** / **eth**|


### 返回参数

| 参数名 | 数据类型  | 描述 |
|-------|--------|---------|
| err | number  |  错误码，如果为0则表示没有错误 |
| msg | string  |  如果err为0， msg即为获取到的新地址，如果err不为0，msg即为错误信息 |



### 请求示例

```bash
curl http://YOUR_GIVEN_IP_ADDRESS:1990/v1/getnewaddress?name=btc
# 返回结果为： {"err":0,"msg":"13Cyy5MTWpfXjEmtf2uMif2EEq1eRgYFsj"}
```

### 接入建议
获取到该地址之后，作为接入方需要做的一般是将该地址和用户绑定，以便区分每个地址对应的用户。而且如果需要接入多个币种，需要区分每个地址属于哪个币种。

# 发起提现交易
向指定地址发送交易，该交易由服务器主钱包向外发送，一般用于用户提现，在测试环境下可以发送给由上一个接口getnewaddress产生的地址，但是在正式环境中不建议这样做，因为会产生额外的费用

### 请求地址
POST http://YOUR_GIVEN_IP_ADDRESS:1990/v1/getnewaddress
<br>(YOUR_GIVEN_IP_ADDRESS为Bitgogogo部署服务器的ip，需要向管理员索要)
<br>所有请求的数据形式为JSON，下同

### 请求参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| name | string | 必需 | 币种的名称， 目前包括 **btc** / **ltc** / **bcc** / **rbtc** /  **etc** / **eth** |
| to | string | 必需 | 该比交易的目标地址，形如 "13Cyy5MTWpfXjEmtf2uMif2EEq1eRgYFsj" |
| amount | string | 必需 | 需要交易的币的数量 |


### 返回参数

| 参数名 | 数据类型  | 描述 |
|-------|--------|---------|
| err | number  |  错误码，如果为0则表示没有错误 |
| msg | string  |  如果err为0， msg即为交易的交易单号，如果err不为0，msg即为错误信息。 交易单号用于查询交易，如果不需要该功能则不需要记录交易单号，或者仅仅只是记录到日志中|

### 请求示例

```bash
  curl http://YOUR_GIVEN_IP_ADDRESS:1990/v1/sendtransaction \
  -H "Content-Type: application/json" \
  -X POST -d '{"name":"rbtc","to":"mvxwWn74CWRxx99nJC3QxXsgYsDH68pvPN","amount":"1"}'
  # 返回结果为： {"err":0,"msg":"243538f6c233fdd16cfff0a798d0a0cddec672587260e01c88cb56967e0d97be"}
```

### 接入建议
该接口用于用户提现，注意做amount的控制，有最大最小额度限制

# 接收充值消息推送
由于区块链的特殊性质，不能通过回调模式返回交易信息；通过txid核对交易单的形式效率也非常低，故通过消息队列的形式传递每一笔成功的交易。本项目采用ZeroMQ作为消息队列，ZeroMQ可支持nodejs、php、C++等环境，作为客户端安装相应的库或者插件即可快速接入。

### 连接主机
tcp://YOUR_GIVEN_IP_ADDRESS:1999

### 返回参数

| 参数名 | 数据类型 | 描述 |
|-------|--------|-----|
| name | string | 交易币种名称 目前有 **btc** / **ltc** / **bcc** / **rbtc** /  **etc** / **eth** |
| category | string | 类型为发送或者接受 有 **receive** 和 **send** ，目前只返回 **receive**; 但是为了安全起见，建议接入时判断字段 |
| address | string | 接收该交易的地址 |
| amount | number | 充值币的数量，单位为BTC（或其他币） |
| comfirmations | number | 确认数，接收方收到的绝大多数数据应该为1,并且确认数即使改变也不会重新发送本充值信息，以太放系列暂时不携带该信息。本接口目前只返回确认数已经达到要求的交易|
| txid | string | 交易单号 |

### 返回示例

```bash
Worker connected to port 1999
{"name":"rbtc"," category":"receive","address":"mxrxypc2q5kev8Bri3t9bzka8TXUXLCv9v","amount":0.04,"confirmations":3,"txid":"f2cf40a1d235bfcad70021c6cc9756194c5070ba21cf4d4a34f69d1b510fdaef"}
{"name":"rbtc","category":"receive","address":"mxrxypc2q5kev8Bri3t9bzka8TXUXLCv9v","amount":0.05,"confirmations":3,"txid":"42eab14af3005c2ca093a180bfdfc07e06294bd40a764801c1a41647997b8c29"}
{"name":"rbtc","category":"receive","address":"mxrxypc2q5kev8Bri3t9bzka8TXUXLCv9v","amount":0.06,"confirmations":3,"txid":"a556228d70ba4e1b0feafbd640c63ec161afa3a8e333e552a1798f950c2e7c0d"}
```

### 接入建议
该消息队列会传递所有成功的**充值交易**,如果消息发送时您的zmq客户端不在线，则在下次客户端上线的时候依然可以接受该消息。当客户端侦听到该消息并完成处理以后，该消息将**永远不会重新发送**。如果确实发现漏发消息的情况，可联系Bitgogogo管理员查看日志文件。 接受到该信息时，作为接入端应该判断该交易地址(address)属于哪一个用户，获取充值的币的数量(amount)并在自建数据库中添加用户的余额（无论是充值成数字货币，还是自己平台的货币，根据自己的业务逻辑处理该笔充值即可）。 ZeroMQ的搭建在各个平台和不同编程环境下不同，需要根据情况选择。ZeroMQ官网地址 http://zeromq.org/

### nodejs接入示范
安装zmq运行环境
```bash
sudo apt-get install libzmq3-dev build-essential
```
npm中安装zmq模块：
```bash
npm install zmq --save
```
引用并连接主机：
```javascript

const zmq = require('zmq')
const sock = zmq.socker('pull')

sock.connect('tcp://YOUR_GIVEN_IP_ADDRESS:1999')

console.log('Worker connected to port 1999')

sock.on('message', (msg) => {
    console.log(msg.toString());// {"name":"rbtc","category":"receive","address":"mxrxypc2q5kev8Bri3t9bzka8TXUXLCv9v","amount":0.06,"confirmations":3,"txid":"a556228d70ba4e1b0feafbd640c63ec161afa3a8e333e552a1798f950c2e7c0d"}
    //在这里处理该笔交易，该函数结束后则不会再次接收到该交易
});

```


# Bitcoin系列常用RPC端口

目前已知下列数字货币拥有与比特币一致的RPC接口： BTC | LTC | BCC 。这些货币可统一按照比特币官方文档接入，地址为：https://bitcoin.org/en/developer-reference#listsinceblock<br>
本节将着重介绍常用的RPC方法

## 基本请求形式
由于编程语言较多，这里举出curl请求接口的形式。其他接口为了示例的简洁，使用cli命令的形式

### 请求参数

* rpcuser rpc用户名
* rpcpassword rpc密码
* request 请求，JSON形式，参照下方
* host rpc接口地址

### 请求示例

如下，request以JSON形式，包含需要请求的方法 *method* 方法所需参数 *params* 和自定义 *id* ，该示例为获取区块哈系值
```bash
curl --user ':my_secret_password' --data-binary '''
  {
      "method": "getblockhash",
      "params": [0],
      "id": "foo"
  }''' \
  --header 'Content-Type: text/plain;' localhost:8332
```

### 返回参数
* result 返回结果
* error 错误信息
* id 请求时使用的id

### 返回示例

如上请求实例应返回如下JSON格式结果：
```bash
{
    "result": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    "error": null,
    "id": "foo"
}
```

## GetInfo - 获取钱包信息

### 请求示例

```bash
bitcoin-cli getinfo
```

### 返回参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| version | number | 必需 |  这个节点在其内部整数格式比特币核心的版本。例如，Bitcoin Core 0.9.2的整数版本号为90200 |
| protocolversion | number | 必需 | 此节点使用的协议版本号。请参阅协议版本部分了解更多信息 |
| walletversion | number | 可选 | 钱包的版本号。只有在支持钱包的情况下才会返回 |
| balance | number | 可选 | 比特币余额 |
| blocks | number | 必需 | 本地区块高度 |
| timeoffset | number | 必需 | 节点时钟与计算机时钟的偏移（以UTC表示），以秒为单位。偏移量可能高达4200秒（70分钟） |
| connections | number | 必需 | 连入节点数量 |
| difficulty | number | 必需 | 最高块难度 |
| testnet | bool | 必需 | 是否在测试网络中 |
| paytxfee | number | 可选 | 千字节交易最低费用 |
| relayfee | number | 必需 | 低优先级事务必须支付的最低费用才能使该节点将其接收到内存池中 |
| errors | string | 必需 | 错误信息 |

### 返回示例

```bash
{
    "version" : 100000,
    "protocolversion" : 70002,
    "walletversion" : 60000,
    "balance" : 1.27007770,
    "blocks" : 315281,
    "timeoffset" : 0,
    "connections" : 9,
    "proxy" : "",
    "difficulty" : 1.00000000,
    "testnet" : true,
    "keypoololdest" : 1418924649,
    "keypoolsize" : 101,
    "paytxfee" : 0.00000000,
    "relayfee" : 0.00001000,
    "errors" : ""
}
```

## GetNewAddress - 获取钱包新地址

### 请求参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| account | string | 可选 | 将地址放入的帐户名称。默认为默认帐户，一个空字符串（“”） |

### 请求示例
```bash
bitcoin-cli -testnet getnewaddress "doc test"
```

### 返回参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| result | string | 必需 | 新地址 |

### 返回示例

```
mft61jjkmiEJwJ7Zw3r1h344D6aL1xwhma
```

## SendToAddress - 发送比特币

### 请求参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| address | string | 必需 | 目标地址 |
| amount  | number | 必需 | 发送数量 |
| comment | string | 可选 | 注释，仅保存在本地 |
| commentto | string | 可选 | 发送到的人添加注释，仅本地 |
|subtractfeefromamont | bool | 可选 | 内扣交易费 |


### 请求示例

```bash
bitcoin-cli -testnet sendtoaddress mmXgiR6KAhZCyQ8ndr2BCfEq1wNG2UnyG6 \
  0.1 "sendtoaddress example" "Nemo From Example.com"
```

### 返回参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| result | number | 必需 | 交易单号 |

### 返回示例

```
a2a2eb18cb051b5fe896a32b1cb20b179d981554b6bd7c5a956e56a0eecb04f0
```

## ListTransactions - 批量查询交易

### 请求参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| account | string | 可选 | 使用空字符串（“”）来获取默认帐户的交易。默认是*获取所有帐户的交易。 |
| count  | number | 可选 | 要列出的最近事务的数量。默认是10 |
| skip | number | 可选 | 要跳过的交易数量，默认是0|


### 请求示例

```bash
bitcoin-cli -testnet listsinceblock \
              00000000688633a503f69818a70eac281302e9189b1bb57a76a05c329fcda718 \
              6
```

### 返回参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| result | array | 必需 | 包含所有交易 |
| Payment | object | 必需 | 是否包含watchonly地址 |
| account | string | 必需 | 账户名称 |
| address | string | 可选 | 地址 |
| category | string | 可选 | 分类，包含发送还是接受 |
| amount | number |可选 | 货币数量 |
| label | string|可选 | 备注，仅保存本地 |
| fee | number |可选 | 交易费用 |
| confirmations| number | 可选 | 确认数 |  
| trusted | bool |可选 | 信任度 |
| blockhash | string |可选 | 块哈系值 |
| blockindex | number |可选 | 块包含的已确认交易数量 |
| blocktime | string |可选 | 生成块的时间 |
| txid | string |可选 | 交易单号 |
| time | number |可选 | 交易时间 |
| timereceived | number |可选 | 本地侦测到的确认时间 |
| comment | string |可选 | 本地保存的交易注释 |
| abandoned | bool |可选 | 是否被抛弃 |
| lastblock | string | 必需 | 本次查询时的最高块高度 |

### 返回示例

```
{
    "transactions" : [
        {
            "account" : "doc test",
            "address" : "mmXgiR6KAhZCyQ8ndr2BCfEq1wNG2UnyG6",
            "category" : "receive",
            "amount" : 0.10000000,
            "vout" : 0,
            "confirmations" : 76478,
            "blockhash" : "000000000017c84015f254498c62a7c884a51ccd75d4dd6dbdcb6434aa3bd44d",
            "blockindex" : 1,
            "blocktime" : 1399294967,
            "txid" : "85a98fdf1529f7d5156483ad020a51b7f3340e47448cf932f470b72ff01a6821",
            "walletconflicts" : [
            ],
            "time" : 1399294967,
            "timereceived" : 1418924714,
            "bip125-replaceable": "no"		
        },
        {
            "involvesWatchonly" : true,
            "account" : "someone else's address2",
            "address" : "n3GNqMveyvaPvUbH469vDRadqpJMPc84JA",
            "category" : "receive",
            "amount" : 0.00050000,
            "vout" : 0,
            "confirmations" : 34714,
            "blockhash" : "00000000bd0ed80435fc9fe3269da69bb0730ebb454d0a29128a870ea1a37929",
            "blockindex" : 11,
            "blocktime" : 1411051649,
            "txid" : "99845fd840ad2cc4d6f93fafb8b072d188821f55d9298772415175c456f3077d",
            "walletconflicts" : [
            ],
            "time" : 1418695703,
            "timereceived" : 1418925580,
            "bip125-replaceable": "no"
        }
    ],
    "lastblock" : "0000000000984add1a686d513e66d25686572c7276ec3e358a7e3e9f7eb88619"
}
```

## AddNode - 增加连接节点

### 请求参数

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| node | string | 必需 | 节点地址，如 “IP address:port” |
| command  | string | 必需 | 增加或者取消， 有 add,remove,onetry三个指令 |

### 请求示例

```bash
bitcoin-cli -testnet addnode 192.0.2.113:18333 onetry
```

### 返回参数

无返回表示操作成功
