import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import { ClientSideProviders } from '~/components/providers/ClientSideProviders'
import { cn } from '~/lib/utils'
import { ChannelSidebar } from './_components/channel-sidebar'
import { TopNavigation } from './_components/top-navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
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
              <TopNavigation />
              <div className="flex w-full">
                <ChannelSidebar />
                <main className="flex flex-1">{children}</main>
              </div>
            </div>
          </ClientSideProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
