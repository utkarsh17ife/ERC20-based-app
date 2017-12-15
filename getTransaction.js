var fs = require('fs');
const config = require('./config');
var Web3 = require('web3');
var web3 = new Web3(config.rpc);


var contractAbi = JSON.parse(fs.readFileSync('./contract/Contract.abi'));
let contractInstance = new web3.eth.Contract(contractAbi, fs.readFileSync('./contract/Contract.address', 'utf8'));


let getTransaction = (_transactionId, _fromAddress) => {

    return new Promise((resolve, reject) => {

        contractInstance.methods.getTransaction(web3.utils.asciiToHex(_transactionId))
            .call({
                from: _fromAddress
            })
            .then(result => {

                return resolve(result);
            })
            .catch(err => {

                return reject(err);
            })
    })


}


let getGTransaction = (_transactionId, _fromAddress) => {

    return new Promise((resolve, reject) => {

        contractInstance.methods.getGTransaction(web3.utils.asciiToHex(_transactionId))
            .call({
                from: _fromAddress
            })
            .then(result => {

                return resolve(result);
            })
            .catch(err => {

                return reject(err);
            })
    })


}



getTransaction("1", "0x9d8393dd96eeb9c9bca5c84e186d8b5eca96f595")
    .then(result => { console.log(result); })
    .catch(err => { console.log(err); })


getGTransaction("511N0RVRG72YR8I7PGE", "0x9d8393dd96eeb9c9bca5c84e186d8b5eca96f595")
    .then(result => { console.log(result); })
    .catch(err => { console.log(err); })
