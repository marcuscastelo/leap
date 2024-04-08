import { ethers } from 'hardhat'

async function main() {
    const factory = await ethers.getContractFactory('LeapCoin')    
    const token = await factory.deploy()

    console.log('Token deployed to:', await token.getAddress())
}

main();