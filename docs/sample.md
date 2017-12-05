```bash
curl http://127.0.0.1:1990/v1/getnewaddress?name=btc
# mgP6t95UQhFmphgx4oYsX4zPyprxrsyZQL
curl http://127.0.0.1:1990/v1/getnewaddress?name=ltc
# mrHgcUKT13xTnsG1yzyA3cssGToHSCJPkz
curl http://127.0.0.1:1990/v1/getnewaddress?name=bcc
# mkp4x7wAgi1JGa5cjAQwXRT9zSwMdq1Yau
curl http://127.0.0.1:1990/v1/getnewaddress?name=eth
# 0xe69f092d9b28ecb3b5500558e3931c2a47e18dd9
curl http://127.0.0.1:1990/v1/getnewaddress?name=etc
# 0xe86e791051831bd804435151d4c9adb7ca5742bb
```

```bash
curl http://127.0.0.1:1990/v1/sendtransaction \
-H "Content-Type: application/json" \
-X POST -d '{"name":"btc","to":"mgP6t95UQhFmphgx4oYsX4zPyprxrsyZQL","amount":"1"}'
```

```bash
curl http://127.0.0.1:1990/v1/sendtransaction \
-H "Content-Type: application/json" \
-X POST -d '{"name":"ltc","to":"mrHgcUKT13xTnsG1yzyA3cssGToHSCJPkz","amount":"1"}'
```


```bash
curl http://127.0.0.1:1990/v1/sendtransaction \
-H "Content-Type: application/json" \
-X POST -d '{"name":"bcc","to":"mkp4x7wAgi1JGa5cjAQwXRT9zSwMdq1Yau","amount":"1"}'
```


```bash
curl http://127.0.0.1:1990/v1/sendtransaction \
-H "Content-Type: application/json" \
-X POST -d '{"name":"eth","to":"0xe69f092d9b28ecb3b5500558e3931c2a47e18dd9","amount":"1"}'
```


```bash
curl http://127.0.0.1:1990/v1/sendtransaction \
-H "Content-Type: application/json" \
-X POST -d '{"name":"etc","to":"0xe86e791051831bd804435151d4c9adb7ca5742bb","amount":"1"}'
```
