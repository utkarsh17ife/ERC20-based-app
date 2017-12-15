var fs = require('fs');
const config = require('./config');
var Web3 = require('web3');
var web3 = new Web3(config.rpc);


var appTokenAbi = JSON.parse(fs.readFileSync('./contract/AppToken.abi'));
let appTokenInstance = new web3.eth.Contract(appTokenAbi, fs.readFileSync('./contract/AppToken.address', 'utf8'));

let getTokenBalance = (userAddress) => {

    return new Promise((resolve, reject) => {

        appTokenInstance.methods.balanceOf(userAddress)
            .call({
                from: userAddress
            })
            .then(result => {

                return resolve(result);
            })
            .catch(err => {

                return reject(err);
            })
    })

}

//How to use the function
getTokenBalance("0x20a5f94239690ab8c3dc18d31f16be7e16f027a9")
    .then(result => {
        console.log("Address balance:");
        console.log(result);
    })
    .catch(err => { console.log(err); })




