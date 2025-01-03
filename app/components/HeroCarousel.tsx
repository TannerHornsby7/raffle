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

type HeroCarouselProps = {
    campaigns: Campaign[]
}

export default function HeroCarousel({ campaigns }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [presignedUrls, setPresignedUrls] = useState<Record<string, string>>(
        {}
    )
    const [slideDirection, setSlideDirection] = useState<
        'left' | 'right' | null
    >(null)
    const router = useRouter()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

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
        }, 700) // Match animation duration
        return () => clearTimeout(timer)
    }, [currentIndex])

    const swipeHandlers = useSwipe(goToNext, goToPrevious)

    // Preload next video
    useEffect(() => {
        const nextIndex = (currentIndex + 1) % campaigns.length
        const nextCampaign = campaigns[nextIndex]
        if (
            nextCampaign?.bgVideoPath &&
            presignedUrls[nextCampaign.bgVideoPath]
        ) {
            const video = document.createElement('video')
            video.preload = 'auto'
            video.src = presignedUrls[nextCampaign.bgVideoPath]
            // Keep a reference to trigger loading
            // const preloadVideo = video
        }
    }, [currentIndex, campaigns, presignedUrls])

    return (
        <div
            className="relative h-[75vh] overflow-hidden rounded-2xl mx-4 my-6 shadow-2xl"
            {...swipeHandlers}
            role="region"
            aria-label="Campaign carousel"
        >
            {campaigns.map((campaign, index) => (
                <CarouselSlide
                    key={campaign.id}
                    campaign={campaign}
                    videoUrl={presignedUrls[campaign.bgVideoPath]}
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
