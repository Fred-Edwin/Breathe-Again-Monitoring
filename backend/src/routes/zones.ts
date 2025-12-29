import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/zones
// Returns all zones with optional latest readings
router.get('/', async (req, res) => {
    try {
        const { gardenId, include } = req.query;
        const includeReadings = include?.toString().includes('readings');

        const zones = await prisma.zone.findMany({
            where: gardenId ? { gardenId: gardenId.toString() } : undefined,
            include: {
                garden: {
                    include: {
                        installation: true,
                    },
                },
                readings: includeReadings
                    ? {
                        distinct: ['metricKey'],
                        orderBy: {
                            timestamp: 'desc',
                        },
                        take: 4, // One per metric
                        include: {
                            metric: true,
                        },
                    }
                    : false,
                insights: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({ zones });
    } catch (error) {
        console.error('Error fetching zones:', error);
        res.status(500).json({ error: 'Failed to fetch zones' });
    }
});

// GET /api/zones/:id
// Returns a single zone with latest readings for all metrics
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const zone = await prisma.zone.findUnique({
            where: { id },
            include: {
                garden: {
                    include: {
                        installation: true,
                    },
                },
            },
        });

        if (!zone) {
            return res.status(404).json({ error: 'Zone not found' });
        }

        // Get latest reading for each metric
        const metrics = await prisma.metric.findMany();
        const latestReadings = await Promise.all(
            metrics.map(async (metric) => {
                const reading = await prisma.metricReading.findFirst({
                    where: {
                        zoneId: id,
                        metricKey: metric.key,
                    },
                    orderBy: {
                        timestamp: 'desc',
                    },
                    include: {
                        metric: true,
                    },
                });
                return reading;
            })
        );

        // Get active insights for this zone
        const insights = await prisma.insight.findMany({
            where: {
                zoneId: id,
                resolvedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            zone,
            latestReadings: latestReadings.filter(Boolean),
            insights,
        });
    } catch (error) {
        console.error('Error fetching zone:', error);
        res.status(500).json({ error: 'Failed to fetch zone' });
    }
});

export default router;
