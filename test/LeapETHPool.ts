import { ethers } from "hardhat";
import { expect } from "chai";
import { LeapCoin, LeapETHPool } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { getAddress } from "ethers";

describe("LeapETHPool", async () => {
    let token: LeapCoin;
    let supply: bigint;
    let decimals: bigint;
    let deployer: HardhatEthersSigner;
    let recipient: HardhatEthersSigner;
    let router: HardhatEthersSigner;

    let pool: LeapETHPool;

    beforeEach(async () => {
        // Deploy LeapCoin
        [deployer, recipient, router] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("LeapCoin");
        token = await tokenFactory.deploy();
        await token.waitForDeployment();
        supply = await token.totalSupply();
        decimals = await token.decimals_();

        // Give some LEAP to the deployer
        await token.updateIncentiveClaimRights(deployer);
        await token.claimAllRights();

        // Deploy LeapETHPool
        const poolFactory = await ethers.getContractFactory("LeapETHPool");
        pool = await poolFactory.deploy(await token.getAddress());

        pool.initializePool(1);
    });

    afterEach(async () => {
        // Reset hardhat after each test
        await ethers.provider.send("hardhat_reset", []);
    });

    it("Should have 1 ETH in the deployer's wallet for testing purposes", async () => {
        const balance = await ethers.provider.getBalance(await deployer.getAddress());
        expect(balance).to.be.greaterThan(ethers.parseEther("1"), "ETH balance is incorrect");
    });

    it("Should have 1003 LEAP in the deployer's wallet for testing purposes", async () => {
        const balance = await token.balanceOf(await deployer.getAddress());
        expect(balance).to.equal(ethers.parseUnits("1003", decimals), "LEAP balance is incorrect");
    });

    it("Should start with 0 ETH in the pool", async () => {
        const address = await pool.getAddress();
        const balance = await ethers.provider.getBalance(address);
        expect(balance).to.equal(0, "ETH balance is incorrect");
    });

    it("Should start with 0 LEAP in the pool", async () => {
        const address = await pool.getAddress();
        const balance = await token.balanceOf(address);
        expect(balance).to.equal(0, "LEAP balance is incorrect");
    });

    it("Should have correct amounts of ETH and LEAP in the pool after init", async () => {
        pool.initializePool(1);
    });
});