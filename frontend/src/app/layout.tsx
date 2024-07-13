import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientSideProviders } from '~/components/ClientSideProviders'
import { cn } from '~/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark',
          inter.variable,
        )}
      >
        <ClientSideProviders>{children}</ClientSideProviders>
      </body>
    </html>
  )
}
