'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, ShoppingCart, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type User = {
    name: string
    image: string
} | null

export default function Header({
    user,
    cartItemsCount,
}: {
    user?: User
    cartItemsCount?: number
}) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Search:', searchQuery)
        // Implement search functionality here
    }

    const handleActivityBell = () => {
        console.log('Activity Bell clicked')
        // Implement activity bell functionality here
    }

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
                isScrolled
                    ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
                    : 'bg-transparent'
            }`}
        >
            <div className="flex justify-between h-16 items-center">
                <Link className="mr-6 space-x-4 px-4" href="/">
                    RaffleTickets
                </Link>
                <div className="flex items-center space-x-2">
                    <form
                        onSubmit={handleSearch}
                        className="w-full hidden md:flex md:w-auto md:flex-1 md:mr-4"
                    >
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tickets..."
                                className="pl-8 md:w-[200px] lg:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleActivityBell}
                    >
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/cart')}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartItemsCount && cartItemsCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-2"
                            >
                                {cartItemsCount}
                            </Badge>
                        )}
                    </Button>
                    {user ? (
                        <Avatar>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/signin')}
                        >
                            <User className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
