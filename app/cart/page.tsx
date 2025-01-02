'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Cart() {
    const [cartItems, setCartItems] = useState<number[]>([])
    const [user, setUser] = useState(null) // Replace with actual auth logic

    useEffect(() => {
        // In a real app, you'd fetch the cart items from an API or local storage
        const storedCartItems = localStorage.getItem('cartItems')
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems))
        }
    }, [])

    const handleRemoveFromCart = (itemId: number) => {
        const updatedCart = cartItems.filter((id) => id !== itemId)
        setCartItems(updatedCart)
        localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
                        {cartItems.map((itemId) => (
                            <li
                                key={itemId}
                                className="flex justify-between items-center py-2 border-b"
                            >
                                <span>Ticket #{itemId}</span>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleRemoveFromCart(itemId)}
                                >
                                    Remove
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    )
}
