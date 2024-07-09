import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("Bet", function () {

    const STATE_UNINITIALIZED = 0;
    const STATE_PROPOSAL = 1;
    const STATE_READY = 2;
    const STATE_OPEN = 3;
    const STATE_RESOLVED = 4;
    const STATE_CANCELLED = 5;

    function createBet({
        id,
        params,
        state,
        winningOptionId
    }: {
        id: bigint;
        params: { name: string };
        state: number;
        winningOptionId: bigint;
    }) {
        return [id, params, state, winningOptionId]
    }

    // Newborn scenario (deploy, first bet creation, etc.)

    async function recentlyDeployedScenario() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const betManager = await hre.viem.deployContract("BetManager", []);

        const publicClient = await hre.viem.getPublicClient();

        return {
            owner,
            otherAccount,
            publicClient,
            betManager,
        };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { owner, betManager } = await loadFixture(recentlyDeployedScenario);

            expect(await betManager.read.owner()).to.equal(getAddress(owner.account.address));
        });

        it("Should have no bets", async function () {
            const { betManager } = await loadFixture(recentlyDeployedScenario);

            expect(await betManager.read.betCount()).to.equal(0n);
        })
    });

    describe("Bet creation (Yes/No)", function () {
        it("Should increment bet count", async function () {
            const { betManager } = await loadFixture(recentlyDeployedScenario);

            await betManager.write.createYesNoBet(["Will it rain tomorrow?"]);

            expect(await betManager.read.betCount()).to.equal(1n);
        })

        it("Should add right bet to mapping", async function () {
            const { betManager } = await loadFixture(recentlyDeployedScenario);

            await betManager.write.createYesNoBet(["Will it rain tomorrow?"]);
            expect(await betManager.read.bets([1])).to.deep.equal(createBet({
                id: 1n,
                params: { name: "Will it rain tomorrow?" },
                state: STATE_PROPOSAL,
                winningOptionId: 0n,
            }));
        })

        it("Should emit BetCreated event", async function () {
            const { publicClient, betManager } = await loadFixture(recentlyDeployedScenario);

            const hash = await betManager.write.createYesNoBet(["Will it rain tomorrow?"])
            await publicClient.waitForTransactionReceipt({ hash })

            const createYesNoBetEvents = await betManager.getEvents.BetCreated();
            expect(createYesNoBetEvents.length).to.equal(1);
            expect(createYesNoBetEvents[0].args.betId).to.equal(1n);
        })

        // TODO: revert if empty string
        it("Should allow empty string as bet name", async function () {
            const { betManager } = await loadFixture(recentlyDeployedScenario);

            await betManager.write.createYesNoBet([""]);

            expect(await betManager.read.bets([1])).to.deep.equal(createBet({
                id: 1n,
                params: { name: "" },
                state: STATE_PROPOSAL,
                winningOptionId: 0n,
            }));
        })

        // it Should set right options
        // it Should update state to proposal
        // it Should emit BetStateChanged event
    })

    // User interaction scenarios
    
    async function betCreatedScenario() {
        const fixture = await loadFixture(recentlyDeployedScenario);
        await fixture.betManager.write.createYesNoBet(["Will it rain tomorrow?"]);
        return fixture;
    }

    describe("Approve bet", function () {
        // it Should revert if bet is not in proposal
        it("Should update state to ready successfully when on proposal", async function () {
            const { betManager } = await loadFixture(betCreatedScenario);

            await betManager.write.approveBet([1n]);

            expect(await betManager.read.bets([1])).to.deep.equal(createBet({
                id: 1n,
                params: { name: "Will it rain tomorrow?" },
                state: STATE_READY,
                winningOptionId: 0n,
            }));
        })

        it("Should emit BetStateChanged event", async function () {
            const { publicClient, betManager } = await loadFixture(betCreatedScenario);

            const hash = await betManager.write.approveBet([1n]);
            await publicClient.waitForTransactionReceipt({ hash });

            const betStateChangedEvents = await betManager.getEvents.BetStateChanged();
            expect(betStateChangedEvents.length).to.equal(1);
            expect(betStateChangedEvents[0].args.betId).to.equal(1n);
            expect(betStateChangedEvents[0].args.state).to.equal(STATE_READY);
        })
    })

    async function betApprovedScenario() {
        const fixture = await loadFixture(betCreatedScenario);
        await fixture.betManager.write.approveBet([1n]);
        return fixture;
    }

    describe("Open bet", function () {
        // it Should revert if bet is not ready
        it("Should update state to open successfully when on proposal", async function () {
            const { betManager } = await loadFixture(betApprovedScenario);

            await betManager.write.openBet([1n]);

            expect(await betManager.read.bets([1])).to.deep.equal(createBet({
                id: 1n,
                params: { name: "Will it rain tomorrow?" },
                state: STATE_OPEN,
                winningOptionId: 0n,
            }));
        })

        it("Should emit BetStateChanged event", async function () {
            const { publicClient, betManager } = await loadFixture(betApprovedScenario);

            const hash = await betManager.write.openBet([1n]);
            await publicClient.waitForTransactionReceipt({ hash });

            const betStateChangedEvents = await betManager.getEvents.BetStateChanged();
            expect(betStateChangedEvents.length).to.equal(1);
            expect(betStateChangedEvents[0].args.betId).to.equal(1n);
            expect(betStateChangedEvents[0].args.state).to.equal(STATE_OPEN);
        })
    })

    // TODO: resolve bet scenarios
        // TODO: check rewards scenarios (solo, multiple winners, etc.)
    // TODO: cancel bet scenarios
        // TODO: check refunds scenarios (solo, multiple winners, etc.)

    describe("Place bet", function () {
        it("Should revert if bet is not open", async function () {
            const { betManager } = await loadFixture(betCreatedScenario);

            await expect(betManager.write.placeBet([1n, 1n, 1n])).to.be.rejectedWith("Bet is not open");
        })

        it("Should revert if option is not valid", async function () {
        })
    })

    // TODO: take bet scenarios

    // TODO: change all non-owner function calls to use otherAccount

})
