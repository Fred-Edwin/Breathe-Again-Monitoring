import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useZones } from '../hooks/useZones'
import { useInstallations } from '../hooks/useInstallations'
import { useGardens } from '../hooks/useGardens'
import { useActiveInsights } from '../hooks/useInsights'
import { calculateHealthScore, getHealthStatus, getStatusIcon } from '../lib/utils'
import { SkeletonCard, SkeletonMetric } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import InsightCard from '../components/insights/InsightCard'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import PageHero from '../components/ui/PageHero'
import GlassCard from '../components/ui/GlassCard'
import ImpactMetric from '../components/ui/ImpactMetric'
import { MapPin, Leaf, AlertCircle, TrendingUp, Droplets, Maximize2 } from 'lucide-react'
import { pageVariants, containerVariants, itemVariants } from '../lib/animations'


export default function Overview() {
    const { data: zones, isLoading: zonesLoading, error: zonesError, refetch: refetchZones } = useZones()
    const { data: installations, isLoading: installationsLoading } = useInstallations()
    const { data: gardens, isLoading: gardensLoading } = useGardens()
    const { data: insights, isLoading: insightsLoading } = useActiveInsights()

    // Calculate overall system health
    const systemHealth = zones && Array.isArray(zones) && zones.length > 0
        ? zones.reduce((sum, zone) => {
            const score = calculateHealthScore(zone.latestReadings || [], zone.insights || [])
            return sum + score
        }, 0) / zones.length
        : 0

    const systemStatus = getHealthStatus(systemHealth)

    // Loading state
    if (zonesLoading || installationsLoading || gardensLoading || insightsLoading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
                    <p className="text-gray-600 mb-8">System health at a glance</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <SkeletonMetric />
                        <SkeletonMetric />
                        <SkeletonMetric />
                    </div>
                    <SkeletonCard />
                </div>
            </div>
        )
    }

    // Error state
    if (zonesError) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Overview</h1>
                    <ErrorState onRetry={refetchZones} />
                </div>
            </div>
        )
    }

    const activeInsightsCount = insights?.length || 0
    const totalZones = zones?.length || 0
    const installation = installations?.[0]

    return (
        <div>
            {/* Hero Section */}
            {installation && (
                <PageHero
                    image="/images/hero/hero_dashboard_aerial_1767170289260.png"
                    title={installation.name}
                    subtitle={installation.location}
                    height="60vh"
                    overlay="gradient"
                >
                    {/* Quick Stats Overlay */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        <GlassCard variant="dark" className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-green-300" />
                                <span className="text-white font-semibold">{totalZones} Zones</span>
                            </div>
                        </GlassCard>
                        <GlassCard variant="dark" className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-300" />
                                <span className="text-white font-semibold">{activeInsightsCount} Active Insights</span>
                            </div>
                        </GlassCard>
                        <GlassCard variant="dark" className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-300" />
                                <span className="text-white font-semibold">{Math.round(systemHealth)}% Health</span>
                            </div>
                        </GlassCard>
                    </div>
                </PageHero>
            )}

            <motion.div
                className="p-8"
                variants={pageVariants as any}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <div className="max-w-7xl mx-auto">

                    {/* Hero Stats */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                        variants={containerVariants as any}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Total Zones */}
                        <motion.div className="card" variants={itemVariants as any}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-primary-700" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600">Total Zones</h3>
                            </div>
                            <p className="metric-value-lg text-gray-900">
                                <AnimatedCounter value={totalZones} />
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Monitoring zones</p>
                        </motion.div>

                        {/* Active Insights */}
                        <motion.div className="card" variants={itemVariants as any}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-orange-700" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600">Active Insights</h3>
                            </div>
                            <p className="metric-value-lg text-gray-900">
                                <AnimatedCounter value={activeInsightsCount} />
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Requiring attention</p>
                        </motion.div>

                        {/* System Health */}
                        <motion.div className="card" variants={itemVariants as any}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-700" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600">System Health</h3>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="metric-value-lg text-gray-900">
                                    <AnimatedCounter value={Math.round(systemHealth)} />
                                </p>
                                <span className="text-2xl text-gray-500">/100</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {getStatusIcon(systemStatus)} {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Impact Metrics */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ImpactMetric
                                value="2.4 tons"
                                label="CO₂ Offset/Year"
                                icon={<Leaf />}
                                gradient="var(--gradient-growth)"
                                delay={0}
                            />
                            <ImpactMetric
                                value="12,500 L"
                                label="Water Saved/Month"
                                icon={<Droplets />}
                                gradient="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
                                delay={0.1}
                            />
                            <ImpactMetric
                                value="450 m²"
                                label="Green Coverage"
                                icon={<Maximize2 />}
                                gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                                delay={0.2}
                            />
                        </div>
                    </div>

                    {/* Installation Overview */}
                    {installation && (
                        <div className="card mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-primary-700" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                                        {installation.name}
                                    </h2>
                                    <p className="text-gray-600 mb-4">{installation.location}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                        ✓ {installation.status.charAt(0).toUpperCase() + installation.status.slice(1)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gardens Grid */}
                    {gardens && gardens.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gardens</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {gardens.map((garden) => {
                                    const gardenZones = zones?.filter((z) => z.gardenId === garden.id) || []
                                    return (
                                        <Link
                                            key={garden.id}
                                            to={`/gardens/${garden.id}`}
                                            className="card hover:shadow-xl transition-all duration-300 block"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {garden.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 capitalize">
                                                {garden.type.replace(/_/g, ' ')} • {garden.orientation}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Zones:</span>
                                                    <span className="ml-2 font-semibold text-gray-900">
                                                        {gardenZones.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Recent Insights */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Insights</h2>
                            <a
                                href="/insights"
                                className="text-sm font-medium text-primary-700 hover:text-primary-600 hover:underline"
                            >
                                View All →
                            </a>
                        </div>

                        {insights && insights.length > 0 ? (
                            <div className="space-y-4">
                                {insights.slice(0, 5).map((insight) => (
                                    <InsightCard key={insight.id} insight={insight} />
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center py-12">
                                <p className="text-gray-500">No active insights. All systems healthy! ✓</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
