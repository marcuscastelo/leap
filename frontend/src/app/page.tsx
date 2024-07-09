'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address } = useAccount()
  return (
    <div>
      <h1>Hello, {address}</h1>
      <ConnectButton showBalance={false} />
    </div>
  )
}
