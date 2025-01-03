'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CarouselSlide } from './carousel/CarouselSlide'
import { CarouselControls } from './carousel/CarouselControls'
import { useSwipe } from '@/app/hooks/useSwipe'
import type { Campaign } from '@/app/components/CampaignCard'
import outputs from '@/amplify_outputs.json'
import { Amplify } from 'aws-amplify'
import { getUrl } from 'aws-amplify/storage'

Amplify.configure(outputs, { ssr: true })

const CACHE_KEY = 'carousel-video-urls'
const CACHE_EXPIRY = 1000 * 60 * 60 // 1 hour

type CachedUrls = {
    urls: Record<string, string>
    timestamp: number
}

function getCachedUrls(): Record<string, string> | null {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const { urls, timestamp }: CachedUrls = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(CACHE_KEY)
        return null
    }

    return urls
}

export default function HeroCarousel({ campaigns }: { campaigns: Campaign[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [videoUrls, setVideoUrls] = useState<Record<string, string>>(
        () => getCachedUrls() || {}
    )
    const [slideDirection, setSlideDirection] = useState<
        'left' | 'right' | null
    >(null)
    const router = useRouter()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Load video URLs and cache them
    useEffect(() => {
        const loadVideos = async () => {
            const cached = getCachedUrls()
            if (cached) {
                setVideoUrls(cached)
                return
            }

            const results = await Promise.all(
                campaigns.map(async (campaign) => {
                    try {
                        const result = await getUrl({
                            path: campaign.bgVideoPath,
                        })
                        return [
                            campaign.bgVideoPath,
                            result.url.toString(),
                        ] as const
                    } catch (error) {
                        console.error(
                            `Failed to load video for ${campaign.campaignName}:`,
                            error
                        )
                        return [campaign.bgVideoPath, ''] as const
                    }
                })
            )

            const urls = Object.fromEntries(results)
            setVideoUrls(urls)

            // Cache the URLs
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                    urls,
                    timestamp: Date.now(),
                })
            )
        }

        loadVideos()
    }, [campaigns])

    // Reset and restart timer when slide changes
    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
        timerRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length)
        }, 5000)
    }, [campaigns.length])

    // Initialize timer
    useEffect(() => {
        resetTimer()
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [campaigns.length, resetTimer])

    const goToSlide = useCallback(
        (index: number) => {
            setSlideDirection(index > currentIndex ? 'left' : 'right')
            setCurrentIndex(index)
            resetTimer()
        },
        [currentIndex, resetTimer]
    )

    const goToPrevious = useCallback(() => {
        setSlideDirection('right')
        setCurrentIndex(
            (prev) => (prev - 1 + campaigns.length) % campaigns.length
        )
        resetTimer()
    }, [campaigns.length, resetTimer])

    const goToNext = useCallback(() => {
        setSlideDirection('left')
        setCurrentIndex((prev) => (prev + 1) % campaigns.length)
        resetTimer()
    }, [campaigns.length, resetTimer])

    // Reset slide direction after animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setSlideDirection(null)
        }, 700)
        return () => clearTimeout(timer)
    }, [currentIndex])

    const swipeHandlers = useSwipe(goToNext, goToPrevious)

    return (
        <div
            className="relative h-[75vh] overflow-hidden shadow-2xl"
            {...swipeHandlers}
            role="region"
            aria-label="Campaign carousel"
        >
            {campaigns.map((campaign, index) => (
                <CarouselSlide
                    key={campaign.id}
                    campaign={campaign}
                    videoUrl={videoUrls[campaign.bgVideoPath]}
                    isActive={index === currentIndex}
                    direction={slideDirection}
                    onRaffleClick={() =>
                        router.push(`/campaign/${campaign.id}`)
                    }
                />
            ))}

            <CarouselControls
                total={campaigns.length}
                current={currentIndex}
                onNext={goToNext}
                onPrevious={goToPrevious}
                onDotClick={goToSlide}
            />
        </div>
    )
}
