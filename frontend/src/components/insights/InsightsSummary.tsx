import { AlertCircle, AlertTriangle, Info, TrendingUp } from 'lucide-react'
import type { Insight } from '@/lib/types'

interface InsightsSummaryProps {
    insights: Insight[]
}

export default function InsightsSummary({ insights }: InsightsSummaryProps) {
    const total = insights.length
    const critical = insights.filter((i) => i.severity === 'critical').length
    const warning = insights.filter((i) => i.severity === 'warning').length
    const info = insights.filter((i) => i.severity === 'info').length

    const stats = [
        {
            label: 'Total Insights',
            value: total,
            icon: TrendingUp,
            color: 'bg-blue-100 text-blue-700',
            iconColor: 'text-blue-600',
        },
        {
            label: 'Critical',
            value: critical,
            icon: AlertCircle,
            color: 'bg-red-100 text-red-700',
            iconColor: 'text-red-600',
        },
        {
            label: 'Warning',
            value: warning,
            icon: AlertTriangle,
            color: 'bg-orange-100 text-orange-700',
            iconColor: 'text-orange-600',
        },
        {
            label: 'Info',
            value: info,
            icon: Info,
            color: 'bg-blue-100 text-blue-700',
            iconColor: 'text-blue-600',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div key={stat.label} className="card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                        </div>
                        <p className="metric-value-lg text-gray-900">{stat.value}</p>
                    </div>
                )
            })}
        </div>
    )
}
