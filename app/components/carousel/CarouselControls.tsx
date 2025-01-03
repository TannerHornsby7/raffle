'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type CarouselControlsProps = {
    total: number
    current: number
    onNext: () => void
    onPrevious: () => void
    onDotClick: (index: number) => void
}

export function CarouselControls({
    total,
    current,
    onNext,
    onPrevious,
    onDotClick,
}: CarouselControlsProps) {
    return (
        <>
            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {Array.from({ length: total }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            index === current
                                ? 'bg-white w-6 scale-100'
                                : 'bg-white/40 hover:bg-white/60 scale-90 hover:scale-95'
                        }`}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <div className="hidden lg:block">
                <button
                    className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 
                        text-white/90 hover:text-white p-3 rounded-full backdrop-blur-sm 
                        transition-all duration-300 transform hover:scale-105"
                    onClick={onPrevious}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 
                        text-white/90 hover:text-white p-3 rounded-full backdrop-blur-sm 
                        transition-all duration-300 transform hover:scale-105"
                    onClick={onNext}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </>
    )
}
