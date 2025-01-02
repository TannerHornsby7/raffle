'use client'
import HeroCarousel from './components/HeroCarousel'
import CampaignCard, { Campaign } from './components/CampaignCard'

const CAMPAIGNS: Campaign[] = [
    {
        id: 1,
        bgImageUrl:
            'https://assets.vogue.com/photos/64172d1fa37562b08c5e0e24/4:3/w_4396,h_3297,c_limit/GettyImages-1474294735.jpeg',
        bgVideoUrl: '/taylor-swift-video.mp4',
        artistName: 'Taylor Swift',
        campaignName: 'Eras Tour VIP',
        description:
            "Get a chance to win VIP tickets to Taylor Swift's Eras Tour! This once-in-a-lifetime opportunity includes backstage access and a meet-and-greet with Taylor herself.",
        ticketCost: 99.99,
        buyers: 1500,
        isPopular: true,
        isHot: true,
    },
    {
        id: 2,
        bgImageUrl:
            'https://assets.vogue.com/photos/58918779fb0604bf1f5c3b9d/master/pass/01-drake.jpg',
        bgVideoUrl: '/drake-video.mp4',
        artistName: 'Drake',
        campaignName: 'For All The Dogs',
        description:
            "Enter the raffle for a chance to attend Drake's exclusive album release party for 'For All The Dogs'. Winners will get to hear the album before anyone else and meet Drake in person!",
        ticketCost: 79.99,
        buyers: 1200,
        isPopular: true,
        isHot: false,
    },
    {
        id: 3,
        bgImageUrl:
            'https://assets.vogue.com/photos/62b30497e31f9e12d602ea30/1:1/w_2232,h_2232,c_limit/Beyonce_JULY22_RPA_220401_VOGUE_UK_09_014_V10_QC.jpg',
        bgVideoUrl:
            'https://www.youtube.com/watch?v=2EwViQxSJJQ&list=RDEMENjbpvgLdYbcoTJt9iqLKg&index=2',
        artistName: 'Beyoncé',
        campaignName: 'Renaissance World Tour',
        description:
            "Win a backstage pass to Beyoncé's Renaissance World Tour! Get up close and personal with Queen B herself and experience the show from a whole new perspective.",
        ticketCost: 129.99,
        buyers: 2000,
        isPopular: true,
        isHot: true,
    },
    // Add more mock artists here
]

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <HeroCarousel campaigns={CAMPAIGNS} />
            <main className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">Featured Raffles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {CAMPAIGNS.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            {...campaign}
                            bgImageUrl={campaign.bgImageUrl}
                            bgVideoUrl={campaign.bgVideoUrl}
                            onAddToCart={() => {
                                /* Implement cart functionality */
                            }}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}
