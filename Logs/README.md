# log.js用法

获取log模块实例并给予当前日志一个标签，日志和输出中会保留该标签以区分不同的信息

```javascript
var log = require('./Logs/log.js')("transactions");
```

每个log实例有三个方法 info | err | warn
```javascript
log.info("hahaha")
log1.err("shit!")
```
输出为：
```bash
[17:17:25] fdas INFO hahaha
[17:17:25] block ERR shit!
```
