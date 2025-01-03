'use client'
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
        </>
    )
}
