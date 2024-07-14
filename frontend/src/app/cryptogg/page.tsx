'use client'

import {
  waitForTransactionReceipt,
  readContract,
  writeContract,
} from '@wagmi/core'

import DonationRelay from '~/DonationRelay.json'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDeployContract, useWatchContractEvent } from 'wagmi'
import { arbitrumSepolia } from 'viem/chains'
import { config } from '~/config'
import { parseGwei } from 'viem'

export default function Page() {
  const { address } = useAccount()

  const EMPTY = '0x0000000000000000000000000000000000000000'

  const [contractAddress, setContractAddress] = useState(
    '0x118481c2742adb18df9cbcb4e99dcc9d259dac9e',
  )

  const [message, setMessage] = useState('')

  const toAddress = '0x8522AeA1F57F447e0Ac450e8d49aF1C9B652a98C'

  const [marucsOwner, setMarucsOwner] = useState('Loading...')

  const { deployContractAsync } = useDeployContract()

  const deployContract = async () => {
    const hash = await deployContractAsync({
      abi: DonationRelay.abi,
      bytecode: DonationRelay.bytecode as `0x${string}`,
      chainId: arbitrumSepolia.id,
    })

    const txReceipt = await waitForTransactionReceipt(config, {
      hash,
    })

    setContractAddress(txReceipt.contractAddress ?? '')
  }

  const setAlias = async (alias: string) => {
    await writeContract(config, {
      abi: DonationRelay.abi,
      chainId: arbitrumSepolia.id,
      address: contractAddress as `0x${string}`,
      functionName: 'setAlias',
      args: [alias],
    })

    fetchMarucsOwner()
  }

  const getOwnerOfAlias = async (alias: string) => {
    try {
      return await readContract(config, {
        abi: DonationRelay.abi,
        chainId: arbitrumSepolia.id,
        address: contractAddress as `0x${string}`,
        functionName: 'ownerOfAlias',
        args: [alias],
      })
    } catch (e) {
      return (e as Record<'message', string>).message || 'Error'
    }
  }

  const fetchMarucsOwner = async () => {
    const owner = await getOwnerOfAlias('MARUCS')
    setMarucsOwner(owner as string)
  }

  const donateToAddress = async () => {
    const donationAmount = parseGwei('100')

    const txHash = await writeContract(config, {
      abi: DonationRelay.abi,
      chainId: arbitrumSepolia.id,
      address: contractAddress as `0x${string}`,
      functionName: 'donateEtherToAddress',
      args: [toAddress, 'OLA GARY'],
      value: donationAmount,
    })

    console.log('Donation txHash:', txHash)
  }

  useEffect(() => {
    fetchMarucsOwner()
  }, [contractAddress])

  useWatchContractEvent({
    config,
    chainId: arbitrumSepolia.id,
    address: contractAddress as `0x${string}`,
    abi: DonationRelay.abi,
    eventName: 'DonationReceived',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLogs: (logs: any) => {
      console.dir(logs)
      console.dir(logs[0])
      console.dir(logs[0].args)
      console.dir(logs[0].args.sender)
      console.dir(logs[0].args.receiver)
      console.dir(logs[0].args.donationMessage)
      console.dir(logs[0].args.donationMessage.message)
      console.dir(logs[0].args.donationMessage.amount)
      console.dir(logs[0].args.donationMessage.donationType)
      console.dir(logs[0].args.donationMessage.tokenAddress)
      console.dir(logs[0].args.donationMessage.timestamp)
      const {
        sender,
        receiver,
        donationMessage: {
          message,
          amount,
          donationType,
          tokenAddress,
          timestamp,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = logs[0].args as any
      console.dir(sender)
      console.dir(receiver)
      console.dir(message)
      console.dir(amount)
      console.dir(donationType)
      console.dir(tokenAddress)
      console.dir(timestamp)
      console.log('----')
      console.dir(new Date(Number(timestamp) * 1000).toDateString())
      console.log('----')
      const logMessage = `Donation received from ${sender} to ${receiver} with message: ${message} and amount: ${amount} ${donationType} (token address: ${tokenAddress}) at ${new Date(
        Number(timestamp) * 1000,
      ).toDateString()}`

      new Audio().play()
      console.log(logMessage)
      setMessage(logMessage)
    },
  })

  if (address === undefined) {
    return (
      <div>
        {message && <p>{message}</p>}
        <ConnectButton showBalance={false} />
      </div>
    )
  }

  return (
    <div>
      {message && <p>{message}</p>}
      <ConnectButton showBalance={false} />

      {(contractAddress !== EMPTY && (
        <div>
          <h1>Contract Address</h1>
          <p>{contractAddress}</p>
          <button onClick={() => setAlias('MARUCS')}>Set alias MARUCS</button>
          <p>Owner of alias MARUCS: {marucsOwner}</p>
          <button onClick={donateToAddress}>Donate to {toAddress}</button>
        </div>
      )) || (
        <div>
          <h1>Deploy a new DonationRelay contract</h1>
          <button onClick={deployContract}>Deploy</button>
        </div>
      )}
    </div>
  )
}
