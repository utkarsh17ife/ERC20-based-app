var fs = require('fs');
const config = require('./config');
var Web3 = require('web3');
var web3 = new Web3(config.rpc);


var contractAbi = JSON.parse(fs.readFileSync('./contract/Contract.abi'));
let contractInstance = new web3.eth.Contract(contractAbi, fs.readFileSync('./contract/Contract.address', 'utf8'));


let acceptPayment = (_transactionId, _fromAddress, _fromPassword) => {

    return new Promise((resolve, reject) => {

        web3.eth.personal.unlockAccount(_fromAddress, _fromPassword, () => {

            contractInstance.methods.acceptPayment(web3.utils.asciiToHex(_transactionId))
                .send({
                    from: _fromAddress,
                    gas: 3000000
                })
                .then(result => {
                    console.log(result.events.TransactionSuccess.returnValues);
                    return resolve();
                })
                .catch(err => {

                    return reject();
                })
        })

    })

}


//how to Use the function 
acceptPayment("12345", "0x20a5f94239690ab8c3dc18d31f16be7e16f027a9", "pass")
    .then(result => { console.log("done!") })
    .catch(err => { console.log("failed!") })
