import axios from 'axios'
import type { Zone, Garden, Installation, Metric, Reading, Insight } from './types'


// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Use env var in production, proxy in dev
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor for logging (development only)
if (import.meta.env.DEV) {
    api.interceptors.request.use((config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
    })
}

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[API Error]', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

// Zones API
export const zonesApi = {
    getAll: () => api.get<{ zones: Zone[] }>('/zones').then((r) => r.data.zones),
    getById: (id: string) => api.get<{ zone: Zone; latestReadings: Reading[]; insights: Insight[] }>(`/zones/${id}`).then((r) => ({
        ...r.data.zone,
        latestReadings: r.data.latestReadings,
        insights: r.data.insights,
    })),
}

// Gardens API
export const gardensApi = {
    getAll: () => api.get<{ gardens: Garden[] }>('/gardens').then((r) => r.data.gardens),
    getById: (id: string) => api.get<{ garden: Garden }>(`/gardens/${id}`).then((r) => r.data.garden),
}

// Installations API
export const installationsApi = {
    getAll: () => api.get<{ installations: Installation[] }>('/installations').then((r) => r.data.installations),
    getById: (id: string) =>
        api.get<{ installation: Installation }>(`/installations/${id}`).then((r) => r.data.installation),
}

// Metrics API
export const metricsApi = {
    getAll: () => api.get<{ metrics: Metric[] }>('/metrics').then((r) => r.data.metrics),
}

export default api
