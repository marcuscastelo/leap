import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientSideProviders } from '~/components/ClientSideProviders'
import { cn } from '~/lib/utils'
import { env } from '~/lib/env'
import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE_NAME, readAccessToken } from '~/server/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value
  const isAuthorized = !!accessToken

  const authData = await readAccessToken(accessToken)

  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark',
          inter.variable,
        )}
      >
        {isAuthorized ? (
          <pre>
            <code>{JSON.stringify({ accessToken }, null, 2)}</code>
            <code>{JSON.stringify({ authData }, null, 2)}</code>
          </pre>
        ) : (
          <h1>Not authorized</h1>
        )}
        <ClientSideProviders env={env}>{children}</ClientSideProviders>
      </body>
    </html>
  )
}
