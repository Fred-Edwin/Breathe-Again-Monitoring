import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useActiveInsights, useResolvedInsights } from '../hooks/useInsights'
import { useZones } from '../hooks/useZones'
import InsightsSummary from '../components/insights/InsightsSummary'
import InsightCard from '../components/insights/InsightCard'
import FilterChips from '../components/ui/FilterChips'
import PageHero from '../components/ui/PageHero'
import { SkeletonCard } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import {
    filterInsightsBySeverity,
    filterInsightsByZone,
    groupInsightsBySeverity,
} from '../lib/utils'

export default function InsightsCenter() {
    const { data: activeInsights, isLoading: activeLoading, error: activeError, refetch: refetchActive } = useActiveInsights()
    const { data: resolvedInsights, isLoading: resolvedLoading } = useResolvedInsights()
    const { data: zones } = useZones()

    // Filter state
    const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
    const [zoneFilter, setZoneFilter] = useState<string>('all')
    const [showResolved, setShowResolved] = useState(false)

    // Apply filters
    const filteredActiveInsights = useMemo(() => {
        if (!activeInsights) return []
        let filtered = activeInsights

        filtered = filterInsightsBySeverity(filtered, severityFilter)
        filtered = filterInsightsByZone(filtered, zoneFilter)

        return filtered
    }, [activeInsights, severityFilter, zoneFilter])

    const filteredResolvedInsights = useMemo(() => {
        if (!resolvedInsights) return []
        let filtered = resolvedInsights

        filtered = filterInsightsBySeverity(filtered, severityFilter)
        filtered = filterInsightsByZone(filtered, zoneFilter)

        return filtered
    }, [resolvedInsights, severityFilter, zoneFilter])

    // Group active insights by severity
    const groupedInsights = useMemo(() => {
        return groupInsightsBySeverity(filteredActiveInsights)
    }, [filteredActiveInsights])

    // Clear filters
    const clearFilters = () => {
        setSeverityFilter('all')
        setZoneFilter('all')
    }

    const hasActiveFilters = severityFilter !== 'all' || zoneFilter !== 'all'

    // Loading state
    if (activeLoading || resolvedLoading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Insights Center</h1>
                    <p className="text-gray-600 mb-8">Monitor and manage system insights</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (activeError) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Insights Center</h1>
                    <ErrorState onRetry={refetchActive} />
                </div>
            </div>
        )
    }

    // Severity filter options with counts
    const severityOptions = [
        { label: 'All', value: 'all', count: activeInsights?.length || 0 },
        { label: 'Critical', value: 'critical', count: groupedInsights.critical.length },
        { label: 'Warning', value: 'warning', count: groupedInsights.warning.length },
        { label: 'Info', value: 'info', count: groupedInsights.info.length },
    ]

    // Determine hero image based on top insight severity
    const topInsight = filteredActiveInsights[0]
    const heroImage = topInsight?.severity === 'critical'
        ? '/images/hero/context_dry_soil_1767170320807.png'
        : '/images/hero/context_healthy_growth_1767170338458.png'

    return (
        <div>
            <PageHero
                image={heroImage}
                title="Insights Hub"
                subtitle={`${filteredActiveInsights.length} active insights need your attention`}
                height="30vh"
                overlay="gradient"
            />

            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Insights Center</h1>
                    <p className="text-gray-600 mb-8">Monitor and manage system insights</p>

                    {/* Summary Stats */}
                    {activeInsights && (
                        <div className="mb-8">
                            <InsightsSummary insights={activeInsights} />
                        </div>
                    )}

                    {/* Filters */}
                    <div className="card mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Severity</h3>
                                <FilterChips
                                    options={severityOptions}
                                    selected={severityFilter}
                                    onChange={(value) => setSeverityFilter(value as typeof severityFilter)}
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Zone</h3>
                                <select
                                    value={zoneFilter}
                                    onChange={(e) => setZoneFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="all">All Zones ({zones?.length || 0})</option>
                                    {zones?.map((zone) => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Insights */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Active Insights ({filteredActiveInsights.length})
                        </h2>

                        {filteredActiveInsights.length > 0 ? (
                            <div className="space-y-6">
                                {/* Critical */}
                                {groupedInsights.critical.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-red-700 mb-3 uppercase tracking-wide">
                                            Critical ({groupedInsights.critical.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {groupedInsights.critical.map((insight) => (
                                                <InsightCard key={insight.id} insight={insight} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Warning */}
                                {groupedInsights.warning.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-orange-700 mb-3 uppercase tracking-wide">
                                            Warning ({groupedInsights.warning.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {groupedInsights.warning.map((insight) => (
                                                <InsightCard key={insight.id} insight={insight} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Info */}
                                {groupedInsights.info.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-700 mb-3 uppercase tracking-wide">
                                            Info ({groupedInsights.info.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {groupedInsights.info.map((insight) => (
                                                <InsightCard key={insight.id} insight={insight} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="card text-center py-12">
                                <p className="text-gray-500">
                                    {hasActiveFilters
                                        ? 'No insights match your filters'
                                        : 'No active insights. All systems healthy! ✓'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Resolved Insights */}
                    {resolvedInsights && resolvedInsights.length > 0 && (
                        <div>
                            <button
                                onClick={() => setShowResolved(!showResolved)}
                                className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4 hover:text-primary-700 transition-colors"
                            >
                                Resolved Insights ({filteredResolvedInsights.length})
                                {showResolved ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>

                            {showResolved && (
                                <div className="space-y-4">
                                    {filteredResolvedInsights.length > 0 ? (
                                        filteredResolvedInsights.map((insight) => (
                                            <div key={insight.id} className="opacity-60">
                                                <InsightCard insight={insight} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="card text-center py-12">
                                            <p className="text-gray-500">No resolved insights match your filters</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
