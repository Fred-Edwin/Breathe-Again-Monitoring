import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Leaf, Droplets, Sun, Wind } from 'lucide-react'
import { useGarden } from '../hooks/useGarden'
import { useZones } from '../hooks/useZones'
import PageHero from '../components/ui/PageHero'
import GlassCard from '../components/ui/GlassCard'
import ZoneCard from '../components/cards/ZoneCard'
import { SkeletonCard, SkeletonMetric } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { calculateHealthScore } from '../lib/utils'

export default function GardenView() {
    const { id } = useParams<{ id: string }>()
    const { data: garden, isLoading: gardenLoading, error: gardenError, refetch } = useGarden(id!)
    const { data: allZones } = useZones()

    // Filter zones for this garden
    const gardenZones = allZones?.filter(zone => zone.gardenId === id) || []

    // Calculate garden-level metrics (averages)
    const avgMetrics = gardenZones.length > 0 ? {
        moisture: gardenZones.reduce((sum, z) => {
            const reading = z.latestReadings?.find(r => r.metricKey === 'soil_moisture')
            return sum + (reading?.value || 0)
        }, 0) / gardenZones.length,
        temperature: gardenZones.reduce((sum, z) => {
            const reading = z.latestReadings?.find(r => r.metricKey === 'temperature')
            return sum + (reading?.value || 0)
        }, 0) / gardenZones.length,
        humidity: gardenZones.reduce((sum, z) => {
            const reading = z.latestReadings?.find(r => r.metricKey === 'humidity')
            return sum + (reading?.value || 0)
        }, 0) / gardenZones.length,
        light: gardenZones.reduce((sum, z) => {
            const reading = z.latestReadings?.find(r => r.metricKey === 'light')
            return sum + (reading?.value || 0)
        }, 0) / gardenZones.length,
    } : null

    // Calculate overall garden health
    const gardenHealth = gardenZones.length > 0
        ? gardenZones.reduce((sum, zone) => {
            const score = calculateHealthScore(zone.latestReadings || [], zone.insights || [])
            return sum + score
        }, 0) / gardenZones.length
        : 0

    // Loading state
    if (gardenLoading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <SkeletonCard />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
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
    if (gardenError || !garden) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-600 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <ErrorState
                        message="Garden not found or failed to load"
                        onRetry={refetch}
                    />
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Hero Section */}
            <PageHero
                image="/images/hero/hero_garden_rooftop_1767170303575.png"
                title={garden.name}
                subtitle={`${gardenZones.length} zones • ${garden.type} • ${Math.round(gardenHealth)}% health`}
                height="50vh"
                overlay="gradient"
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </PageHero>

            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Garden-Level Metrics */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Garden Overview</h2>

                    {avgMetrics && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <GlassCard className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                                        <Droplets className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Avg Moisture</p>
                                        <p className="text-3xl font-bold text-gray-900">{Math.round(avgMetrics.moisture)}%</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                                        <Sun className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Avg Temperature</p>
                                        <p className="text-3xl font-bold text-gray-900">{Math.round(avgMetrics.temperature)}°C</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                                        <Wind className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Avg Humidity</p>
                                        <p className="text-3xl font-bold text-gray-900">{Math.round(avgMetrics.humidity)}%</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
                                        <Leaf className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Garden Health</p>
                                        <p className="text-3xl font-bold text-gray-900">{Math.round(gardenHealth)}%</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {/* Spatial Map */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Zone Layout</h2>
                    <div className="card p-8 mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gardenZones.map((zone) => {
                                const health = calculateHealthScore(zone.latestReadings || [], zone.insights || [])
                                const healthColor = health >= 80 ? 'bg-green-500' : health >= 60 ? 'bg-yellow-500' : 'bg-red-500'

                                return (
                                    <Link
                                        key={zone.id}
                                        to={`/zones/${zone.id}`}
                                        className="group"
                                    >
                                        <div className="card p-6 text-center transition-all hover:scale-105 hover:shadow-xl">
                                            <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${healthColor} flex items-center justify-center`}>
                                                <Leaf className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="font-semibold text-gray-900 mb-1">{zone.name}</p>
                                            <p className="text-sm text-gray-600">{Math.round(health)}% health</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Zone Cards List */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">All Zones</h2>
                    {gardenZones.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gardenZones.map((zone) => (
                                <ZoneCard key={zone.id} zone={zone} />
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-12">
                            <p className="text-gray-500">No zones in this garden yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
