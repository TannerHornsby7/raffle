'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
// import campaign type
import type { Campaign } from '@/app/components/CampaignCard'

type HeroCarouselProps = {
    campaigns: Campaign[]
}

export default function HeroCarousel({ campaigns }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(timer)
    }, [campaigns.length])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const goToPrevious = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + campaigns.length) % campaigns.length
        )
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length)
    }

    return (
        <div className="relative h-[70vh] overflow-hidden">
            {campaigns.map((campaign, index) => (
                <div
                    key={campaign.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {campaign.bgVideoUrl ? (
                        <video
                            src={campaign.bgVideoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ filter: 'brightness(50%)' }}
                        />
                    ) : (
                        <Image
                            src={campaign.bgImageUrl}
                            alt={campaign.campaignName}
                            // layout="fill"
                            className="brightness-50 object-cover layout-fill"
                        />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">
                            {campaign.artistName}
                        </h2>
                        <h3 className="text-2xl md:text-4xl font-semibold mb-4">
                            {campaign.campaignName}
                        </h3>
                        <p className="text-lg md:text-xl mb-8 max-w-2xl">
                            {campaign.description}
                        </p>
                        <Button
                            size="lg"
                            onClick={() =>
                                router.push(`/artist/${campaign.id}`)
                            }
                        >
                            Enter Raffle
                        </Button>
                    </div>
                </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {campaigns.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white"
                onClick={goToPrevious}
            >
                <ChevronLeft size={48} />
            </button>
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white"
                onClick={goToNext}
            >
                <ChevronRight size={48} />
            </button>
        </div>
    )
}
