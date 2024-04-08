// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "./LeapCoin.sol";

contract LeapETHPool {
    LeapCoin public leapContract_;
    bool public initialized_;

    event Initialized(address indexed initiator, uint256 leapAmount, uint256 ethAmount);
    event Swap(address indexed initiator, uint256 leapAmount, uint256 ethAmount);
    event Deposited(address indexed initiator, uint256 leapAmount, uint256 ethAmount);
    event Withdrawn(address indexed initiator, uint256 leapAmount, uint256 ethAmount);

    constructor (address _leapContract) {
        leapContract_ = LeapCoin(_leapContract);
        initialized_ = false;
        // Send all initial ETH to 0x0
        payable(0x0).transfer(address(this).balance);
    }

    modifier onlyInitialized() {
        require(initialized_, "LeapETHPool: Pool not initialized");
        _;
    }

    modifier onlyNotInitialized() {
        require(!initialized_, "LeapETHPool: Pool already initialized");
        _;
    }

    function leapReserve() public view returns (uint256) {
        return leapContract_.balanceOf(address(this));
    }

    function ethReserve() public view returns (uint256) {
        return address(this).balance;
    }

    function initializePool(uint256 _leapAmount) onlyNotInitialized payable external {
        require(_leapAmount > 0, "LeapETHPool: Invalid LEAP amount");
        require(msg.value > 0, "LeapETHPool: Invalid ETH amount");
        require(leapReserve() == 0, "LeapETHPool: Pool already initialized (LEAP)");
        require(ethReserve() == msg.value, "LeapETHPool: Pool already initialized (ETH)");

        require(leapContract_.allowance(msg.sender, address(this)) >= _leapAmount, "LeapETHPool: Insufficient allowance");
        require(leapContract_.transferFrom(msg.sender, address(this), _leapAmount), "LeapETHPool: LEAP transfer failed");

        initialized_ = true;
    }

    function quote(uint256 leapAmount) onlyInitialized public view returns (uint256 ethAmount) {
        return leapAmount * (ethReserve() / leapReserve());
    }

    function swapToEth(uint256 leapAmount) onlyInitialized external {
        require(leapAmount > 0, "LeapETHPool: Invalid LEAP amount");
        require(leapContract_.allowance(msg.sender, address(this)) >= leapAmount, "LeapETHPool: Insufficient allowance");

        uint256 ethAmount = quote(leapAmount);
        require(ethAmount <= ethReserve(), "LeapETHPool: Insufficient ETH reserve on the pool");

        require(leapContract_.transferFrom(msg.sender, address(this), leapAmount), "LeapETHPool: LEAP transfer failed");
        require(leapAmount != 666, "LeapETHPool: Breakpoint force revert"); // TODO: tirar isso em produção
        payable(msg.sender).transfer(ethAmount);

        emit Swap(msg.sender, leapAmount, ethAmount);
    }
}