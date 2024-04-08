// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "./LeapCoin.sol";

contract LeapETHPool {
    LeapCoin public leapContract_;

    event Initialized(address indexed initiator, uint256 leapAmount, uint256 ethAmount);
    event Swapped(address indexed initiator, uint256 leapAmount, uint256 ethAmount);
    event Deposited(address indexed initiator, uint256 leapAmount, uint256 ethAmount);
    event Withdrawn(address indexed initiator, uint256 leapAmount, uint256 ethAmount);

    constructor (address _leapContract) {
        leapContract_ = LeapCoin(_leapContract);
    }

    modifier poolEmpty() {
        require(leapContract_.balanceOf(address(this)) == 0, "Pool not empty (LEAP)");
        require(address(this).balance == 0, "Pool not empty (ETH)");
        _;
    }

    function leapReserve() external view returns (uint256) {
        return leapContract_.balanceOf(address(this));
    }

    function ethReserve() external view returns (uint256) {
        return address(this).balance;
    }

    function initializePool(uint256 _leapAmount) payable poolEmpty external {
        require(_leapAmount > 0, "Invalid LEAP amount");
        require(msg.value > 0, "Invalid ETH amount");
        require(leapContract_.allowance(msg.sender, address(this)) >= _leapAmount, "Insufficient allowance");

        require(leapContract_.transferFrom(msg.sender, address(this), _leapAmount), "LEAP transfer failed");
    }

    function quote(uint256 leapAmount) external view returns (uint256 ethAmount) {
        return leapAmount;
    }
}