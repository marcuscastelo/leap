'use client'
import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import './globals.css'

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { config } from '~/config'
import { arbitrum } from 'viem/chains'

const queryClient = new QueryClient()

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  )
}
