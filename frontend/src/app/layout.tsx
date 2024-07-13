import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientSideProviders } from '~/components/ClientSideProviders'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-zinc-900">
      <body className={inter.className}>
        <ClientSideProviders>{children}</ClientSideProviders>
      </body>
    </html>
  )
}
