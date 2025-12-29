import { useQuery } from '@tanstack/react-query'
import { installationsApi } from '@/lib/api'

/**
 * Fetch all installations
 */
export function useInstallations() {
    return useQuery({
        queryKey: ['installations'],
        queryFn: installationsApi.getAll,
        refetchInterval: 30000, // Poll every 30s
    })
}

/**
 * Fetch single installation by ID
 */
export function useInstallation(id: string) {
    return useQuery({
        queryKey: ['installations', id],
        queryFn: () => installationsApi.getById(id),
        refetchInterval: 30000,
        enabled: !!id, // Only fetch if id exists
    })
}
