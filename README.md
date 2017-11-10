# Bitgogogo

> 数字货币支付方案

## 环境搭建

### nodejs

需要 6.0版本以上的nodejs

### 安装

```bash
npm install
```

### zmq
```bash
sudo apt-get install libzmq3-dev build-essential
```

### Mongodb

本项目使用mngodb作为数据库，可直接通过linux安装：

```bash
sudo apt install mongodb
```
启动
```bash
mongod &
```

### FAQ

#### 启动时zmq报错

```
Error: Could not locate the bindings file. Tried:
 ŌåÆ ProjectDir\node\node_modules\zmq\build\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\build\Debug\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\build\Release\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\out\Debug\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\Debug\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\out\Release\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\Release\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\build\default\zmq.node
 ŌåÆ ProjectDir\node\node_modules\zmq\compiled\0.10.31\win32\x64\zmq.node
    at bindings (ProjectDir\node\node_modules\zmq\node_modules\bindings\bindings.js:89:9)
    at Object.<anonymous> (ProjectDir\node\node_modules\zmq\lib\index.js:6:30)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.require (module.js:364:17)
    at require (module.js:380:17)
    at Object.<anonymous> (ProjectDir\node\node_modules\zmq\index.js:2:18)
    at Module._compile (module.js:456:26)
```
需要手动重新安装zmq模块：
```bash
npm install zmq
```
