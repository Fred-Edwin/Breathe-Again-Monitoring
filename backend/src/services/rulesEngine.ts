import { PrismaClient } from '@prisma/client';
import { calculateLinearRegression, projectValue, calculateDuration } from './mathUtils';
import { explanationService } from './explanationService';

const prisma = new PrismaClient();

export class RulesEngine {
    /**
     * Evaluate all rules for all zones and metrics
     * Called after each data generation cycle
     */
    async evaluateAllRules() {
        try {
            const startTime = Date.now();

            const zones = await prisma.zone.findMany({
                include: {
                    garden: {
                        include: {
                            installation: true,
                        },
                    },
                },
            });

            const metrics = await prisma.metric.findMany();

            let insightsCreated = 0;
            let insightsResolved = 0;

            for (const zone of zones) {
                for (const metric of metrics) {
                    // Evaluate all rule types
                    const created = await this.evaluateZoneMetric(zone as any, metric);
                    insightsCreated += created;
                }
            }

            // Check for resolutions
            insightsResolved = await this.checkResolutions();

            const duration = Date.now() - startTime;
            console.log(
                `[Rules Engine] ✓ Evaluated ${zones.length * metrics.length} rules in ${duration}ms (${insightsCreated} created, ${insightsResolved} resolved)`
            );
        } catch (error) {
            console.error('[Rules Engine] Error evaluating rules:', error);
        }
    }

    /**
     * Evaluate all rules for a specific zone and metric
     */
    private async evaluateZoneMetric(zone: any, metric: any): Promise<number> {
        let created = 0;

        // Check if there's already an active insight for this zone/metric
        const existingInsight = await prisma.insight.findFirst({
            where: {
                zoneId: zone.id,
                metricKey: metric.key,
                resolvedAt: null,
            },
        });

        // If insight exists, skip creating new ones (avoid duplicates)
        if (existingInsight) {
            return 0;
        }

        // Evaluate threshold rules
        if (await this.evaluateThresholdRule(zone, metric)) created++;

        // Evaluate duration rules
        if (await this.evaluateDurationRule(zone, metric)) created++;

        // Evaluate trend rules
        if (await this.evaluateTrendRule(zone, metric)) created++;

        // Check for sensor offline
        if (await this.checkSensorOffline(zone, metric)) created++;

        return created;
    }

    /**
     * Threshold Rule: Check if current value is outside ideal range
     */
    private async evaluateThresholdRule(zone: any, metric: any): Promise<boolean> {
        const latestReading = await prisma.metricReading.findFirst({
            where: {
                zoneId: zone.id,
                metricKey: metric.key,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        if (!latestReading) return false;

        const outOfRange =
            latestReading.value < metric.idealMin || latestReading.value > metric.idealMax;

        if (!outOfRange) return false;

        // Calculate severity
        const deviation = Math.max(
            Math.abs(latestReading.value - metric.idealMin),
            Math.abs(latestReading.value - metric.idealMax)
        );
        const range = metric.idealMax - metric.idealMin;
        const severity = deviation > range * 0.5 ? 'critical' : 'warning';

        // Generate explanation
        const explanation = explanationService.generateExplanation({
            type: 'threshold',
            zone,
            metric,
            value: latestReading.value,
            severity,
        });

        // Create insight
        await prisma.insight.create({
            data: {
                zoneId: zone.id,
                metricKey: metric.key,
                severity,
                explanation,
                confidence: 1.0, // Definitive
            },
        });

        return true;
    }

    /**
     * Duration Rule: Check if value has been out of range for extended period
     */
    private async evaluateDurationRule(zone: any, metric: any): Promise<boolean> {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

        const readings = await prisma.metricReading.findMany({
            where: {
                zoneId: zone.id,
                metricKey: metric.key,
                timestamp: { gte: since },
            },
            orderBy: {
                timestamp: 'asc',
            },
        });

        if (readings.length === 0) return false;

        // Find continuous out-of-range periods
        const outOfRangeReadings = readings.filter(
            (r) => r.value < metric.idealMin || r.value > metric.idealMax
        );

        if (outOfRangeReadings.length === 0) return false;

        // Calculate duration of out-of-range period
        const durationHours = calculateDuration(outOfRangeReadings);

        // Trigger if out of range for more than 6 hours
        if (durationHours < 6) return false;

        const severity = durationHours > 24 ? 'critical' : 'warning';

        const explanation = explanationService.generateExplanation({
            type: 'duration',
            zone,
            metric,
            durationHours,
            severity,
        });

        await prisma.insight.create({
            data: {
                zoneId: zone.id,
                metricKey: metric.key,
                severity,
                explanation,
                confidence: 0.9,
            },
        });

        return true;
    }

    /**
     * Trend Rule: Detect declining trends using linear regression
     */
    private async evaluateTrendRule(zone: any, metric: any): Promise<boolean> {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

        const readings = await prisma.metricReading.findMany({
            where: {
                zoneId: zone.id,
                metricKey: metric.key,
                timestamp: { gte: since },
            },
            orderBy: {
                timestamp: 'asc',
            },
        });

        // Need at least 20 readings for meaningful trend
        if (readings.length < 20) return false;

        const trend = calculateLinearRegression(readings);

        // Only care about declining trends with high confidence
        // For soil moisture, slope < -0.3 means losing 0.3% per hour
        const isSignificantDecline = trend.slope < -0.3 && trend.r2 > 0.6;

        if (!isSignificantDecline) return false;

        // Project 48 hours ahead
        const currentValue = readings[readings.length - 1].value;
        const projectedValue = projectValue(trend, 48, currentValue);

        const explanation = explanationService.generateExplanation({
            type: 'trend',
            zone,
            metric,
            slope: trend.slope,
            projectedValue,
            hoursAhead: 48,
        });

        await prisma.insight.create({
            data: {
                zoneId: zone.id,
                metricKey: metric.key,
                severity: 'warning',
                explanation,
                confidence: trend.r2, // Use R² as confidence
            },
        });

        return true;
    }

    /**
     * Check if sensor is offline (no recent data)
     */
    private async checkSensorOffline(zone: any, metric: any): Promise<boolean> {
        const since = new Date(Date.now() - 30 * 60 * 1000); // Last 30 minutes

        const recentReadings = await prisma.metricReading.count({
            where: {
                zoneId: zone.id,
                metricKey: metric.key,
                timestamp: { gte: since },
            },
        });

        // If we have recent readings, sensor is online
        if (recentReadings > 0) return false;

        // Find when we last got data
        const lastReading = await prisma.metricReading.findFirst({
            where: {
                zoneId: zone.id,
                metricKey: metric.key,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        if (!lastReading) return false;

        const minutesSinceLastReading =
            (Date.now() - lastReading.timestamp.getTime()) / (1000 * 60);

        const explanation = explanationService.generateExplanation({
            type: 'sensor_offline',
            zone,
            metric,
            durationMinutes: Math.round(minutesSinceLastReading),
        });

        await prisma.insight.create({
            data: {
                zoneId: zone.id,
                metricKey: metric.key,
                severity: 'critical',
                explanation,
                confidence: 1.0,
            },
        });

        return true;
    }

    /**
     * Check if any active insights should be resolved
     */
    private async checkResolutions(): Promise<number> {
        const activeInsights = await prisma.insight.findMany({
            where: { resolvedAt: null },
            include: {
                zone: {
                    include: {
                        garden: true,
                    },
                },
                metric: true,
            },
        });

        let resolved = 0;

        for (const insight of activeInsights) {
            if (!insight.zone || !insight.metric) continue;

            const shouldResolve = await this.shouldResolveInsight(insight);

            if (shouldResolve) {
                await prisma.insight.update({
                    where: { id: insight.id },
                    data: { resolvedAt: new Date() },
                });
                resolved++;
            }
        }

        return resolved;
    }

    /**
     * Determine if an insight should be auto-resolved
     */
    private async shouldResolveInsight(insight: any): Promise<boolean> {
        if (!insight.zone || !insight.metric) return false;

        // Get recent readings (last 30 minutes)
        const since = new Date(Date.now() - 30 * 60 * 1000);
        const recentReadings = await prisma.metricReading.findMany({
            where: {
                zoneId: insight.zoneId,
                metricKey: insight.metricKey,
                timestamp: { gte: since },
            },
            orderBy: {
                timestamp: 'desc',
            },
            take: 6, // Last 6 readings (30 minutes at 5-min intervals)
        });

        if (recentReadings.length === 0) {
            // No recent data - don't resolve sensor offline issues
            return false;
        }

        // Check if all recent readings are in range
        const allInRange = recentReadings.every(
            (r) => r.value >= insight.metric.idealMin && r.value <= insight.metric.idealMax
        );

        return allInRange;
    }
}

export const rulesEngine = new RulesEngine();
