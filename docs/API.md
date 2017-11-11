# 常用RPC端口

## Bitcoin系列

目前已知下列数字货币拥有与比特币一致的RPC接口： BTC | LTC | BCC 。这些货币可统一按照比特币官方文档接入，地址为：https://bitcoin.org/en/developer-reference#listsinceblock<br>
本节将着重介绍常用的RPC方法

### 基本请求形式
由于编程语言较多，这里举出curl请求接口的形式。其他接口为了示例的简洁，使用cli命令的形式

**请求参数**

* rpcuser rpc用户名
* rpcpassword rpc密码
* request 请求，JSON形式，参照下方
* host rpc接口地址

**请求示例**

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

#### 返回参数
* result 返回结果
* error 错误信息
* id 请求时使用的id

**返回示例**

如上请求实例应返回如下JSON格式结果：
```bash
{
    "result": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    "error": null,
    "id": "foo"
}
```

### GetInfo - 获取节点常用信息

**请求示例**

```bash
bitcoin-cli getinfo
```

#### 返回参数
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

**返回示例**

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

### GetNewAddress - 获取钱包新地址

**请求参数**

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| account | string | 可选 | 将地址放入的帐户名称。默认为默认帐户，一个空字符串（“”） |

**请求示例**
```bash
bitcoin-cli -testnet getnewaddress "doc test"
```

**返回参数**

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| result | string | 必需 | 新地址 |

**返回示例**

```
mft61jjkmiEJwJ7Zw3r1h344D6aL1xwhma
```

### SendToAddress - 向地址发送比特币

**请求参数**

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| address | string | 必需 | 目标地址 |
| amount  | number | 必需 | 发送数量 |
| comment | string | 可选 | 注释，仅保存在本地 |
| commentto | string | 可选 | 发送到的人添加注释，仅本地 |
|subtractfeefromamont | bool | 可选 | 内扣交易费 |


**请求示例**

```bash
bitcoin-cli -testnet sendtoaddress mmXgiR6KAhZCyQ8ndr2BCfEq1wNG2UnyG6 \
  0.1 "sendtoaddress example" "Nemo From Example.com"
```

**返回参数**

| 参数名 | 数据类型 | 必要性 | 描述 |
|-------|--------|---------|-----|
| result | number | 必需 | 交易单号 |

**返回示例**

```
a2a2eb18cb051b5fe896a32b1cb20b179d981554b6bd7c5a956e56a0eecb04f0
```
