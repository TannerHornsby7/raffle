'use client'

import { useRef, useEffect } from 'react'

type BackgroundVideoProps = {
  src: string
}

export default function BackgroundVideo({ src }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5 // Slow down the video for a more ambient effect
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
      <video
        ref={videoRef}
        className="absolute min-w-full min-h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  )
}

