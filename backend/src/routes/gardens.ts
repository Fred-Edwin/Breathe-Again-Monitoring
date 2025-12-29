import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/gardens
// Returns all gardens with optional nested zones
router.get('/', async (req, res) => {
    try {
        const { installationId, include } = req.query;
        const includeZones = include?.toString().includes('zones');

        const gardens = await prisma.garden.findMany({
            where: installationId
                ? { installationId: installationId.toString() }
                : undefined,
            include: {
                installation: true,
                zones: includeZones,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({ gardens });
    } catch (error) {
        console.error('Error fetching gardens:', error);
        res.status(500).json({ error: 'Failed to fetch gardens' });
    }
});

// GET /api/gardens/:id
// Returns a single garden with zones and latest readings
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const garden = await prisma.garden.findUnique({
            where: { id },
            include: {
                installation: true,
                zones: {
                    include: {
                        readings: {
                            take: 1,
                            orderBy: {
                                timestamp: 'desc',
                            },
                        },
                    },
                },
            },
        });

        if (!garden) {
            return res.status(404).json({ error: 'Garden not found' });
        }

        res.json({ garden });
    } catch (error) {
        console.error('Error fetching garden:', error);
        res.status(500).json({ error: 'Failed to fetch garden' });
    }
});

export default router;
