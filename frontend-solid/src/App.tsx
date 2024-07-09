import { createSignal, createEffect, Show } from 'solid-js'
import './index.css' // Import TailwindCSS styles
import { http, createConfig, getBalance, GetBalanceReturnType, deployContract, switchChain, waitForTransactionReceipt, watchAccount, GetAccountReturnType, readContract, writeContract } from '@wagmi/core'
import { mainnet, sepolia, arbitrum, arbitrumSepolia } from '@wagmi/core/chains'
import { getAccount, getEnsName, connect } from '@wagmi/core'
import { injected, metaMask } from '@wagmi/connectors'
import LeapCoin from '../../artifacts/contracts/LeapCoin.sol/LeapCoin.json'

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
  connectors: [injected({
    target: 'metaMask',
  })],
})

const myDApp = () => {
  const [account, setAccount] = createSignal<GetAccountReturnType<typeof config> | null>(getAccount(config))
  const [contractAddress, setContractAddress] = createSignal<`0x${string}` | null>('0xced1d4ae10109b8dcc1df1faa03b650b33431ef6')

  const address = () => account()?.address
  const [totalSupply, setTotalSupply] = createSignal<string | null>(null)
  const [tokenName, setTokenName] = createSignal<string | null>(null)
  const [myLeapBalance, setMyLeapBalance] = createSignal<string | null>(null)

  createEffect(async () => {
    const address_ = address()
    const contractAddress_ = contractAddress()
    if (!contractAddress_) return null
    if (!address_) return null
    const totalSupply: any = await readContract(config, {
      abi: LeapCoin.abi,
      chainId: arbitrumSepolia.id,
      address: contractAddress_,
      functionName: 'totalSupply',
    })
    console.log(`Setting totalSupply to ${totalSupply.toString()}`)
    setTotalSupply(totalSupply.toString())

    const tokenName: any = await readContract(config, {
      abi: LeapCoin.abi,
      chainId: arbitrumSepolia.id,
      address: contractAddress_,
      functionName: 'name',
    })
    console.log(`Setting tokenName to ${tokenName.toString()}`)
    setTokenName(tokenName.toString())

    const myLeapBalance: any = await readContract(config, {
      abi: LeapCoin.abi,
      chainId: arbitrumSepolia.id,
      address: contractAddress_,
      functionName: 'balanceOf',
      args: [address()],
    })

    console.log(`Setting myLeapBalance to ${myLeapBalance.toString()}`)
    setMyLeapBalance(myLeapBalance.toString())
  })

  watchAccount(config, {
    onChange: async (account) => {
      setAccount(account)
      await switchChain(config, { chainId: arbitrumSepolia.id })
    }
  })

  const handleWallet = async () => {
    await connect(config, {
      chainId: arbitrumSepolia.id,
      connector: injected({
        target: 'metaMask',
      })
    })
  }

  const deploy = async () => {
    const { address } = getAccount(config)
    switchChain(config, { chainId: arbitrumSepolia.id })
    const deplopymentTxHash = await deployContract(config, {
      bytecode: LeapCoin.bytecode as `0x${string}`,
      abi: LeapCoin.abi,
      chainId: arbitrumSepolia.id,
    })

    const txReceipt = await waitForTransactionReceipt(config, { hash: deplopymentTxHash })

    txReceipt.contractAddress
    setContractAddress(txReceipt.contractAddress ?? null)
  }
  
  const getLeap = async () => {
    const contractAddress_ = contractAddress()
    if (!contractAddress_) return null
    const txHash = await writeContract(config, {
      abi: LeapCoin.abi,
      chainId: arbitrumSepolia.id,
      address: contractAddress_,
      functionName: 'adminTransfer',
      args: [
        // To address
        address(),
        // Amount to transfer: 1 Leap (1e18)
        '1000000000000000000',
      ],
    })
  }
  return (
    <div class="container mx-auto mt-6">
      <h1 class="text-2xl font-bold">My DApp</h1>
      <div>
        <button onClick={() => {
          handleWallet()
        }}>
          Connect Wallet
        </button>
        <div>Wallet: {address()}</div>
        {/* <div>Ens Name: {ensName()}</div>
        <div>Balance: {arbitrumSepoliaBalance()?.formatted}</div> */}
      </div>

      <Show when={contractAddress() === null}>
        <div>
          <button onClick={deploy}>Deploy</button>
          <div>Contract</div>
          <div>
            Bytecode: {LeapCoin.bytecode}
          </div>
          <div>
            ABI: <pre>{JSON.stringify(LeapCoin.abi, null, 2)}</pre>
          </div>
        </div>
      </Show>

      <Show when={contractAddress() !== null}>
        <div>Contract Address: {contractAddress()}</div>
        <div>Token Name: {tokenName()}</div>
        <div>Total Supply: {totalSupply()}</div>
        <div>My Leap Balance: {myLeapBalance()}</div>
        <button onClick={() => getLeap()        }>Get Leap</button>
      </Show>

    </div>
  )
}

// Render the DApp component
export default myDApp
