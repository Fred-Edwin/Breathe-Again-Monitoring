import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ImpactMetricProps {
    value: string
    label: string
    icon: ReactNode
    gradient?: string
    delay?: number
}

export default function ImpactMetric({
    value,
    label,
    icon,
    gradient = 'var(--gradient-forest)',
    delay = 0,
}: ImpactMetricProps) {
    return (
        <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.34, 1.56, 0.64, 1],
            }}
        >
            <div className="flex items-start gap-4">
                {/* Icon with Gradient Background */}
                <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                        background: gradient,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    <div className="text-white text-2xl">{icon}</div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="metric-value-lg text-gray-900 mb-1">{value}</div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                </div>
            </div>
        </motion.div>
    )
}
