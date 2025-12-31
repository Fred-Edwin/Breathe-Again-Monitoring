import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageHeroProps {
    image: string
    title: string
    subtitle?: string
    height?: string
    overlay?: 'light' | 'dark' | 'gradient'
    children?: ReactNode
}

export default function PageHero({
    image,
    title,
    subtitle,
    height = '60vh',
    overlay = 'gradient',
    children,
}: PageHeroProps) {
    const overlayStyles = {
        light: 'bg-gradient-to-b from-white/30 to-white/60',
        dark: 'bg-gradient-to-b from-black/40 to-black/70',
        gradient: 'bg-gradient-to-b from-black/30 to-black/70',
    }

    return (
        <div className="relative w-full overflow-hidden" style={{ height }}>
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${image})`,
                }}
            >
                {/* Optional: Add parallax effect on scroll */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/20" />
            </div>

            {/* Overlay */}
            <div className={`absolute inset-0 ${overlayStyles[overlay]}`} />

            {/* Content */}
            <motion.div
                className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12 lg:p-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
                <div className="max-w-7xl mx-auto w-full">
                    {/* Title */}
                    <h1
                        className="font-['Outfit'] text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-tight"
                        style={{
                            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {title}
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p
                            className="text-xl md:text-2xl text-white/90 mb-6 font-medium"
                            style={{
                                textShadow: '0 1px 10px rgba(0,0,0,0.3)',
                            }}
                        >
                            {subtitle}
                        </p>
                    )}

                    {/* Custom Content (e.g., stats, badges) */}
                    {children && (
                        <div className="mt-6">
                            {children}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
        </div>
    )
}
