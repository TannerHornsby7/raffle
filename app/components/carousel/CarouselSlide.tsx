'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import type { Campaign } from '@/app/components/CampaignCard'

type CarouselSlideProps = {
    campaign: Campaign
    videoUrl?: string
    isActive: boolean
    direction: 'left' | 'right' | null
    onRaffleClick: () => void
}

export function CarouselSlide({
    campaign,
    videoUrl,
    isActive,
    direction,
    onRaffleClick,
}: CarouselSlideProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)

    useEffect(() => {
        const vid = videoRef.current
        if (!vid || !videoUrl) return

        const handleCanPlay = () => {
            setIsVideoLoaded(true)
            if (isActive) {
                const playPromise = vid.play()
                if (playPromise) {
                    playPromise.catch((err) => {
                        console.warn('Video play failed:', err)
                    })
                }
            }
        }

        vid.currentTime = 0
        vid.load()

        vid.addEventListener('canplay', handleCanPlay)
        vid.addEventListener('loadeddata', handleCanPlay)

        return () => {
            vid.removeEventListener('canplay', handleCanPlay)
            vid.removeEventListener('loadeddata', handleCanPlay)
        }
    }, [videoUrl, isActive])

    // Handle active state changes
    useEffect(() => {
        const vid = videoRef.current
        if (!vid) return

        if (isActive) {
            if (vid.readyState >= 3) {
                const playPromise = vid.play()
                if (playPromise) {
                    playPromise.catch(console.warn)
                }
            }
        } else {
            vid.pause()
            vid.currentTime = 0
        }
    }, [isActive])

    const slideAnimation =
        direction === null
            ? ''
            : direction === 'left'
            ? 'animate-slide-from-right'
            : 'animate-slide-from-left'

    return (
        <div
            className={`absolute inset-0 transition-transform duration-700
                ${isActive ? 'z-10' : 'z-0 pointer-events-none'}
                ${isActive ? slideAnimation : ''}`}
        >
            {/* Background Image */}
            <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                    isVideoLoaded && isActive ? 'opacity-0' : 'opacity-100'
                }`}
            >
                <Image
                    src={campaign.bgImageUrl}
                    alt={campaign.campaignName}
                    fill
                    priority={isActive}
                    className="object-cover brightness-50"
                />
            </div>

            {/* Video Background */}
            {videoUrl && (
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                        isVideoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover brightness-50"
                        src={videoUrl}
                    />
                </div>
            )}

            {/* Content Overlay */}
            <div
                className={`absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white
                    transition-all duration-700 transform ${
                        isActive
                            ? 'translate-y-0 opacity-100 scale-100'
                            : 'translate-y-8 opacity-0 scale-95'
                    }`}
            >
                <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {campaign.artistName}
                </h2>
                <h3 className="text-2xl md:text-4xl font-semibold mb-4 drop-shadow-lg">
                    {campaign.campaignName}
                </h3>
                <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow leading-relaxed">
                    {campaign.description}
                </p>
                <Button
                    size="lg"
                    onClick={onRaffleClick}
                    className="hover:scale-105 active:scale-95 transition-transform duration-200
                        bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/40 
                        text-white font-semibold px-8"
                >
                    Enter Raffle
                </Button>
            </div>
        </div>
    )
}
