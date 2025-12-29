// API Response Types

export interface Installation {
    id: string
    name: string
    location: string
    status: 'active' | 'inactive' | 'maintenance'
    createdAt: string
    updatedAt: string
    gardens?: Garden[]
}

export interface Garden {
    id: string
    installationId: string
    name: string
    type: 'vertical_garden' | 'green_wall' | 'rooftop_garden' | 'indoor_garden'
    orientation: 'north' | 'south' | 'east' | 'west' | 'interior'
    createdAt: string
    updatedAt: string
    installation?: Installation
    zones?: Zone[]
}

export interface Zone {
    id: string
    gardenId: string
    name: string
    plantType: string
    exposure: 'low' | 'medium' | 'high'
    createdAt: string
    updatedAt: string
    garden?: Garden
    latestReadings?: Reading[]
    insights?: Insight[]
}

export interface Metric {
    key: string
    unit: string
    idealMin: number
    idealMax: number
    description: string
}

export interface Reading {
    id: string
    zoneId: string
    metricKey: string
    value: number
    timestamp: string
    source: 'mock' | 'sensor'
    metric?: Metric
}

export interface Insight {
    id: string
    zoneId: string
    metricKey: string
    severity: 'info' | 'warning' | 'critical'
    explanation: string
    confidence: number
    createdAt: string
    resolvedAt: string | null
    zone?: Zone
    metric?: Metric
}

// UI Helper Types

export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical'

export interface ZoneHealth {
    zoneId: string
    status: HealthStatus
    score: number
    activeInsights: number
}

export interface MetricStatus {
    key: string
    value: number
    status: 'in_range' | 'warning' | 'critical'
    trend: 'up' | 'down' | 'stable'
}
