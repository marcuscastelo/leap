import { ClerkProvider } from '@clerk/nextjs'
import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import { ClientSideProviders } from '~/components/providers/ClientSideProviders'
import { cn } from '~/lib/utils'
import { TopNav } from './_components/TopNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
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
          <ClientSideProviders>
            <div className="flex h-[calc(100vh)] flex-col ">
              <TopNav />
              {children}
            </div>
          </ClientSideProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
