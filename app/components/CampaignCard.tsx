'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type Campaign = {
    id: number
    bgImageUrl: string
    bgVideoPath: string
    artistName: string
    campaignName: string
    description: string
    ticketCost: number
    buyers: number
    isPopular: boolean
    isHot: boolean
    bgColor: string
    foregroundColor: string
    onAddToCart?: () => void
}

export default function CampaignCard({
    id,
    bgImageUrl,
    artistName,
    campaignName,
    ticketCost,
    buyers,
    isPopular,
    isHot,
    onAddToCart,
}: Campaign) {
    return (
        <Card className="overflow-hidden">
            <Link href={`/campaign/${id}`}>
                <div className="relative h-48">
                    <Image
                        className="object-cover"
                        src={bgImageUrl}
                        alt={artistName}
                        layout="fill"
                    />
                </div>
            </Link>
            <CardContent className="p-4">
                <Link href={`/campaign/${id}`}>
                    <h3 className="text-lg font-semibold hover:underline">
                        {artistName}
                    </h3>
                </Link>
                <p className="text-sm text-muted-foreground">{campaignName}</p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold">
                        ${ticketCost.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {buyers} buyers
                    </span>
                </div>
                <div className="mt-2 flex gap-2">
                    {isPopular && <Badge variant="secondary">Popular</Badge>}
                    {isHot && <Badge variant="destructive">Hot</Badge>}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={onAddToCart}>
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
