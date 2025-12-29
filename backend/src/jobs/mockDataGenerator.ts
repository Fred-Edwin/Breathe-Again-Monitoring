import cron from 'node-cron';
import type { ScheduledTask } from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { simulationService } from '../services/simulationService';
import { rulesEngine } from '../services/rulesEngine';

const prisma = new PrismaClient();

let cronJob: ScheduledTask | null = null;

/**
 * Generate mock sensor readings for all zones
 */
async function generateMockData() {
    try {
        const startTime = Date.now();
        console.log(`\n[Mock Data] Starting generation at ${new Date().toISOString()}`);

        // Get all active zones with their gardens
        const zones = await prisma.zone.findMany({
            include: {
                garden: {
                    include: {
                        installation: true,
                    },
                },
            },
        });

        // Get all metrics
        const metrics = await prisma.metric.findMany();

        const timestamp = new Date();
        const readings = [];

        // Generate readings for each zone and metric
        for (const zone of zones) {
            for (const metric of metrics) {
                const value = await simulationService.generateReading(
                    zone as any,
                    metric.key,
                    timestamp
                );

                readings.push({
                    zoneId: zone.id,
                    metricKey: metric.key,
                    value,
                    timestamp,
                    source: 'mock' as const,
                });
            }
        }

        // Batch insert all readings
        await prisma.metricReading.createMany({
            data: readings,
        });

        const duration = Date.now() - startTime;
        console.log(
            `[Mock Data] ✓ Generated ${readings.length} readings (${zones.length} zones × ${metrics.length} metrics) in ${duration}ms`
        );

        // Evaluate rules after generating data
        await rulesEngine.evaluateAllRules();
    } catch (error) {
        console.error('[Mock Data] ✗ Error generating data:', error);
    }
}

/**
 * Start the mock data generator
 * Runs every 5 minutes
 */
export function startMockDataGenerator() {
    if (cronJob) {
        console.log('[Mock Data] Generator already running');
        return;
    }

    // Schedule: every 5 minutes
    cronJob = cron.schedule('*/5 * * * *', async () => {
        await generateMockData();
    });

    console.log('[Mock Data] 📊 Generator started (runs every 5 minutes)');

    // Generate initial data immediately
    console.log('[Mock Data] Generating initial data...');
    generateMockData();
}

/**
 * Stop the mock data generator
 */
export function stopMockDataGenerator() {
    if (cronJob) {
        cronJob.stop();
        cronJob = null;
        console.log('[Mock Data] Generator stopped');
    }
}

/**
 * Manually trigger data generation (for testing)
 */
export async function triggerMockDataGeneration() {
    await generateMockData();
}
