import { useQuery } from '@tanstack/react-query'
import { gardensApi } from '../lib/api'
import type { Garden } from '../lib/types'

export function useGarden(id: string) {
    return useQuery<Garden>({
        queryKey: ['garden', id],
        queryFn: () => gardensApi.getById(id),
        enabled: !!id,
    })
}
