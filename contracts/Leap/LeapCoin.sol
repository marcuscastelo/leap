// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract LeapCoin is ERC20, Ownable {
//     constructor()
//         ERC20("LeapCoin", "LEAP")
//         Ownable(msg.sender)
//     {}

//     struct ClaimRights {
//         uint256 amount;
//         uint256 expirationTimestamp;
//     }

//     enum ClaimType {
//         STREAMER_LEAP_REVENUE,
//         LIQUIDITY_PROVIDER_LEAP_REVENUE,
//         LEAP_INCENTIVE
//     }

//     mapping (address => mapping (ClaimType => ClaimRights[])) public claimRights_;

//     event ClaimRightsUpdated(address indexed account, uint256 amount, ClaimType claimType);
//     event Claim(address indexed account, uint256 amount, ClaimType claimType);

//     function adminTransfer(address _to, uint256 _value) external onlyOwner {
//         require(_balances[address(this)] >= _value, "LeapCoin: transfer amount exceeds balance");
//         _balances[address(this)] -= _value;
//         _balances[_to] += _value;
//         emit Transfer(address(this), _to, _value);
//     }

//     ///// UPDATE /////

//     function updateStreamerClaimRights(address _account) external {
//         // TODO: get from outside blockchain (e.g. oracle)
//         // The user will pay for the gas
//         // claimRights_[_account][ClaimType.STREAMER_LEAP_REVENUE] = _claimRights;

//         // Mock: just add 1000 LEAP to the account
//         uint amount = 1001 * 10 ** 18;
//         claimRights_[_account][ClaimType.STREAMER_LEAP_REVENUE].push(ClaimRights(amount, block.timestamp + 1 days));
//         emit ClaimRightsUpdated(_account, amount, ClaimType.STREAMER_LEAP_REVENUE);
//     }

//     function updateLiquidityProviderClaimRights(address _account) external {
//         // TODO: get from outside blockchain (e.g. oracle)
//         // The user will pay for the gas
//         // claimRights_[_account][ClaimType.LIQUIDITY_PROVIDER_LEAP_REVENUE] = _claimRights;
//         // TODO: how to avoid vulnerabilities in the oracle? hacking of platform or oracle

//         // Mock: just add 1000 LEAP to the account
//         uint amount = 1002 * 10 ** 18;
//         claimRights_[_account][ClaimType.LIQUIDITY_PROVIDER_LEAP_REVENUE].push(ClaimRights(amount, block.timestamp + 1 days));
//         emit ClaimRightsUpdated(_account, amount, ClaimType.LIQUIDITY_PROVIDER_LEAP_REVENUE);
//     }

//     function updateIncentiveClaimRights(address _account) external {
//         // TODO: get from outside blockchain (e.g. oracle)
//         // The user will pay for the gas
//         // claimRights_[_account][ClaimType.LEAP_INCENTIVE] = _claimRights;
//         // TODO: how to avoid vulnerabilities in the oracle? hacking of platform or oracle

//         // Mock: just add 1000 LEAP to the account
//         uint amount = 1003 * 10 ** 18;
//         claimRights_[_account][ClaimType.LEAP_INCENTIVE].push(ClaimRights(amount, block.timestamp + 1 days));
//         emit ClaimRightsUpdated(_account, amount, ClaimType.LEAP_INCENTIVE);
//     }


//     ///// CALCULATIONS /////

//     function calculateClaimRightsFor(address _account, ClaimType _claimType) internal view returns (uint) {
//         ClaimRights[] memory _claimRights = claimRights_[_account][_claimType];
//         uint amountToClaim = 0;
//         for (uint256 i = 0; i < _claimRights.length; i++) {
//             if (_claimRights[i].expirationTimestamp > block.timestamp) {
//                 amountToClaim += _claimRights[i].amount;
//             }
//         }
//         return amountToClaim;
//     }

//     function calculateStreamersClaimRights(address _account) external view returns (uint) {
//         return calculateClaimRightsFor(_account, ClaimType.STREAMER_LEAP_REVENUE);
//     }

//     function calculateLiquidityProvidersClaimRights(address _account) external view returns (uint) {
//         return calculateClaimRightsFor(_account, ClaimType.LIQUIDITY_PROVIDER_LEAP_REVENUE);
//     }

//     function calculateIncentiveClaimRights(address _account) external view returns (uint) {
//         return calculateClaimRightsFor(_account, ClaimType.LEAP_INCENTIVE);
//     }


//     ///// CLAIMING /////

//     function claimAllRights() external {
//         address account = msg.sender;

//         uint streamerLeap = calculateClaimRightsFor(account, ClaimType.STREAMER_LEAP_REVENUE);
//         uint liquidityProviderLeap = calculateClaimRightsFor(account, ClaimType.LIQUIDITY_PROVIDER_LEAP_REVENUE);
//         uint incentiveLeap = calculateClaimRightsFor(account, ClaimType.LEAP_INCENTIVE);

//         uint amountToClaim = streamerLeap + liquidityProviderLeap + incentiveLeap;

//         require(amountToClaim > 0, "LeapCoin: nothing to claim");
//         require(_balances[address(this)] >= amountToClaim, "LeapCoin: not enough liquidity, try again later");

//         _balances[address(this)] -= amountToClaim;
//         _balances[account] += amountToClaim;

//         delete claimRights_[account][ClaimType.STREAMER_LEAP_REVENUE];
//         delete claimRights_[account][ClaimType.LIQUIDITY_PROVIDER_LEAP_REVENUE];
//         delete claimRights_[account][ClaimType.LEAP_INCENTIVE];

//         emit Claim(account, streamerLeap, ClaimType.STREAMER_LEAP_REVENUE);
//         emit Claim(account, liquidityProviderLeap, ClaimType.LIQUIDITY_PROVIDER_LEAP_REVENUE);
//         emit Claim(account, incentiveLeap, ClaimType.LEAP_INCENTIVE);
//         emit Transfer(address(this), account, amountToClaim);
//     }
// }