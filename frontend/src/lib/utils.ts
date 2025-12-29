import { formatDistanceToNow } from 'date-fns'
import type { Reading, Insight, HealthStatus, MetricStatus } from './types'


/**
 * Calculate health score for a zone (0-100)
 * Based on out-of-range readings and active insights
 */
export function calculateHealthScore(
    readings: Reading[] = [],
    insights: Insight[] = []
): number {
    let score = 100

    // Deduct for out-of-range readings
    readings.forEach((reading) => {
        if (reading.metric) {
            const { value } = reading
            const { idealMin, idealMax } = reading.metric

            if (value < idealMin || value > idealMax) {
                score -= 10
            }
        }
    })

    // Deduct for active insights
    insights
        .filter((i) => !i.resolvedAt)
        .forEach((insight) => {
            if (insight.severity === 'critical') score -= 20
            if (insight.severity === 'warning') score -= 10
            if (insight.severity === 'info') score -= 5
        })

    return Math.max(0, Math.min(100, score))
}

/**
 * Get health status category from score
 */
export function getHealthStatus(score: number): HealthStatus {
    if (score >= 80) return 'excellent'
    if (score >= 60) return 'good'
    if (score >= 40) return 'warning'
    return 'critical'
}

/**
 * Get Tailwind color class for status
 */
export function getStatusColor(
    status: 'in_range' | 'warning' | 'critical' | 'info' | HealthStatus
): string {
    const colorMap: Record<string, string> = {
        in_range: 'text-green-700',
        excellent: 'text-green-700',
        good: 'text-green-600',
        warning: 'text-orange-600',
        critical: 'text-red-600',
        info: 'text-blue-600',
    }
    return colorMap[status] || 'text-gray-600'
}

/**
 * Get background color class for status badges
 */
export function getStatusBgColor(
    status: 'in_range' | 'warning' | 'critical' | 'info' | HealthStatus
): string {
    const colorMap: Record<string, string> = {
        in_range: 'bg-green-100 text-green-700',
        excellent: 'bg-green-100 text-green-700',
        good: 'bg-green-50 text-green-600',
        warning: 'bg-orange-100 text-orange-700',
        critical: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Format metric value with unit
 */
export function formatMetricValue(value: number, unit: string): string {
    // Round to 1 decimal place
    const rounded = Math.round(value * 10) / 10

    // Add space before unit except for %
    const separator = unit === '%' ? '' : ' '

    return `${rounded}${separator}${unit}`
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(timestamp: string): string {
    try {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
        return 'Unknown time'
    }
}

/**
 * Determine metric status based on value and ideal range
 */
export function getMetricStatus(
    value: number,
    idealMin: number,
    idealMax: number
): MetricStatus['status'] {
    if (value < idealMin || value > idealMax) {
        // Check if critically out of range (>20% deviation)
        const range = idealMax - idealMin
        const deviation = Math.max(
            Math.abs(value - idealMin),
            Math.abs(value - idealMax)
        )

        if (deviation > range * 0.2) {
            return 'critical'
        }
        return 'warning'
    }
    return 'in_range'
}

/**
 * Get trend direction from recent readings
 */
export function getTrend(readings: Reading[]): 'up' | 'down' | 'stable' {
    if (readings.length < 2) return 'stable'

    // Compare last reading to average of previous readings
    const lastValue = readings[readings.length - 1].value
    const previousValues = readings.slice(0, -1).map((r) => r.value)
    const avgPrevious =
        previousValues.reduce((sum, val) => sum + val, 0) / previousValues.length

    const change = ((lastValue - avgPrevious) / avgPrevious) * 100

    if (change > 5) return 'up'
    if (change < -5) return 'down'
    return 'stable'
}

/**
 * Conditional className utility (like clsx)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ')
}

/**
 * Get severity icon
 */
export function getSeverityIcon(severity: 'info' | 'warning' | 'critical'): string {
    const icons = {
        info: 'ℹ',
        warning: '⚠',
        critical: '✕',
    }
    return icons[severity]
}

/**
 * Get status icon
 */
export function getStatusIcon(status: HealthStatus): string {
    const icons = {
        excellent: '✓',
        good: '✓',
        warning: '⚠',
        critical: '✕',
    }
    return icons[status]
}

/**
 * Filter insights by severity
 */
export function filterInsightsBySeverity(
    insights: Insight[],
    severity: 'info' | 'warning' | 'critical' | 'all'
): Insight[] {
    if (severity === 'all') return insights
    return insights.filter((insight) => insight.severity === severity)
}

/**
 * Filter insights by zone
 */
export function filterInsightsByZone(
    insights: Insight[],
    zoneId: string | 'all'
): Insight[] {
    if (zoneId === 'all') return insights
    return insights.filter((insight) => insight.zoneId === zoneId)
}

/**
 * Sort insights by date
 */
export function sortInsightsByDate(
    insights: Insight[],
    order: 'asc' | 'desc' = 'desc'
): Insight[] {
    return [...insights].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return order === 'desc' ? dateB - dateA : dateA - dateB
    })
}

/**
 * Group insights by severity
 */
export function groupInsightsBySeverity(insights: Insight[]): {
    critical: Insight[]
    warning: Insight[]
    info: Insight[]
} {
    return {
        critical: insights.filter((i) => i.severity === 'critical'),
        warning: insights.filter((i) => i.severity === 'warning'),
        info: insights.filter((i) => i.severity === 'info'),
    }
}

