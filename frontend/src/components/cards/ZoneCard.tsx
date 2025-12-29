import { Link } from 'react-router-dom'
import type { Zone } from '@/lib/types'
import { calculateHealthScore, getHealthStatus, getStatusIcon, cn } from '@/lib/utils'

interface ZoneCardProps {
    zone: Zone
}

export default function ZoneCard({ zone }: ZoneCardProps) {
    const { id, name, plantType, exposure, latestReadings = [], insights = [] } = zone

    // Calculate health score
    const healthScore = calculateHealthScore(latestReadings, insights)
    const healthStatus = getHealthStatus(healthScore)

    // Count active insights
    const activeInsightsCount = insights.filter((i) => !i.resolvedAt).length

    // Get status colors
    const statusColors = {
        excellent: 'bg-green-100 text-green-700 border-green-200',
        good: 'bg-green-50 text-green-600 border-green-100',
        warning: 'bg-orange-100 text-orange-700 border-orange-200',
        critical: 'bg-red-100 text-red-700 border-red-200',
    }

    // Exposure badge colors
    const exposureColors = {
        low: 'bg-blue-50 text-blue-700',
        medium: 'bg-yellow-50 text-yellow-700',
        high: 'bg-orange-50 text-orange-700',
    }

    return (
        <Link to={`/zones/${id}`} className="block group">
            <div className="card relative overflow-hidden">
                {/* Active Insights Badge */}
                {activeInsightsCount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {activeInsightsCount}
                    </div>
                )}

                {/* Zone Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                    {name}
                </h3>

                {/* Plant Type */}
                <p className="text-sm text-gray-600 mb-3">{plantType}</p>

                {/* Exposure Badge */}
                <div className="mb-4">
                    <span className={cn(
                        'inline-block px-3 py-1 rounded-full text-xs font-medium',
                        exposureColors[exposure]
                    )}>
                        {exposure.charAt(0).toUpperCase() + exposure.slice(1)} Exposure
                    </span>
                </div>

                {/* Latest Readings Preview */}
                {latestReadings.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {latestReadings.slice(0, 4).map((reading) => {
                            const status = reading.metric
                                ? reading.value >= reading.metric.idealMin &&
                                    reading.value <= reading.metric.idealMax
                                    ? 'in_range'
                                    : 'warning'
                                : 'in_range'

                            return (
                                <div
                                    key={reading.metricKey}
                                    className={cn(
                                        'h-2 rounded-full',
                                        status === 'in_range' ? 'bg-green-400' : 'bg-orange-400'
                                    )}
                                    title={`${reading.metricKey}: ${reading.value}${reading.metric?.unit || ''}`}
                                />
                            )
                        })}
                    </div>
                )}

                {/* Health Score */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Health Score</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-900">{healthScore}</span>
                        <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium border',
                            statusColors[healthStatus]
                        )}>
                            {getStatusIcon(healthStatus)} {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
