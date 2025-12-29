import { useQuery } from '@tanstack/react-query'
import { zonesApi } from '@/lib/api'
import type { Insight } from '@/lib/types'

/**
 * Fetch insights for a specific zone
 */
export function useZoneInsights(zoneId: string) {
    return useQuery({
        queryKey: ['zones', zoneId, 'insights'],
        queryFn: async () => {
            const zone = await zonesApi.getById(zoneId)
            return zone.insights || []
        },
        refetchInterval: 30000,
        enabled: !!zoneId,
    })
}

/**
 * Fetch all insights across all zones
 */
export function useAllInsights() {
    return useQuery({
        queryKey: ['insights', 'all'],
        queryFn: async () => {
            const zones = await zonesApi.getAll()
            const allInsights: Insight[] = []

            zones.forEach((zone) => {
                if (zone.insights) {
                    zone.insights.forEach((insight) => {
                        allInsights.push({
                            ...insight,
                            zone, // Attach zone data to insight
                        })
                    })
                }
            })

            // Sort by createdAt descending (newest first)
            return allInsights.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
        },
        refetchInterval: 30000,
    })
}

/**
 * Fetch active (unresolved) insights
 */
export function useActiveInsights() {
    return useQuery({
        queryKey: ['insights', 'active'],
        queryFn: async () => {
            const zones = await zonesApi.getAll()
            const activeInsights: Insight[] = []

            zones.forEach((zone) => {
                if (zone.insights) {
                    zone.insights
                        .filter((insight) => !insight.resolvedAt)
                        .forEach((insight) => {
                            activeInsights.push({
                                ...insight,
                                zone,
                            })
                        })
                }
            })

            return activeInsights.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
        },
        refetchInterval: 30000,
    })
}

/**
 * Fetch resolved insights
 */
export function useResolvedInsights() {
    return useQuery({
        queryKey: ['insights', 'resolved'],
        queryFn: async () => {
            const zones = await zonesApi.getAll()
            const resolvedInsights: Insight[] = []

            zones.forEach((zone) => {
                if (zone.insights) {
                    zone.insights
                        .filter((insight) => insight.resolvedAt)
                        .forEach((insight) => {
                            resolvedInsights.push({
                                ...insight,
                                zone,
                            })
                        })
                }
            })

            return resolvedInsights.sort(
                (a, b) =>
                    new Date(b.resolvedAt!).getTime() - new Date(a.resolvedAt!).getTime()
            )
        },
        refetchInterval: 30000,
    })
}
