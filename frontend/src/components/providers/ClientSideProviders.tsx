'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { config } from '~/config'
import { arbitrum } from 'viem/chains'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '~/lib/reactQuery'

export function ClientSideProviders({
  children,
  env,
}: Readonly<{ children: React.ReactNode; env: { GOOGLE_CLIENT_ID: string } }>) {
  return (
    <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="compact"
            theme={darkTheme()}
            initialChain={arbitrum}
          >
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </GoogleOAuthProvider>
  )
}
