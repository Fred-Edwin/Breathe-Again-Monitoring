import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/metrics
// Returns all metric definitions with ideal ranges
router.get('/', async (req, res) => {
    try {
        const metrics = await prisma.metric.findMany({
            orderBy: {
                key: 'asc',
            },
        });

        res.json({ metrics });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});

// GET /api/metrics/:key
// Returns a single metric definition
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;

        const metric = await prisma.metric.findUnique({
            where: { key },
        });

        if (!metric) {
            return res.status(404).json({ error: 'Metric not found' });
        }

        res.json({ metric });
    } catch (error) {
        console.error('Error fetching metric:', error);
        res.status(500).json({ error: 'Failed to fetch metric' });
    }
});

export default router;
