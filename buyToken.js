var fs = require('fs');
const config = require('./config');
var Web3 = require('web3');
var web3 = new Web3(config.rpc);


var appTokenAbi = JSON.parse(fs.readFileSync('./contract/AppToken.abi'));
let appTokenInstance = new web3.eth.Contract(appTokenAbi, fs.readFileSync('./contract/AppToken.address', 'utf8'));


let buyToken = (userAddress, password, amount) => {

    return new Promise((resolve, reject) => {

        web3.eth.personal.unlockAccount(userAddress, password, () => {
            appTokenInstance.methods.buyToken()
                .send({
                    from: userAddress,
                    value: web3.utils.toWei(amount.toString(), 'ether')
                })
                .then(result => {
                    
                    return resolve(result);
                })
                .catch(err => {

                    return reject(err);
                })
        })
    })


}


//How to use the function
buyToken("0x9d8393dd96eeb9c9bca5c84e186d8b5eca96f595", "pass", 100)
    .then(result => { console.log(result); })
    .catch(err => { console.log(err); })