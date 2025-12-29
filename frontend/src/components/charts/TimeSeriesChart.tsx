import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart,
} from 'recharts'

import { format } from 'date-fns'
import type { Reading } from '@/lib/types'
import { formatMetricValue } from '@/lib/utils'

interface TimeSeriesChartProps {
    data: Reading[]
    metricKey: string
    idealMin: number
    idealMax: number
    unit: string
}

export default function TimeSeriesChart({
    data,
    metricKey,
    idealMin,
    idealMax,
    unit,
}: TimeSeriesChartProps) {
    // Transform data for Recharts
    const chartData = data.map((reading) => ({
        timestamp: new Date(reading.timestamp).getTime(),
        value: reading.value,
        formattedTime: format(new Date(reading.timestamp), 'HH:mm'),
    }))

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">
                        {format(new Date(data.timestamp), 'MMM d, HH:mm')}
                    </p>
                    <p className="font-mono font-semibold text-gray-900">
                        {formatMetricValue(data.value, unit)}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                {metricKey.replace(/_/g, ' ')} - Last 24h
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                    <defs>
                        {/* Gradient for line */}
                        <linearGradient id={`gradient-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4A7C59" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4A7C59" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                    <XAxis
                        dataKey="formattedTime"
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                    />

                    <YAxis
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Ideal range shading */}
                    <ReferenceLine
                        y={idealMin}
                        stroke="#81C784"
                        strokeDasharray="3 3"
                        label={{ value: 'Min', position: 'left', fill: '#2E7D32', fontSize: 12 }}
                    />
                    <ReferenceLine
                        y={idealMax}
                        stroke="#81C784"
                        strokeDasharray="3 3"
                        label={{ value: 'Max', position: 'left', fill: '#2E7D32', fontSize: 12 }}
                    />

                    {/* Area fill under line */}
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="none"
                        fill={`url(#gradient-${metricKey})`}
                    />

                    {/* Main line */}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4A7C59"
                        strokeWidth={2}
                        dot={{ fill: '#4A7C59', r: 3 }}
                        activeDot={{ r: 5, fill: '#2D5F3F' }}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span className="text-gray-600">Current Value</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-green-400" />
                    <span className="text-gray-600">Ideal Range</span>
                </div>
            </div>
        </div>
    )
}
