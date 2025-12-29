import { Link } from 'react-router-dom'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import type { Insight } from '@/lib/types'
import { getRelativeTime, getSeverityIcon } from '@/lib/utils'

interface InsightCardProps {
    insight: Insight
}

export default function InsightCard({ insight }: InsightCardProps) {
    const { severity, explanation, confidence, createdAt, zone } = insight

    // Get icon based on severity
    const Icon = {
        critical: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    }[severity]

    // Get badge classes based on severity
    const badgeClass = {
        critical: 'badge-critical',
        warning: 'badge-warning',
        info: 'badge-info',
    }[severity]

    return (
        <div className="card">
            {/* Severity Badge */}
            <div className="flex items-start gap-3 mb-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={badgeClass}>
                            {getSeverityIcon(severity)} {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                            {getRelativeTime(createdAt)}
                        </span>
                    </div>

                    {/* Zone Link */}
                    {zone && (
                        <Link
                            to={`/zones/${zone.id}`}
                            className="text-sm font-medium text-primary-700 hover:text-primary-600 hover:underline"
                        >
                            {zone.name}
                        </Link>
                    )}
                </div>
            </div>

            {/* Explanation */}
            <p className="text-gray-700 mb-4 leading-relaxed">{explanation}</p>

            {/* Confidence */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Confidence:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                    <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${confidence}%` }}
                    />
                </div>
                <span className="text-sm font-medium text-gray-900">{confidence}%</span>
            </div>
        </div>
    )
}
