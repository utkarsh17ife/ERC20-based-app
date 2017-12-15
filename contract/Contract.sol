pragma solidity ^0.4.13;

import "./AppToken.sol";

contract Contract {
    
    //Token contract Type
    AppToken token;
    
    //storage Variables
    address admin;    
    address public authorityAddr;    

    //Transaction structure
    struct transaction{
        address masterParty;
        address payeeParty;
        uint256 amount;
        uint256 blkChainStatus; //0-pending 1-inProgress 2-cashout
    }

    //Group transaction Structure
    struct groupTransaction {
        address payeeParty;
        uint256 payment;
        uint256 payStatus;
    }

    //Transaction mappings
    mapping(bytes32 => transaction) transMap;
    mapping(bytes32 => groupTransaction) gTranMap;
        
    //Constructor sets the admin address and sets the toekn contract handler
    function Contract(address _tokenAddr){
        admin = msg.sender;
        token = AppToken(_tokenAddr);
    }
    
    //Event to confirm the blockchain transactions
    event TransactionSuccess(string transactionId);
    
    //functions to set the authority addresses
    function setAuthorityAddr(bytes32 _transactionId, address _authAddr) {
        require(admin == msg.sender);
        authorityAddr = _authAddr;
        TransactionSuccess(bytes32ToString(_transactionId));
    }


    function initiatePayment(bytes32 _transactionId, address _payeeParty, uint256 _amount) {
        transMap[_transactionId].masterParty = msg.sender;
        transMap[_transactionId].payeeParty = _payeeParty;        
        transMap[_transactionId].amount = _amount;
        transMap[_transactionId].blkChainStatus = 0;
        //from masterParty to smart contract
        require(token.transferFrom(msg.sender, this, _amount));
        TransactionSuccess(bytes32ToString(_transactionId));
    }
    
    function acceptPayment(bytes32 _transactionId){
        require(transMap[_transactionId].payeeParty == msg.sender);
        require(transMap[_transactionId].blkChainStatus == 0);
        transMap[_transactionId].blkChainStatus = 1;      
        TransactionSuccess(bytes32ToString(_transactionId));
    }

   
    function cashOut(bytes32 _transactionId, bytes32[] _transactionArr){
        
        uint totalPayment;
        for(uint8 i=0; i<_transactionArr.length; i++){
            require(transMap[_transactionArr[i]].payeeParty == msg.sender);
            require(transMap[_transactionArr[i]].blkChainStatus == 1);    
            transMap[_transactionArr[i]].blkChainStatus = 2;    
            totalPayment += transMap[_transactionArr[i]].amount;
        }
        gTranMap[_transactionId].payeeParty = msg.sender;
        gTranMap[_transactionId].payment = totalPayment;
        gTranMap[_transactionId].payStatus = 0;
        TransactionSuccess(bytes32ToString(_transactionId));

    }
    
    
     function confirmPayment(bytes32 _transactionId, uint _fee){
        require(gTranMap[_transactionId].payeeParty == msg.sender);
        require(gTranMap[_transactionId].payStatus == 0);
        gTranMap[_transactionId].payStatus = 1;
        
        //transfer fee from contract to authority
        require(token.transferFrom(this, authorityAddr, _fee));

        //transfer from contract to payee
        require(token.transferFrom(this, gTranMap[_transactionId].payeeParty, gTranMap[_transactionId].payment - _fee));

        TransactionSuccess(bytes32ToString(_transactionId));
    }
    
    function getTransaction(bytes32 _transactionId) constant returns(string, uint256){
        
        return (bytes32ToString(_transactionId), transMap[_transactionId].blkChainStatus);
    }
    
    function getGTransaction(bytes32 _transactionId) constant returns(string, uint256){
        
        return (bytes32ToString(_transactionId), gTranMap[_transactionId].payment);
    }   
        
        
    function () payable {}
    
    
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }


}