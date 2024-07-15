'use client'

import { normalize } from 'path'
import { useEnsAvatar } from 'wagmi'
import { AvatarFallback } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useEffect } from 'react'
import { config } from '~/config'
import { mainnet } from 'viem/chains'

export function EnsAvatar({ ensName }: { ensName: string }) {
  const result = useEnsAvatar({
    config,
    assetGatewayUrls: {
      ipfs: 'https://cloudflare-ipfs.com',
    },
    name: normalize(ensName),
    chainId: mainnet.id,
  })

  useEffect(() => {
    console.log('EnsAvatar', result.data)
  })
  return (
    <>
      {result.isPending || result.isError ? (
        <>
          {result.isError ? (
            <div>{result.error?.message}</div>
          ) : (
            <AvatarFallback />
          )}
        </>
      ) : (
        <AvatarImage src={result.data ?? ''} alt={`${ensName} avatar`} />
      )}
    </>
  )
}
