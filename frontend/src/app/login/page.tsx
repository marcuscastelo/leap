'use client'

import { GoogleLogin } from '@react-oauth/google'
import { LoginForm } from './LoginForm'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Page() {
  return (
    <div className=" mx-auto mt-10 w-1/2">
      <LoginForm />
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
