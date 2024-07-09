import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("Donation", function () {
    const TYPE_ETHER = 0;
    const TYPE_ERC20 = 1;

    // Newborn scenario (deploy, first bet creation, etc.)

    async function recentlyDeployedScenario() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const donationRelay = await hre.viem.deployContract("DonationRelay", []);

        const publicClient = await hre.viem.getPublicClient();

        return {
            owner,
            otherAccount,
            publicClient,
            donationRelay,
        };
    }

    describe("Deployment", function () {
        it("Should deploy successfully", async function () {
            await loadFixture(recentlyDeployedScenario);
        });
    });

    describe("Setting/Querying Alias", function () {
        it("Should not have not-yet-registered alias", async function () {
            const { donationRelay, owner } = await loadFixture(recentlyDeployedScenario);
            
            // Registering alias skipped
            // await donationRelay.write.setAlias(["MARUCS"]);

            await expect(donationRelay.read.ownerOfAlias(["MARUCS"])).to.be.rejectedWith("Alias does not exist");
        })

        it("Should set alias to user address", async function () {
            const { donationRelay, owner } = await loadFixture(recentlyDeployedScenario);

            await donationRelay.write.setAlias(["MARUCS"]);

            expect(await donationRelay.read.ownerOfAlias(["MARUCS"])).to.equal(getAddress(owner.account.address));
        })

        it("Should set alias to user address (and free old one)", async function () {
            const { donationRelay, owner } = await loadFixture(recentlyDeployedScenario);

            await donationRelay.write.setAlias(["MARUCS"]);

            expect(await donationRelay.read.ownerOfAlias(["MARUCS"])).to.equal(getAddress(owner.account.address));

            await donationRelay.write.setAlias(["MARUCS121"]);

            expect(await donationRelay.read.ownerOfAlias(["MARUCS121"])).to.equal(getAddress(owner.account.address));
            await expect(donationRelay.read.ownerOfAlias(["MARUCS"])).to.be.rejectedWith("Alias does not exist");
        })
    })

    const donationScenario = async function () {
        const { owner, otherAccount, donationRelay, publicClient } = await loadFixture(recentlyDeployedScenario);

        await donationRelay.write.setAlias(["MARUCS"]);
        expect(await donationRelay.read.ownerOfAlias(["MARUCS"])).to.equal(getAddress(owner.account.address));
        
        return {
            owner,
            otherAccount,
            donationRelay,
            publicClient,
        };
    }

    describe("Donating ETH", function () {
        it("Should transfer the received ETH to the receiver", async function () {
            const { owner, otherAccount, donationRelay, publicClient } = await loadFixture(donationScenario);
            
            const receiver = otherAccount.account.address;
            const receiverOldBalance = await publicClient.getBalance({ address: receiver });

            const amount = parseGwei("1");

            await donationRelay.write.donateEtherToAddress([receiver, "Toma essa doação"], { value: amount });

            expect(await publicClient.getBalance({ address: donationRelay.address })).to.equal(0n);
            expect(await publicClient.getBalance({ address: receiver }) - receiverOldBalance).to.equal(amount);
        })

        it("Should emit Donation event", async function () {
            const { owner, otherAccount, donationRelay, publicClient } = await loadFixture(donationScenario);
            
            const sender = owner.account.address;
            const receiver = otherAccount.account.address;

            const amount = parseGwei("1");

            const hash = await donationRelay.write.donateEtherToAddress([receiver, "Toma essa doação"], { value: amount });
            await publicClient.waitForTransactionReceipt({ hash });

            const donationEvents = await donationRelay.getEvents.Donation();
            expect(donationEvents.length).to.equal(1);
            expect(donationEvents[0].args.sender).to.equal(getAddress(sender));
            expect(donationEvents[0].args.receiver).to.equal(getAddress(receiver));
            const message = donationEvents[0].args.donationMessage;
            expect(message).to.have.property("message", "Toma essa doação")
            expect(message).to.have.property("amount", amount)
            expect(message).to.have.property("donationType", TYPE_ETHER)
            expect(message).to.have.property("tokenAddress", '0x0000000000000000000000000000000000000000')
        })
    })

    // TODO: Donate -1 gwei

    // TODO: Donations of ERC20
})
