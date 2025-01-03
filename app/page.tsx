'use client'
import HeroCarousel from './components/carousel/HeroCarousel'
import CampaignCard from './components/CampaignCard'
import Campaigns from './data/campaigns.json'

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <HeroCarousel campaigns={Campaigns} />
            <main className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">Featured Raffles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Campaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            {...campaign}
                            bgImageUrl={campaign.bgImageUrl}
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
