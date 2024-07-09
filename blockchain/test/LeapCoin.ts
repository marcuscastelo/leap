// import { ethers } from "hardhat";
// import { expect } from "chai";
// import { LeapCoin } from "../typechain-types";
// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// describe("LeapCoin", async () => {
//     const STREAMER_LEAP_REVENUE = ethers.toBigInt(0);
//     const LIQUIDITY_PROVIDER_LEAP_REVENUE = ethers.toBigInt(1);
//     const INCENTIVE_LEAP_REVENUE = ethers.toBigInt(2);

//     let token: LeapCoin;
//     let supply: bigint;
//     let decimals: bigint;
//     let deployer: HardhatEthersSigner;
//     let recipient: HardhatEthersSigner;
//     let router: HardhatEthersSigner;

//     beforeEach(async () => {
//         [deployer, recipient, router] = await ethers.getSigners();
//         const factory = await ethers.getContractFactory("LeapCoin");
//         token = await factory.deploy();
//         await token.waitForDeployment();
//         supply = await token.totalSupply();
//         decimals = await token.decimals_();
//     });

//     afterEach(async () => {
//         // Reset hardhat after each test
//         await ethers.provider.send("hardhat_reset", []);
//     });

//     it("All tokens should be kept initially with the contract", async () => {
//         expect(await token.balanceOf(await token.initialAddress_())).to.equal(supply, "Contract balance is incorrect");
//         expect(await token.balanceOf(await deployer.getAddress())).to.equal(0, "Deployer balance is incorrect");
//         expect(await token.balanceOf(await recipient.getAddress())).to.equal(0, "Recipient balance is incorrect");
//         expect(await token.balanceOf(await router.getAddress())).to.equal(0, "Router balance is incorrect");
//     });

//     it("Should update claim rewards correctly", async () => {
//         expect(await token.calculateStreamersClaimRights(deployer)).to.equal(0, "Deployer claim rights (streamer) is incorrect before update");
//         const streamerUpdateResponse = await token.updateStreamerClaimRights(deployer);
//         expect(await token.calculateStreamersClaimRights(deployer)).to.equal(ethers.parseUnits("1001", decimals), "Deployer claim rights (streamer) is incorrect after update");

//         // Events
//         await expect(streamerUpdateResponse).to.emit(token, "ClaimRightsUpdated").withArgs(await deployer.getAddress(), ethers.parseUnits("1001", decimals), STREAMER_LEAP_REVENUE);

//         expect(await token.calculateLiquidityProvidersClaimRights(deployer)).to.equal(0, "Deployer claim rights (liquidity provider) is incorrect before update");
//         const liquidityProviderUpdateResponse = await token.updateLiquidityProviderClaimRights(deployer);
//         expect(await token.calculateLiquidityProvidersClaimRights(deployer)).to.equal(ethers.parseUnits("1002", decimals), "Deployer claim rights (liquidity provider) is incorrect after update");

//         // Events
//         await expect(liquidityProviderUpdateResponse).to.emit(token, "ClaimRightsUpdated").withArgs(await deployer.getAddress(), ethers.parseUnits("1002", decimals), LIQUIDITY_PROVIDER_LEAP_REVENUE);

//         expect(await token.calculateIncentiveClaimRights(deployer)).to.equal(0, "Deployer claim rights (liquidity provider) is incorrect before update");
//         const incentiveUpdateResponse = await token.updateIncentiveClaimRights(deployer);
//         expect(await token.calculateIncentiveClaimRights(deployer)).to.equal(ethers.parseUnits("1003", decimals), "Deployer claim rights (liquidity provider) is incorrect after update");

//         // Events
//         await expect(incentiveUpdateResponse).to.emit(token, "ClaimRightsUpdated").withArgs(await deployer.getAddress(), ethers.parseUnits("1003", decimals), INCENTIVE_LEAP_REVENUE);
//     });

//     it("Should claim rewards correctly", async () => {
//         expect(await token.balanceOf(await token.getAddress())).to.equal(supply, "Contract balance is incorrect before claim");
//         expect(await token.balanceOf(await deployer.getAddress())).to.equal(0, "Deployer balance is incorrect before claim");

//         await token.updateStreamerClaimRights(deployer);
//         await token.updateLiquidityProviderClaimRights(deployer);
//         await token.updateIncentiveClaimRights(deployer);

//         const claimAllResponse = await token.claimAllRights();

//         expect(await token.balanceOf(await token.getAddress())).to.equal(supply - ethers.parseUnits("3006", decimals), "Contract balance is incorrect after claim");
//         expect(await token.balanceOf(await deployer.getAddress())).to.equal(ethers.parseUnits("3006", decimals), "Deployer balance is incorrect after claim");

//         // Events
//         await expect(claimAllResponse).to.emit(token, "Claim").withArgs(await deployer.getAddress(), ethers.parseUnits("1001", decimals), STREAMER_LEAP_REVENUE);
//         await expect(claimAllResponse).to.emit(token, "Claim").withArgs(await deployer.getAddress(), ethers.parseUnits("1002", decimals), LIQUIDITY_PROVIDER_LEAP_REVENUE);
//         await expect(claimAllResponse).to.emit(token, "Claim").withArgs(await deployer.getAddress(), ethers.parseUnits("1003", decimals), INCENTIVE_LEAP_REVENUE);
//         await expect(claimAllResponse).to.emit(token, "Transfer").withArgs(await token.getAddress(), await deployer.getAddress(), ethers.parseUnits("3006", decimals));
//     });

//     it("Should error when claiming rewards without rights", async () => {
//         await expect(token.claimAllRights()).to.be.revertedWith("LeapCoin: nothing to claim");
//     });

//     it("Should error when claiming rewards twice", async () => {
//         await token.updateStreamerClaimRights(deployer);
//         await token.updateLiquidityProviderClaimRights(deployer);
//         await token.updateIncentiveClaimRights(deployer);

//         await token.claimAllRights();
//         await expect(token.claimAllRights()).to.be.revertedWith("LeapCoin: nothing to claim");
//     });

//     it("Should error when claiming if contract has no balance", async () => {
//         await token.updateStreamerClaimRights(deployer);
//         await token.updateLiquidityProviderClaimRights(deployer);
//         await token.updateIncentiveClaimRights(deployer);

//         await token.adminTransfer(await deployer.getAddress(), supply); // Transfer all tokens to deployer so contract has no balance
//         await expect(token.claimAllRights()).to.be.revertedWith("LeapCoin: not enough liquidity, try again later");
//     });
// });