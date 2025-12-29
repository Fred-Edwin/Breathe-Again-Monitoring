import { useQuery } from '@tanstack/react-query'
import { zonesApi } from '@/lib/api'

export function useZones() {
    return useQuery({
        queryKey: ['zones'],
        queryFn: zonesApi.getAll,
        refetchInterval: 30000, // Poll every 30 seconds
        staleTime: 25000,
    })
}

export function useZone(id: string) {
    return useQuery({
        queryKey: ['zones', id],
        queryFn: () => zonesApi.getById(id),
        refetchInterval: 30000,
        staleTime: 25000,
        enabled: !!id, // Only fetch if id exists
    })
}
