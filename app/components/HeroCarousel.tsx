'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Campaign } from '@/app/components/CampaignCard'
import outputs from '@/amplify_outputs.json'
import { Amplify } from 'aws-amplify'
import { getUrl } from 'aws-amplify/storage'

Amplify.configure(outputs, { ssr: true })

type HeroCarouselProps = {
    campaigns: Campaign[]
}

export default function HeroCarousel({ campaigns }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [presignedUrls, setPresignedUrls] = useState<Record<string, string>>(
        {}
    )
    const router = useRouter()
    const timerRef = useRef<NodeJS.Timeout>()

    // Load all video URLs in parallel
    useEffect(() => {
        const loadVideos = async () => {
            const results = await Promise.all(
                campaigns.map(async (campaign) => {
                    const { bgVideoPath } = campaign
                    const result = await getUrl({ path: bgVideoPath })
                    return [bgVideoPath, result.url.toString()] as const
                })
            )
            setPresignedUrls(Object.fromEntries(results))
        }

        loadVideos()
    }, [campaigns])

    // Reset and restart timer when slide changes
    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
        timerRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length)
        }, 5000)
    }

    // Initialize timer
    useEffect(() => {
        resetTimer()
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [campaigns.length])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
        resetTimer()
    }

    const goToPrevious = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + campaigns.length) % campaigns.length
        )
        resetTimer()
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length)
        resetTimer()
    }

    return (
        <div className="relative h-[70vh] overflow-hidden">
            {campaigns.map((campaign, index) => (
                <CarouselSlide
                    key={campaign.id}
                    campaign={campaign}
                    videoUrl={presignedUrls[campaign.bgVideoPath]}
                    isActive={index === currentIndex}
                    onRaffleClick={() =>
                        router.push(`/campaign/${campaign.id}`)
                    }
                />
            ))}

            {/* Carousel Indicators (Dots) */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {campaigns.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Left/Right Arrows */}
            <div className="hidden lg:block">
                <button
                    className="absolute top-1/2 left-8 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                    onClick={goToPrevious}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={48} />
                </button>
                <button
                    className="absolute top-1/2 right-8 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                    onClick={goToNext}
                    aria-label="Next slide"
                >
                    <ChevronRight size={48} />
                </button>
            </div>
        </div>
    )
}

// Separate component for a single slide
function CarouselSlide({
    campaign,
    videoUrl,
    isActive,
    onRaffleClick,
}: {
    campaign: Campaign
    videoUrl?: string
    isActive: boolean
    onRaffleClick: () => void
}) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)

    useEffect(() => {
        const vid = videoRef.current
        if (!vid) return

        const handleCanPlay = () => {
            setIsVideoLoaded(true)
            if (isActive) {
                vid.play().catch(console.error)
            }
        }

        vid.addEventListener('canplay', handleCanPlay)

        if (isActive) {
            vid.play().catch(console.error)
        } else {
            vid.pause()
            vid.currentTime = 0
        }

        return () => {
            vid.removeEventListener('canplay', handleCanPlay)
        }
    }, [isActive])

    return (
        <div
            className={`absolute inset-0 transition-all duration-700 ${
                isActive
                    ? 'opacity-100 z-10'
                    : 'opacity-0 z-0 pointer-events-none'
            }`}
        >
            {/* Background Image (shown until video loads) */}
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

            {/* Video overlay */}
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

            {/* Content Overlay with improved animations */}
            <div
                className={`absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white
                transition-all duration-700 transform ${
                    isActive
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0'
                }`}
            >
                <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {campaign.artistName}
                </h2>
                <h3 className="text-2xl md:text-4xl font-semibold mb-4 drop-shadow-lg">
                    {campaign.campaignName}
                </h3>
                <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow">
                    {campaign.description}
                </p>
                <Button
                    size="lg"
                    onClick={onRaffleClick}
                    className="hover:scale-105 transition-transform"
                >
                    Enter Raffle
                </Button>
            </div>
        </div>
    )
}
