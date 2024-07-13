'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { GoogleLogin } from '@react-oauth/google'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address } = useAccount()
  return (
    <div>
      <h1>Hello, {address}</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.dir(credentialResponse)
        }}
        onError={() => {
          console.log('Login Failed')
        }}
      />
      <ConnectButton showBalance={false} />
    </div>
  )
}
