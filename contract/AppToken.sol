pragma solidity ^0.4.8;
import "./ERC20.sol";
contract AppToken is Token {

    //token mapping
    mapping (address => uint256) balances;
    
    uint256 tokenConversion = 1000;
    event BuyToken(address _buyer, uint256 _finalBalance);

    function buyToken() payable {
        require(msg.value > 0);        
        balances[msg.sender] += tokenConversion*msg.value/1000000000000000000;
        BuyToken(msg.sender, balances[msg.sender]);     
    }

    function transfer(address _to, uint256 _value) returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {             
        require(balances[_from] >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }
    
    
}