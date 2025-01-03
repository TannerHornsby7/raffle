import { useCallback, useState, TouchEvent } from 'react'

const SWIPE_THRESHOLD = 50

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
    const [touchStart, setTouchStart] = useState<number | null>(null)

    const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.touches[0].clientX)
    }, [])

    const handleTouchMove = useCallback(
        (e: TouchEvent<HTMLDivElement>) => {
            if (!touchStart) return

            const currentTouch = e.touches[0].clientX
            const diff = touchStart - currentTouch

            if (Math.abs(diff) >= SWIPE_THRESHOLD) {
                if (diff > 0) {
                    onSwipeLeft()
                } else {
                    onSwipeRight()
                }
                setTouchStart(null)
            }
        },
        [touchStart, onSwipeLeft, onSwipeRight]
    )

    const handleTouchEnd = useCallback(() => {
        setTouchStart(null)
    }, [])

    return {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
    }
}
