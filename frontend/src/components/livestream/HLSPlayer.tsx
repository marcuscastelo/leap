'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import ReactHlsPlayer from 'react-hls-player'

// Disable SSR for HLSPlayer
export const HLSPlayer = dynamic(() => Promise.resolve(HLSPlayerImpl), {
  ssr: false,
})

function HLSPlayerImpl() {
  const playerRef = useRef<HTMLVideoElement>(null)
  return (
    <ReactHlsPlayer
      src="https://leaptv.ddns.net/live/gary/index.m3u8"
      autoPlay={true}
      hlsConfig={{
        maxLoadingDelay: 4,
        minAutoBitrate: 0,
        lowLatencyMode: true,
      }}
      playerRef={playerRef}
    />
  )
}
