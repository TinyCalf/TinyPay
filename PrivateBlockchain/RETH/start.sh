./geth --datadir "./data" init init.json
./geth --rpc --rpccorsdomain "*" --datadir "./data" --ipcdisable --networkid 123456 -rpcapi "personal,db,eth,net,web3" console 2>> ./eth.log
