import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientSideProviders } from '~/components/providers/ClientSideProviders'
import { cn } from '~/lib/utils'
import { env } from '~/lib/env'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://vjs.zencdn.net/7.19.2/video-js.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark',
          inter.variable,
        )}
      >
        <ClientSideProviders env={env}>{children}</ClientSideProviders>
      </body>
    </html>
  )
}
