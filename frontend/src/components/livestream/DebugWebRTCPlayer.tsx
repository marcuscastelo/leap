'use client'

import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { WebRTCPlayer } from './WebRTCPlayer'

export function DebugWebRTCPlayer({ streamId }: { streamId: string }) {
  const [streamBackend, setStreamBackend] = useState<string>(
    'https://b.siobud.com/api/whep',
  )

  useEffect(() => {
    const storedStreamBackend = localStorage.getItem('streamBackend')
    if (storedStreamBackend) {
      setStreamBackend(storedStreamBackend)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('streamBackend', streamBackend)
  }, [streamBackend])

  return (
    <div className="">
      <Input
        placeholder="Stream backend"
        value={streamBackend}
        onChange={(e) => setStreamBackend(e.target.value)}
      />
      <WebRTCPlayer whepAPIUrl={streamBackend} streamId={streamId} />
    </div>
  )
}
