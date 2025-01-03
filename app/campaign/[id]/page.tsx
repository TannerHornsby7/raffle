'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import BackgroundVideo from '../../components/BackgroundVideo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Campaign } from '../../components/CampaignCard'

import Campaigns from '../../data/campaigns.json'

export default function ArtistPage() {
    const params = useParams()
    const [artist, setArtist] = useState<Campaign | null>(null)
    const [cartItems, setCartItems] = useState<number[]>([])
    // const [user, setUser] = useState(null) // Replace with actual auth logic

    useEffect(() => {
        const artistId = Number(params.id)
        const foundArtist = Campaigns.find((a) => a.id === artistId)
        setArtist(foundArtist || null)

        // Fetch cart items (replace with actual logic in a real app)
        const storedCartItems = localStorage.getItem('cartItems')
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems))
        }
    }, [params.id])

    const handleAddToCart = () => {
        if (artist) {
            const updatedCart = [...cartItems, artist.id]
            setCartItems(updatedCart)
            localStorage.setItem('cartItems', JSON.stringify(updatedCart))
        }
    }

    if (!artist) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background">
            <BackgroundVideo src={artist.bgImageUrl} />
            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-2xl mx-auto bg-black bg-opacity-50 p-8 rounded-lg">
                    <h1 className="text-4xl font-bold mb-4">
                        {artist.artistName}
                    </h1>
                    <h2 className="text-2xl font-semibold mb-4">
                        {artist.campaignName}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl font-bold">
                            ${artist.ticketCost.toFixed(2)}
                        </span>
                        <span className="text-lg">{artist.buyers} buyers</span>
                        {artist.isPopular && (
                            <Badge variant="secondary">Popular</Badge>
                        )}
                        {artist.isHot && (
                            <Badge variant="destructive">Hot</Badge>
                        )}
                    </div>
                    <p className="text-lg mb-6">{artist.description}</p>
                    <Button size="lg" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </div>
            </main>
        </div>
    )
}
