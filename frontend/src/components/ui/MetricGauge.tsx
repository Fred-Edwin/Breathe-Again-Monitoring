import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import type { Metric } from '@/lib/types'
import { formatMetricValue, getMetricStatus, cn } from '@/lib/utils'

interface MetricGaugeProps {
    metricKey: string
    value: number
    metric?: Metric
    trend?: 'up' | 'down' | 'stable'
}

export default function MetricGauge({ metricKey, value, metric, trend = 'stable' }: MetricGaugeProps) {
    if (!metric) {
        return null
    }

    const { unit, idealMin, idealMax } = metric
    const status = getMetricStatus(value, idealMin, idealMax)

    // Get status colors
    const statusColors = {
        in_range: 'text-green-700 bg-green-100',
        warning: 'text-orange-700 bg-orange-100',
        critical: 'text-red-700 bg-red-100',
    }

    const statusText = {
        in_range: '✓ Optimal',
        warning: '⚠ Warning',
        critical: '✕ Critical',
    }

    // Calculate percentage for gauge (0-100)
    const range = idealMax - idealMin
    const percentage = Math.min(
        100,
        Math.max(0, ((value - idealMin) / range) * 100)
    )

    // Trend icon
    const TrendIcon = {
        up: ArrowUp,
        down: ArrowDown,
        stable: Minus,
    }[trend]

    return (
        <div className="card">
            {/* Metric Name */}
            <h3 className="text-sm font-medium text-gray-600 mb-3 capitalize">
                {metricKey.replace(/_/g, ' ')}
            </h3>

            {/* Value - Large Monospace */}
            <div className="flex items-baseline gap-2 mb-2">
                <span className="metric-value">{formatMetricValue(value, unit)}</span>
                <TrendIcon className={cn(
                    'w-5 h-5',
                    trend === 'up' ? 'text-blue-500' : trend === 'down' ? 'text-orange-500' : 'text-gray-400'
                )} />
            </div>

            {/* Status Badge */}
            <div className={cn(
                'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4',
                statusColors[status]
            )}>
                {statusText[status]}
            </div>

            {/* Gauge Bar */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                {/* Ideal range indicator */}
                <div
                    className="absolute h-full bg-green-200"
                    style={{
                        left: '0%',
                        right: '0%',
                    }}
                />
                {/* Current value indicator */}
                <div
                    className={cn(
                        'absolute h-full transition-all rounded-full',
                        status === 'in_range' ? 'bg-green-500' :
                            status === 'warning' ? 'bg-orange-500' :
                                'bg-red-500'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Ideal Range */}
            <p className="text-xs text-gray-500">
                Ideal: {formatMetricValue(idealMin, unit)} - {formatMetricValue(idealMax, unit)}
            </p>
        </div>
    )
}
