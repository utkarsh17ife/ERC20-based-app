var fs = require('fs');
const config = require('./config');
var Web3 = require('web3');
var web3 = new Web3(config.rpc);


/**
 * To deploy the Contract
 */

var contractAbi = JSON.parse(fs.readFileSync('./contract/Contract.abi'));
var contractByte = fs.readFileSync('./contract/Contract.bytecode', 'utf8');
let contractInterface = new web3.eth.Contract(contractAbi);


web3.eth.getAccounts()
  .then(result => {
    coinbase = result[0];
    web3.eth.personal.unlockAccount(coinbase, "pass", (err, result) => {

      contractInterface.deploy({
        data: '0x' + contractByte,
        arguments: ["0x728d754F7CF02B00fB3903C482E03873801CeB3b"]
      })
        .send({
          from: coinbase,
          gas: 4000000,
          gasPrice: '300000'
        }, function (error, transactionHash) { })
        .then(function (newContractInstance) {
          fs.writeFileSync('./contract/Contract.address', newContractInstance.options.address);
          console.log("Contract deployed at: " + newContractInstance.options.address + " and saved in the address file");
        });

    })

  })


/**
 * To deploy the token contract
 */

var appTokenAbi = JSON.parse(fs.readFileSync('./contract/AppToken.abi'));
var appTokenByte = fs.readFileSync('./contract/AppToken.bytecode', 'utf8');
let appTokenInterface = new web3.eth.Contract(appTokenAbi);

web3.eth.getAccounts()
  .then(result => {
    coinbase = result[0];
    web3.eth.personal.unlockAccount(coinbase, "pass", (err, result) => {

      appTokenInterface.deploy({
        data: '0x' + appTokenByte,
        arguments: []
      })
        .send({
          from: coinbase,
          gas: 1500000,
          gasPrice: '300000000'
        }, function (error, transactionHash) { })

        .then(function (newContractInstance) {
          fs.writeFileSync('./contract/AppToken.address', newContractInstance.options.address);
          console.log("App Token Contract deployed at: " + newContractInstance.options.address + " and saved in the address file");
        });

    })

  })
