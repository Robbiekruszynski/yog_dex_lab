pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint256;

    //vars
    string public name = "Yog";
    string public symbol = "YOG";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    // Track balanes (stores information)
    mapping(address => uint256) public balanceOf;

    //keeping track of token allowance !!!!!! (dig into this)
    mapping(address => mapping(address => uint256)) public allowance;

    // State vars listed above

    //events

    //indexing allow us to isoate information
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor() public {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    // Send tokens (behave func)
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        //check to make sure not sending to a false account

        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    //make an internal function called _transfer to reuse
    //marker of _ pre var name = internal

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        //check to make sure not sending to a false account
        require(_to != address(0));
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    //approve token
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //transfer from
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}
