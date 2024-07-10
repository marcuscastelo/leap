'use client'

import axios from 'axios'
import {
  http,
  createConfig,
  getBalance,
  GetBalanceReturnType,
  deployContract,
  switchChain,
  waitForTransactionReceipt,
  watchAccount,
  GetAccountReturnType,
  readContract,
  writeContract,
} from '@wagmi/core'

import DonationRelay from '~/../../blockchain/artifacts/contracts/Donation/DonationRelay.sol/DonationRelay.json'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDeployContract, useWatchContractEvent } from 'wagmi'
import { arbitrumSepolia } from 'viem/chains'
import { config } from '~/config'
import { parseEther, parseGwei } from 'viem'

export default function Page() {
  const { address } = useAccount()

  const EMPTY = '0x0000000000000000000000000000000000000000'

  const [contractAddress, setContractAddress] = useState(
    '0x118481c2742adb18df9cbcb4e99dcc9d259dac9e',
  )

  const toAddress = '0x8522AeA1F57F447e0Ac450e8d49aF1C9B652a98C'

  const [marucsOwner, setMarucsOwner] = useState('Loading...')

  const { deployContractAsync } = useDeployContract()
  const handleReceived = async () => {
    const response = await axios.post(
      'https://76bm8iyk24.execute-api.us-east-1.amazonaws.com/v1/integrations/streamlabs',
      '',
      {
        params: {
          name: 'Fishstickslol',
          message: 'I love Fishsticks!',
          identifier: 'fishingthesticks@gmail.com',
          amount: 10,
          currency: 'USD',
        },
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.8',
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhYnJpZXVsd0BnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoie1wiTmFtZVwiOlwiR2FicmllbCBBbHZlc1wiLFwiRW1haWxcIjpcImdhYnJpZXVsd0BnbWFpbC5jb21cIixcIklkXCI6Mzk5MDJ9IiwibmJmIjoxNzIwNTQ3Mjg3LCJleHAiOjE3MjMxMzkyODcsImlhdCI6MTcyMDU0NzI4N30.S3tnQ_wG55YfHfAAkecch70bzgAsSGVxXxQ-9DrR8l0',
          'content-length': '0',
          origin: 'https://pixgg.com',
          priority: 'u=1, i',
          referer: 'https://pixgg.com/',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'sec-gpc': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
      },
    )

    console.log(response)
  }

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

      console.log(logMessage)
      alert(logMessage)
    },
  })

  if (address === undefined) {
    return (
      <div>
        <ConnectButton showBalance={false} />
      </div>
    )
  }

  return (
    <div>
      <ConnectButton showBalance={false} />

      {(contractAddress !== EMPTY && (
        <div>
          <h1>Contract Address</h1>
          <p>{contractAddress}</p>
          <button
            className="btn btn-primary"
            onClick={() => setAlias('MARUCS')}
          >
            Set alias MARUCS
          </button>
          <p>Owner of alias MARUCS: {marucsOwner}</p>
          <button className="btn btn-primary" onClick={donateToAddress}>
            Donate to {toAddress}
          </button>
        </div>
      )) || (
        <div>
          <h1>Deploy a new DonationRelay contract</h1>
          <button className="btn btn-primary" onClick={deployContract}>
            Deploy
          </button>
        </div>
      )}
    </div>
  )
}
