// import { expect } from "chai";
// import { LeapCoin, LeapETHPool } from "../typechain-types";
// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
// import { getAddress } from "viem";

// describe("LeapETHPool", async () => {
//     let token: LeapCoin;
//     let supply: bigint;
//     let decimals: bigint;
//     let deployer: HardhatEthersSigner;
//     let recipient: HardhatEthersSigner;
//     let router: HardhatEthersSigner;

//     let pool: LeapETHPool;

//     beforeEach(async () => {
//         // Deploy LeapCoin
//         [deployer, recipient, router] = await ethers.getSigners();
//         const tokenFactory = await ethers.getContractFactory("LeapCoin");
//         token = await tokenFactory.deploy();
//         await token.waitForDeployment();
//         supply = await token.totalSupply();
//         decimals = await token.decimals_();

//         // Give some LEAP to the deployer
//         await token.updateIncentiveClaimRights(deployer);
//         await token.claimAllRights();

//         // Deploy LeapETHPool
//         const poolFactory = await ethers.getContractFactory("LeapETHPool");
//         pool = await poolFactory.deploy(await token.getAddress());
//     });

//     afterEach(async () => {
//         // Reset hardhat after each test
//         await ethers.provider.send("hardhat_reset", []);
//     });

//     it("Should have 1 ETH in the deployer's wallet for testing purposes", async () => {
//         const balance = await ethers.provider.getBalance(await deployer.getAddress());
//         expect(balance).to.be.greaterThan(ethers.parseEther("1"), "ETH balance is incorrect");
//     });

//     it("Should have 1003 LEAP in the deployer's wallet for testing purposes", async () => {
//         const balance = await token.balanceOf(await deployer.getAddress());
//         expect(balance).to.equal(ethers.parseUnits("1003", decimals), "LEAP balance is incorrect");
//     });

//     it("Should start with 0 ETH in the pool", async () => {
//         const address = await pool.getAddress();
//         const balance = await ethers.provider.getBalance(address);
//         expect(balance).to.equal(0, "ETH balance is incorrect");
//     });

//     it("Should start with 0 LEAP in the pool", async () => {
//         const address = await pool.getAddress();
//         const balance = await token.balanceOf(address);
//         expect(balance).to.equal(0, "LEAP balance is incorrect");
//     });

//     it("Should error if initialized with 0 ETH", async () => {
//         await expect(pool.initializePool(1, { value: ethers.parseEther("0") })).
//         to.be.revertedWith("LeapETHPool: Invalid ETH amount");
//     });

//     it("Should error if initialized with 0 LEAP", async () => {
//         await expect(pool.initializePool(0, { value: ethers.parseEther("1") })).
//         to.be.revertedWith("LeapETHPool: Invalid LEAP amount");
//     });

//     it("Should error if initialized with 0 LEAP allowance", async () => {
//         await expect(pool.initializePool(1, { value: ethers.parseEther("1") })).
//         to.be.revertedWith("LeapETHPool: Insufficient allowance");
//     });

//     it("Should error if initializedw with more than allowance", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await expect(pool.initializePool(ethers.parseUnits("1000", decimals), { value: ethers.parseEther("1") })).
//         to.be.revertedWith("LeapETHPool: Insufficient allowance");
//     });

//     it("Should have correct amounts of ETH and LEAP, and quote in the pool after init", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("1") });
//         const address = await pool.getAddress();
//         const ethBalance = await ethers.provider.getBalance(address);
//         const tokenBalance = await token.balanceOf(address);
//         expect(ethBalance).to.equal(ethers.parseEther("1"), "ETH balance is incorrect");
//         expect(tokenBalance).to.equal(ethers.parseUnits("1", decimals), "ETH balance is incorrect");

//         const quote = await pool.quote(ethers.parseUnits("1", decimals));
//         expect(quote).to.equal(ethers.parseEther("1"), "Quote is incorrect");
//     });

//     it("Should have correct quote with 100 to 1 in the pool after init", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("100") });
//         const address = await pool.getAddress();
//         const ethBalance = await ethers.provider.getBalance(address);
//         const tokenBalance = await token.balanceOf(address);
//         expect(ethBalance).to.equal(ethers.parseEther("100"), "ETH balance is incorrect");
//         expect(tokenBalance).to.equal(ethers.parseUnits("1", decimals), "ETH balance is incorrect");

//         const quote = await pool.quote(ethers.parseUnits("1", decimals));
//         expect(quote).to.equal(ethers.parseEther("100"), "Quote is incorrect");
//     });

//     it("Should error if initialized twice", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("1") });
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await expect(pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("1") })).
//         to.be.revertedWith("LeapETHPool: Pool already initialized");
//     });

//     it("Should error if swap on uninitialized pool", async () => {
//         await expect(pool.swapToEth(ethers.parseUnits("1", decimals))).to.revertedWith("LeapETHPool: Pool not initialized");
//     });

//     it("Should error if swap with 0 LEAP allowance", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("1") });
//         await expect(pool.swapToEth(ethers.parseUnits("1", decimals))).to.revertedWith("LeapETHPool: Insufficient allowance");
//     });

//     it("Should swap 1 LEAP correctly", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("1") });

//         const leapBalanceBefore = await token.balanceOf(await deployer.getAddress());
//         const ethBalanceBefore = await ethers.provider.getBalance(await deployer.getAddress());

//         const approveResponse = await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));

//         const quote = await pool.quote(ethers.parseUnits("1", decimals));
//         await expect(pool.swapToEth(ethers.parseUnits("1", decimals))).to.emit(pool, "Swap").withArgs(deployer, ethers.parseUnits("1", decimals), ethers.parseEther("1"));

//         const leapBalanceAfter = await token.balanceOf(await deployer.getAddress());
//         const ethBalanceAfter = await ethers.provider.getBalance(await deployer.getAddress());

//         expect(leapBalanceAfter).to.equal(leapBalanceBefore - ethers.parseUnits("1", decimals), "LEAP balance is incorrect");
//         // TODO: get spent gas and include in assertion
//         expect(ethBalanceAfter).to.greaterThan(ethBalanceBefore + ethers.parseEther("0.001"), "ETH balance is too low");
//         expect(ethBalanceAfter).to.lessThan(ethBalanceBefore + quote, "ETH balance is too big");

//         expect(await pool.ethReserve()).to.equal(ethers.parseEther("0"), "ETH reserve is incorrect");
//         expect(await pool.leapReserve()).to.equal(ethers.parseUnits("2", decimals), "LEAP reserve is incorrect");
//         expect(await pool.quote(ethers.parseUnits("1", decimals))).to.equal(ethers.parseEther("0"), "Quote is incorrect");
//     });

//     it("Should swap 0.5 LEAP correctly", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("1") });

//         const leapBalanceBefore = await token.balanceOf(await deployer.getAddress());
//         const ethBalanceBefore = await ethers.provider.getBalance(await deployer.getAddress());

//         const approveResponse = await token.approve(await pool.getAddress(), ethers.parseUnits("0.5", decimals));

//         const quote = await pool.quote(ethers.parseUnits("0.5", decimals));
//         console.log("Quote: ", quote.toString());
//         await expect(pool.swapToEth(ethers.parseUnits("0.5", decimals))).to.emit(pool, "Swap").withArgs(deployer, ethers.parseUnits("0.5", decimals), ethers.parseEther("0.5"));

//         const leapBalanceAfter = await token.balanceOf(await deployer.getAddress());
//         const ethBalanceAfter = await ethers.provider.getBalance(await deployer.getAddress());

//         expect(leapBalanceAfter).to.equal(leapBalanceBefore - ethers.parseUnits("0.5", decimals), "LEAP balance is incorrect");
//         // TODO: get spent gas and include in assertion
//         expect(ethBalanceAfter).to.greaterThan(ethBalanceBefore + ethers.parseEther("0.001"), "ETH balance is too low");
//         expect(ethBalanceAfter).to.lessThan(ethBalanceBefore + quote, "ETH balance is too big");

//         expect(await pool.ethReserve()).to.equal(ethers.parseEther("0.5"), "ETH reserve is incorrect");
//         expect(await pool.leapReserve()).to.equal(ethers.parseUnits("1.5", decimals), "LEAP reserve is incorrect");
//         const newQuote = await pool.quote(ethers.parseUnits("0.5", decimals));
//         expect(newQuote).to.equal(ethers.toBigInt(5e8) * ethers.toBigInt(1e9), "Quote is incorrect");

//         console.log("New quote: ", );
//     });

//     it("Should error if swapping more than 1 LEAP", async () => {
//         await token.approve(await pool.getAddress(), ethers.parseUnits("1", decimals));
//         await pool.initializePool(ethers.parseUnits("1", decimals), { value: ethers.parseEther("1") });

//         await token.approve(await pool.getAddress(), ethers.parseUnits("2", decimals));
//         await expect(pool.swapToEth(ethers.parseUnits("2", decimals))).to.revertedWith("LeapETHPool: Insufficient ETH reserve on the pool");
//     })
// });