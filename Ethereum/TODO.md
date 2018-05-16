# 下一版公共模块为
* web3
* parity
* mongoose
* account
* wallet
* block
* erc20contractInstances
* config
将整合为utils类，可供所有处理交易的模块使用。处理交易各模块将不直接引用config等模块.
这里做成一个按需加载

# Transaction模块将细分为如下几个类，包含单独的数据库、模型、控制器
* erc20 {income outcome sendback }
* ether {income outcome sendback }

Ethereum
|__ utils
        |__ web3                               [x]
        |__ parity                             [x]
        |__ mongoose                           [x]
        |__ account                            [ ]
        |__ wallet                             [x]
        |__ block                              [ ]
        |__ erc20contractInstances             [x]
        |__ config                             [x]
|__ erc20
        |__ income
        |__ outcome
        |__ sendback                           [x]
|__ ether
        |__ income
        |__ outcome
        |__ sendback                           [x]
|__ index.js  __ 抛出方法
                |__ 获取某币新账户
                |__ 接收交易Event
                |__ 更新交易Event
                |__ 发送交易成功Event
                |__ 获取主账户信息（地址、余额）
                |__ 查询历史交易，带筛选功能
