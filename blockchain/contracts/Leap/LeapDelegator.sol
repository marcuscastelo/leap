// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// // Uncomment this line to use console.log
// // import "hardhat/console.sol";

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./LeapCoin.sol";

// contract LeapDelegator is Ownable {
//     LeapCoin public leapCoinContract;

//     mapping(address => uint) public balances;

//     constructor(
//         address initialOwner_,
//         address leapCoinContractAddress_
//     ) Ownable(initialOwner_) {
//         leapCoinContract = LeapCoin(leapCoinContractAddress_);
//     }

//     function transferBalance(
//         address from_,
//         address to_,
//         uint amount_
//     ) external onlyOwner {
//         require(
//             balances[from_] >= amount_,
//             "LeapDelegator: transfer amount exceeds balance"
//         );

//         balances[from_] -= amount_;
//         balances[to_] += amount_;
//     }

//     function depositLeap(uint amount_) external {
//         balances[msg.sender] += amount_;

//         leapCoinContract.transferFrom(msg.sender, address(this), amount_);
//     }

//     function withdrawLeap(uint amount_) external {
//         require(
//             balances[msg.sender] >= amount_,
//             "LeapDelegator: undelegate amount exceeds balance"
//         );

//         balances[msg.sender] -= amount_;

//         leapCoinContract.transfer(msg.sender, amount_);
//     }

//     function balanceOf(address account_) external view returns (uint) {
//         return balances[account_];
//     }
// }
