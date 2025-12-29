// Mathematical utilities for trend analysis

export interface LinearRegressionResult {
    slope: number;
    intercept: number;
    r2: number; // Coefficient of determination (0-1)
}

export interface Reading {
    value: number;
    timestamp: Date;
}

/**
 * Calculate linear regression for time-series data
 * Returns slope, intercept, and R² value
 */
export function calculateLinearRegression(readings: Reading[]): LinearRegressionResult {
    if (readings.length < 2) {
        return { slope: 0, intercept: 0, r2: 0 };
    }

    // Convert timestamps to hours since first reading
    const firstTime = readings[0].timestamp.getTime();
    const points = readings.map((r, i) => ({
        x: (r.timestamp.getTime() - firstTime) / (1000 * 60 * 60), // Hours
        y: r.value,
    }));

    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

    // Calculate slope and intercept
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R² (coefficient of determination)
    const meanY = sumY / n;
    const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
    const ssResidual = points.reduce((sum, p) => {
        const predicted = slope * p.x + intercept;
        return sum + Math.pow(p.y - predicted, 2);
    }, 0);

    const r2 = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

    return {
        slope,
        intercept,
        r2: Math.max(0, Math.min(1, r2)), // Clamp between 0 and 1
    };
}

/**
 * Project future value based on linear trend
 * @param trend Linear regression result
 * @param hoursAhead Number of hours to project into future
 * @param currentValue Current value (for reference)
 */
export function projectValue(
    trend: LinearRegressionResult,
    hoursAhead: number,
    currentValue: number
): number {
    // Use the trend to project forward
    const projection = currentValue + trend.slope * hoursAhead;
    return projection;
}

/**
 * Calculate duration in hours between first and last reading
 */
export function calculateDuration(readings: Reading[]): number {
    if (readings.length === 0) return 0;

    const first = readings[0].timestamp.getTime();
    const last = readings[readings.length - 1].timestamp.getTime();

    return (last - first) / (1000 * 60 * 60); // Hours
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(hours: number): string {
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (hours < 24) {
        const h = Math.round(hours);
        return `${h} hour${h !== 1 ? 's' : ''}`;
    } else {
        const days = Math.round(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''}`;
    }
}
