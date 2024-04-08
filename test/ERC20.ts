import { ethers } from "hardhat";
import { expect } from "chai";
import { ERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ERC20", async () => {
    let token: ERC20;
    let supply: bigint
    let deployer: HardhatEthersSigner;
    let recipient: HardhatEthersSigner;
    let router: HardhatEthersSigner;

    beforeEach(async () => {
        supply = ethers.parseUnits("1000000000", 18);
        [deployer, recipient, router] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("ERC20");
        token = await factory.deploy("TestToken", "TEST", 18, supply, deployer);
        await token.waitForDeployment();
    });

    afterEach(async () => {
        // Reset hardhat after each test
        await ethers.provider.send("hardhat_reset", []);
    })

    it("Should deploy ERC20 correctly", async () => {
        // General token information
        expect(await token.name_()).to.equal("TestToken", "Token name is incorrect");
        expect(await token.symbol_()).to.equal("TEST", "Token symbol is incorrect");
        expect(await token.decimals_()).to.equal(18, "Token decimals is incorrect");
        expect(await token.totalSupply()).to.equal(supply, "Token total supply is incorrect");

        // Account balances: contract
        expect(await token.balanceOf(await token.initialAddress_())).to.equal(supply, "Contract balance is incorrect");
        expect(await token.allowance(await token.initialAddress_(), await token.initialAddress_())).to.equal(0, "Contract allowance is incorrect");
    });

    it("Should transfer tokens correctly", async () => {
        expect(await token.balanceOf(await deployer.getAddress())).to.equal(supply, "Deployer balance is incorrect before transfer");
        expect(await token.balanceOf(await recipient.getAddress())).to.equal(0, "Recipient balance is incorrect before transfer");

        const transferResponse = await token.transfer(await recipient.getAddress(), supply);

        // Events
        await expect(transferResponse).to.emit(token, "Transfer").withArgs(await deployer.getAddress(), await recipient.getAddress(), supply);

        expect(await token.balanceOf(await deployer.getAddress())).to.equal(0, "Deployer balance is incorrect after transfer");
        expect(await token.balanceOf(await recipient.getAddress())).to.equal(supply, "Recipient balance is incorrect after transfer");
    });

    it("Should approve and transferFrom correctly", async () => {
        // Balances
        expect(await token.balanceOf(await deployer.getAddress())).to.equal(supply, "Deployer balance is incorrect before transferFrom");
        expect(await token.balanceOf(await recipient.getAddress())).to.equal(0, "Recipient balance is incorrect before transferFrom");

        // Allowance
        expect(await token.allowance(await deployer.getAddress(), await router.getAddress())).to.equal(0, "Router allowance is incorrect before approve");
        expect(await token.allowance(await deployer.getAddress(), await recipient.getAddress())).to.equal(0, "Recipient allowance is incorrect before approve");

        const approveResponse = await token.approve(await router.getAddress(), supply);

        // Events
        await expect(approveResponse).to.emit(token, "Approval").withArgs(await deployer.getAddress(), await router.getAddress(), supply);

        // Allowance
        expect(await token.allowance(await deployer.getAddress(), await router.getAddress())).to.equal(supply, "Router allowance is incorrect after approve");
        expect(await token.allowance(await deployer.getAddress(), await recipient.getAddress())).to.equal(0, "Recipient allowance is incorrect after approve");

        const transferFromResponse = await token.connect(router).transferFrom(await deployer.getAddress(), await recipient.getAddress(), supply);

        // Events
        await expect(transferFromResponse).to.emit(token, "Transfer").withArgs(await deployer.getAddress(), await recipient.getAddress(), supply);
        await expect(transferFromResponse).to.emit(token, "AllowanceConsumed").withArgs(await deployer.getAddress(), await router.getAddress(), supply);

        // Balances
        expect(await token.balanceOf(await deployer.getAddress())).to.equal(0, "Deployer balance is incorrect after transferFrom");
        expect(await token.balanceOf(await recipient.getAddress())).to.equal(supply, "Recipient balance is incorrect after transferFrom");

        // Allowance
        expect(await token.allowance(await deployer.getAddress(), await router.getAddress())).to.equal(0, "Router allowance is incorrect after transferFrom");
        expect(await token.allowance(await deployer.getAddress(), await recipient.getAddress())).to.equal(0, "Recipient allowance is incorrect after transferFrom");
    });
});