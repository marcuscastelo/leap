/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

// Credits: https://github.com/Glimesh/broadcast-box/blob/main/web/src/components/player/index.js
import { createRef, useEffect, useState } from 'react'
import { parseLinkHeader } from '@web3-storage/parse-link-header'
import dynamic from 'next/dynamic'

export const WebRTCPlayer = dynamic(() => Promise.resolve(WebRTCPlayerImpl), {
  ssr: false,
})

function WebRTCPlayerImpl({ streamId }: { streamId: string }) {
  const videoRef = createRef<HTMLVideoElement>()
  const [videoLayers, setVideoLayers] = useState([])
  const [mediaSrcObject, setMediaSrcObject] = useState<MediaStream | null>(null)
  const [layerEndpoint, setLayerEndpoint] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onLayerChange = (event: { target: { value: any } }) => {
    fetch(layerEndpoint, {
      method: 'POST',
      body: JSON.stringify({ mediaId: '1', encodingId: event.target.value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  useEffect(() => {
    if (videoRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(videoRef.current as any).srcObject = mediaSrcObject
    }
  }, [mediaSrcObject, videoRef])

  useEffect(() => {
      const peerConnection = new RTCPeerConnection() // eslint-disable-line

    peerConnection.ontrack = function (event) {
      setMediaSrcObject(event.streams[0])
    }

    peerConnection.addTransceiver('audio', { direction: 'recvonly' })
    peerConnection.addTransceiver('video', { direction: 'recvonly' })

    peerConnection.createOffer().then((offer) => {
      offer.sdp = offer.sdp?.replace(
        'useinbandfec=1',
        'useinbandfec=1;stereo=1',
      )
      peerConnection.setLocalDescription(offer)

      fetch(`https://b.siobud.com/api/whep`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${streamId}`,
          'Content-Type': 'application/sdp',
        },
      })
        .then((r) => {
          const parsedLinkHeader = parseLinkHeader(r.headers.get('Link'))

          if (!parsedLinkHeader) {
            throw new Error('No Link header found')
          }

          setLayerEndpoint(
            `${window.location.protocol}//${parsedLinkHeader['urn:ietf:params:whep:ext:core:layer'].url}`,
          )

          const evtSource = new EventSource(
            `${window.location.protocol}//${parsedLinkHeader['urn:ietf:params:whep:ext:core:server-sent-events'].url}`,
          )
          evtSource.onerror = () => evtSource.close()

          evtSource.addEventListener('layers', (event) => {
            const parsed = JSON.parse(event.data)
            setVideoLayers(parsed['1'].layers.map((l: any) => l.encodingId))
          })

          return r.text()
        })
        .then((answer) => {
          peerConnection.setRemoteDescription({
            sdp: answer,
            type: 'answer',
          })
        })
    })

    return function cleanup() {
      peerConnection.close()
    }
  }, [streamId])

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        controls
        playsInline
        className={`w-full bg-black`}
      />

      {videoLayers.length >= 2 && (
        <select
          defaultValue="disabled"
          onChange={onLayerChange}
          className="focus:shadow-outline w-full appearance-none rounded border border-gray-700 bg-gray-700 px-3 py-2 leading-tight text-white shadow-md placeholder:text-gray-200 focus:outline-none"
        >
          <option value="disabled" disabled={true}>
            Choose Quality Level
          </option>
          {videoLayers.map((layer) => {
            return (
              <option key={layer} value={layer}>
                {layer}
              </option>
            )
          })}
        </select>
      )}
    </>
  )
}
