// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

abstract contract Ownable {
    address internal owner_;
    constructor(address _owner) {
        owner_ = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner_, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        owner_ = _newOwner;
    }
}