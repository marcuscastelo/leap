// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    string public name_;
    string public symbol_;
    uint8 public decimals_;
    uint256 public totalSupply_;
    address public initialAddress_;

    mapping (address => uint256) public balances_;
    mapping (address => mapping (address => uint256)) public allowances_;

    // Custom events
    event AllowanceConsumed(address indexed owner, address indexed spender, uint256 consumedAllowance);

    constructor (string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, address _initialAddress) {
        name_ =  _name;
        symbol_ = _symbol;
        decimals_ = _decimals;
        totalSupply_ = _totalSupply;
        initialAddress_ = _initialAddress;

        balances_[_initialAddress] = totalSupply_;
        emit Transfer(address(0), _initialAddress, totalSupply_);
    }

    function totalSupply() external view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address _account) external view returns (uint256) {
        return balances_[_account];
    }

    function transfer(address _to, uint256 _value) external returns (bool) {
        require(balances_[msg.sender] >= _value, "LeapCoin: transfer amount exceeds balance");
        balances_[msg.sender] -= _value;
        balances_[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function allowance(address _owner, address _spender) external view returns (uint256) {
        return allowances_[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) external returns (bool) {
        allowances_[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(balances_[_from] >= _value, "LeapCoin: transfer amount exceeds balance");
        require(allowances_[_from][msg.sender] >= _value, "LeapCoin: transfer amount exceeds allowance");
        balances_[_from] -= _value;
        balances_[_to] += _value;
        allowances_[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        emit AllowanceConsumed(_from, msg.sender, _value);
        return true;
    }
}