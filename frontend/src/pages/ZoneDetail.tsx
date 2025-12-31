import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useZone } from '../hooks/useZones'
import MetricGauge from '../components/ui/MetricGauge'
import TimeSeriesChart from '../components/charts/TimeSeriesChart'
import InsightCard from '../components/insights/InsightCard'
import PageHero from '../components/ui/PageHero'
import { SkeletonCard, SkeletonMetric } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'


export default function ZoneDetail() {
    const { id } = useParams<{ id: string }>()
    const { data: zone, isLoading, error, refetch } = useZone(id!)

    // Loading state
    if (isLoading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <SkeletonCard />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <SkeletonMetric />
                        <SkeletonMetric />
                        <SkeletonMetric />
                        <SkeletonMetric />
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !zone) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/zones"
                        className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-600 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Zones
                    </Link>
                    <ErrorState
                        message="Zone not found or failed to load"
                        onRetry={refetch}
                    />
                </div>
            </div>
        )
    }

    const { name, plantType, exposure, garden, latestReadings = [], insights = [] } = zone
    const activeInsights = insights.filter((i) => !i.resolvedAt)

    // Group readings by metric for charts
    const metricKeys = ['soil_moisture', 'temperature', 'humidity', 'light']

    return (
        <div>
            {/* Hero Section */}
            <PageHero
                image="/images/hero/context_healthy_growth_1767170338458.png"
                title={name}
                subtitle={plantType}
                height="40vh"
                overlay="gradient"
            >
                <Link
                    to="/zones"
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Zones
                </Link>
            </PageHero>

            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 capitalize">
                            {exposure} Exposure
                        </span>
                        {garden && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                {garden.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Current Readings */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {metricKeys.map((metricKey) => {
                            const reading = latestReadings.find((r) => r.metricKey === metricKey)
                            if (!reading || !reading.metric) return null

                            // Get trend from recent readings (simplified - would need historical data)
                            const trend = 'stable' as const

                            return (
                                <MetricGauge
                                    key={metricKey}
                                    metricKey={metricKey}
                                    value={reading.value}
                                    metric={reading.metric}
                                    trend={trend}
                                />
                            )
                        })}
                    </div>
                </div>

                {/* Time-Series Charts */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Historical Trends</h2>
                    <div className="space-y-6">
                        {metricKeys.map((metricKey) => {
                            const reading = latestReadings.find((r) => r.metricKey === metricKey)
                            if (!reading || !reading.metric) return null

                            // For now, create mock 24h data from current reading
                            // In production, this would come from a separate API endpoint
                            const mockHistoricalData = Array.from({ length: 24 }, (_, i) => {
                                const timestamp = new Date()
                                timestamp.setHours(timestamp.getHours() - (23 - i))

                                // Add some variation to the value
                                const variation = (Math.random() - 0.5) * 10
                                const value = reading.value + variation

                                return {
                                    id: `${reading.id}-${i}`,
                                    zoneId: zone.id,
                                    metricKey,
                                    value,
                                    timestamp: timestamp.toISOString(),
                                    source: 'mock' as const,
                                    metric: reading.metric,
                                }
                            })

                            return (
                                <TimeSeriesChart
                                    key={metricKey}
                                    data={mockHistoricalData}
                                    metricKey={metricKey}
                                    idealMin={reading.metric.idealMin}
                                    idealMax={reading.metric.idealMax}
                                    unit={reading.metric.unit}
                                />
                            )
                        })}
                    </div>
                </div>

                {/* Active Insights */}
                {activeInsights.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Active Insights ({activeInsights.length})
                        </h2>
                        <div className="space-y-4">
                            {activeInsights.map((insight) => (
                                <InsightCard key={insight.id} insight={{ ...insight, zone }} />
                            ))}
                        </div>
                    </div>
                )}

                {activeInsights.length === 0 && (
                    <div className="card text-center py-12">
                        <p className="text-gray-500">
                            No active insights for this zone. Everything looks healthy! ✓
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

