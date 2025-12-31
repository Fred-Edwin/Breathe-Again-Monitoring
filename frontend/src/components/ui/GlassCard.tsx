import { type ReactNode } from 'react'

interface GlassCardProps {
    children: ReactNode
    variant?: 'subtle' | 'standard' | 'prominent' | 'dark' | 'green'
    className?: string
    interactive?: boolean
    onClick?: () => void
}

export default function GlassCard({
    children,
    variant = 'standard',
    className = '',
    interactive = false,
    onClick,
}: GlassCardProps) {
    const variantStyles = {
        subtle: 'glass-card-subtle',
        standard: 'glass-card',
        prominent: 'glass-card-prominent',
        dark: 'glass-card-dark',
        green: 'glass-card-green',
    }

    const baseClasses = variantStyles[variant]
    const interactiveClasses = interactive ? 'card-interactive' : ''
    const combinedClasses = `${baseClasses} ${interactiveClasses} ${className}`

    return (
        <div
            className={combinedClasses}
            onClick={onClick}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={
                interactive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onClick?.()
                        }
                    }
                    : undefined
            }
        >
            {children}
        </div>
    )
}
