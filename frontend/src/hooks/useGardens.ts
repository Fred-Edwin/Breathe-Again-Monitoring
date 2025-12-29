import { useQuery } from '@tanstack/react-query'
import { gardensApi } from '@/lib/api'

/**
 * Fetch all gardens
 */
export function useGardens() {
    return useQuery({
        queryKey: ['gardens'],
        queryFn: gardensApi.getAll,
        refetchInterval: 30000, // Poll every 30s
    })
}

/**
 * Fetch single garden by ID
 */
export function useGarden(id: string) {
    return useQuery({
        queryKey: ['gardens', id],
        queryFn: () => gardensApi.getById(id),
        refetchInterval: 30000,
        enabled: !!id, // Only fetch if id exists
    })
}
