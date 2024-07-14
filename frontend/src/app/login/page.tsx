import { GoogleLogin } from '@react-oauth/google'
import { LoginForm } from './LoginForm'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default async function Page() {
  return (
    <div className=" w-1/2 mx-auto mt-10">
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
