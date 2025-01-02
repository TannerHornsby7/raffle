'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import BackgroundVideo from '../../components/BackgroundVideo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock data (replace with actual API call in a real application)
const MOCK_ARTISTS = [
    {
        id: 1,
        bgUrl: '/placeholder.svg',
        videoUrl: 'https://example.com/taylor_swift_video.mp4',
        artistName: 'Taylor Swift',
        campaignName: 'Eras Tour VIP',
        ticketCost: 99.99,
        buyers: 1500,
        isPopular: true,
        isHot: true,
        description:
            "Get a chance to win VIP tickets to Taylor Swift's Eras Tour! This once-in-a-lifetime opportunity includes backstage access and a meet-and-greet with Taylor herself.",
    },
    {
        id: 2,
        bgUrl: '/placeholder.svg',
        videoUrl: 'https://example.com/drake_video.mp4',
        artistName: 'Drake',
        campaignName: 'For All The Dogs',
        ticketCost: 79.99,
        buyers: 1200,
        isPopular: true,
        isHot: false,
        description:
            'Enter the raffle for a chance to attend Drake\'s exclusive album release party for "For All The Dogs". Winners will get to hear the album before anyone else and meet Drake in person!',
    },
    // Add more mock artists here
]

export default function ArtistPage() {
    const params = useParams()
    const [artist, setArtist] = useState<any>(null)
    const [cartItems, setCartItems] = useState<number[]>([])
    const [user, setUser] = useState(null) // Replace with actual auth logic

    useEffect(() => {
        // In a real app, you'd fetch the artist data from an API
        const artistId = Number(params.id)
        const foundArtist = MOCK_ARTISTS.find((a) => a.id === artistId)
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
            <BackgroundVideo src={artist.videoUrl} />
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
