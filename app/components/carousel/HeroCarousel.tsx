'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CarouselSlide } from './CarouselSlide'
import { CarouselControls } from './CarouselControls'
import { useSwipe } from '@/app/hooks/useSwipe'
import type { Campaign } from '@/app/components/CampaignCard'
import outputs from '@/amplify_outputs.json'
import { Amplify } from 'aws-amplify'
import { getUrl } from 'aws-amplify/storage'

Amplify.configure(outputs, { ssr: true })

export default function HeroCarousel({ campaigns }: { campaigns: Campaign[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [videoUrls, setVideoUrls] = useState<Record<string, string>>({})
    const router = useRouter()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Load video URLs and cache them
    useEffect(() => {
        const loadVideos = async () => {
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
            setCurrentIndex(index)
            resetTimer()
        },
        [resetTimer]
    )

    const goToPrevious = useCallback(() => {
        setCurrentIndex(
            (prev) => (prev - 1 + campaigns.length) % campaigns.length
        )
        resetTimer()
    }, [campaigns.length, resetTimer])

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % campaigns.length)
        resetTimer()
    }, [campaigns.length, resetTimer])

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
