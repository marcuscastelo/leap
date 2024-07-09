// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DonationRelay {
    mapping(string => address payable) public aliasOwnerMapping;
    mapping(address => string) public userCurrentAliasMapping;

    enum DonationType {
        ETHER,
        ERC20
    }

    struct DonationMessage {
        string message;
        uint256 amount;
        DonationType donationType;
        address tokenAddress; // address(0) for Ether
        uint256 timestamp; // unix timestamp, not block timestamp
    }

    event AliasChanged(address indexed user, string newAlias);
    event NewUser(address indexed user, string userAlias);

    event DonationReceived(
        address indexed sender,
        address indexed receiver,
        DonationMessage donationMessage
    );

    modifier onlyRegisteredUser() {
        require(
            bytes(userCurrentAliasMapping[msg.sender]).length > 0,
            "This wallet needs to be registered"
        );
        _;
    }

    function setAlias(string memory _alias) public {
        require(bytes(_alias).length > 0, "Alias cannot be empty");
        require(aliasOwnerMapping[_alias] == address(0), "Alias already taken");

        string memory currentAlias = userCurrentAliasMapping[msg.sender];
        aliasOwnerMapping[currentAlias] = payable(address(0));

        aliasOwnerMapping[_alias] = payable(msg.sender);
        userCurrentAliasMapping[msg.sender] = _alias;
        emit AliasChanged(msg.sender, _alias);
    }

    function ownerOfAlias(
        string memory _alias
    ) public view returns (address payable) {
        address payable aliasOwner = aliasOwnerMapping[_alias];
        require(aliasOwner != address(0), "Alias does not exist");
        return aliasOwner;
    }

    function donateEtherToAlias(
        string memory _alias,
        string calldata message
    ) external payable onlyRegisteredUser {
        address payable aliasOwner = ownerOfAlias(_alias);
        donateEtherToAddress(aliasOwner, message);
    }

    function donateEtherToAddress(
        address payable _address,
        string calldata message
    ) public payable onlyRegisteredUser {
        DonationMessage memory donationMessage = DonationMessage({
            message: message,
            amount: msg.value,
            donationType: DonationType.ETHER,
            tokenAddress: address(0),
            timestamp: block.timestamp
        });

        _donateEtherToAddress(_address, donationMessage);
    }

    function _donateEtherToAddress(
        address payable _address,
        DonationMessage memory _message
    ) internal onlyRegisteredUser {
        require(_address != address(0), "Invalid address: 0x0");
        require(msg.value > 0, "Donation amount must be greater than 0 ETH");

        (bool success, ) = _address.call{value: msg.value}("");
        require(success, "Failed to send Ether to receiver");

        emit DonationReceived(
            msg.sender,
            _address,
            _message
        );
    }

    function donateERC20ToAlias(
        string memory _alias,
        address _tokenAddress,
        uint256 _amount,
        string calldata message
    ) external onlyRegisteredUser {
        address payable aliasOwner = ownerOfAlias(_alias);
        donateERC20ToAddress(aliasOwner, _tokenAddress, _amount, message);
    }

    function donateERC20ToAddress(
        address payable _address,
        address _tokenAddress,
        uint256 _amount,
        string calldata message
    ) public onlyRegisteredUser {
        DonationMessage memory donationMessage = DonationMessage({
            message: message,
            amount: _amount,
            donationType: DonationType.ERC20,
            tokenAddress: _tokenAddress,
            timestamp: block.timestamp
        });

        _donateERC20ToAddress(_address, donationMessage);
    }

    function _donateERC20ToAddress(
        address payable _address,
        DonationMessage memory _message
    ) internal onlyRegisteredUser {
        require(_address != address(0), "Invalid address: 0x0");
        require(_message.amount > 0, "Donation amount must be greater than 0");
        
        IERC20 token = IERC20(_message.tokenAddress);
        require(token.allowance(msg.sender, address(this)) > _message.amount, "Insufficient allowance");

        // Transfer ERC20 tokens from the sender to the contract
        bool success = token.transferFrom(msg.sender, address(this), _message.amount);
        require(success, "Failed to transfer ERC20 tokens to contract");

        // Transfer ERC20 tokens to the receiver
        success = token.transfer(_address, _message.amount);
        require(success, "Failed to send ERC20 tokens to receiver");

        emit DonationReceived(
            msg.sender,
            _address,
            _message
        );
    }
}
