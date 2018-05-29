
# 安装
## Mongodb
Ubuntu安装方法，其他平台安装可能有差异
```
apt install mongodb
mongod --version
sudo service mongod start
```
可以使用v3.x版本，目前开发版本为 v3.2.17

## npm & node.js
### 安装npm
```
apt install npm
npm --version
```
### 安装nvm
```
cd path/you/want
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```
再执行
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm --version
```
安装nodejs
```
nvm install v8.*
nvm use 8
node --version
```
v8以上理论上都可以，目前开发版本为 v8.9.4.
最后安装本项目的依赖项
```
cd path/to/tinypay
npm i
```


## 调整配置文件
在 `./Config` 文件中，可以编写dev&prod环境的配置文件，已经有几个配置项， 比如ethereum的ropsten测试网络`ropsten.yml`, 默认使用该文件，如果要使用其他配置文件，修改`index.yml`中use的文件名即可。
目前`ropsten.yml` 支持ropsten网络中的三种币，包括ether和erc20的king和tiny，目前默认的主钱包中包含很多这些token和少量ether

### ropsten网络
ropsten是和mainnet完全隔离的测试网络，有独立的区块链浏览器和钱包。
* https://ropsten.etherscan.io/ 是ropsten的区块链浏览器
* 在线钱包在搭建parity节点的时候会生成一个web版的钱包
* http://faucet.ropsten.be:3001/ 通过这个水龙头占点可以获得一些ropsten网络的ether用作测试
