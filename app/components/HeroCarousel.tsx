'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Campaign } from '@/app/components/CampaignCard'
import outputs from '@/amplify_outputs.json'
import { Amplify } from 'aws-amplify'
import { getUrl } from 'aws-amplify/storage'

Amplify.configure(outputs, {
    ssr: true, // required when using Amplify with Next.js
})

type HeroCarouselProps = {
    campaigns: Campaign[]
}

export default function HeroCarousel({ campaigns }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [presignedUrls, setPresignedUrls] = useState<
        Record<string, { url: string; expiry: number }>
    >({})
    const router = useRouter()

    useEffect(() => {
        // Function to check if a presigned URL is still valid (not expired)
        const isUrlValid = (path: string) => {
            const urlData = presignedUrls[path]
            if (!urlData) return false
            // Check if URL has more than 5 minutes left before expiry
            return urlData.expiry - Date.now() > 5 * 60 * 1000
        }
        // Function to get presigned URL with caching
        const getCachedPresignedUrl = async (path: string) => {
            if (!path) return null
            if (isUrlValid(path)) return presignedUrls[path].url

            try {
                const result = await getUrl({ path })
                // Store URL with expiry time (assuming 1 hour validity)
                setPresignedUrls((prev) => ({
                    ...prev,
                    [path]: {
                        url: result.url.toString(),
                        expiry: Date.now() + 60 * 60 * 1000,
                    },
                }))
                return result.url
            } catch (error) {
                console.error('Error getting presigned URL:', error)
                return null
            }
        }
        // Pre-fetch URL for current and next slide
        const prefetchUrls = async () => {
            const currentCampaign = campaigns[currentIndex]
            const nextIndex = (currentIndex + 1) % campaigns.length
            const nextCampaign = campaigns[nextIndex]

            if (currentCampaign.bgVideoPath) {
                await getCachedPresignedUrl(currentCampaign.bgVideoPath)
            }
            if (nextCampaign.bgVideoUrl) {
                await getCachedPresignedUrl(nextCampaign.bgVideoUrl)
            }
        }

        prefetchUrls()

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [currentIndex, campaigns, presignedUrls])

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
                            src={presignedUrls[campaign.bgVideoUrl]?.url || ''}
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
                            layout="fill"
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
