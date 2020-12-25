pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint256;

    string public name = "Yog";
    string public symbol = "YOG";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    // Track balanes (stores information)
    mapping(address => uint256) public balanceOf;

    // State vars listed above

    constructor() public {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        return true;
    }
}

// Send tokens (behave func)
