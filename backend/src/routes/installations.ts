import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/installations
// Returns all installations with optional nested data
router.get('/', async (req, res) => {
    try {
        const { include } = req.query;
        const includeGardens = include?.toString().includes('gardens');
        const includeZones = include?.toString().includes('zones');

        const installations = await prisma.installation.findMany({
            include: {
                gardens: includeGardens
                    ? {
                        include: {
                            zones: includeZones,
                        },
                    }
                    : false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({ installations });
    } catch (error) {
        console.error('Error fetching installations:', error);
        res.status(500).json({ error: 'Failed to fetch installations' });
    }
});

// GET /api/installations/:id
// Returns a single installation with nested data
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const installation = await prisma.installation.findUnique({
            where: { id },
            include: {
                gardens: {
                    include: {
                        zones: true,
                    },
                },
            },
        });

        if (!installation) {
            return res.status(404).json({ error: 'Installation not found' });
        }

        return res.json({ installation });
    } catch (error) {
        console.error('Error fetching installation:', error);
        return res.status(500).json({ error: 'Failed to fetch installation' });
    }
});

export default router;
