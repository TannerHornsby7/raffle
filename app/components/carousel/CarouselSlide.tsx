'use client'

import { useState } from 'react'
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
    const [isGifLoaded, setIsGifLoaded] = useState(false)

    return (
        <div
            className={`absolute inset-0 transition-all ease-in-out duration-700
                ${
                    isActive
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                }`}
        >
            {/* Background Color */}
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    backgroundColor: campaign.bgColor,
                    opacity: videoUrl && isGifLoaded ? 0 : 1,
                }}
            />

            {/* GIF Background */}
            {videoUrl && (
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                        isGifLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={videoUrl}
                        alt={`${campaign.campaignName} animation`}
                        fill
                        priority={isActive}
                        className="object-cover"
                        onLoadingComplete={() => setIsGifLoaded(true)}
                        unoptimized
                    />
                </div>
            )}

            {/* Content Overlay */}
            <div
                className={`absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16
                    transition-all duration-700 ${
                        isActive
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-0'
                    }`}
                style={{ color: campaign.foregroundColor }}
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
