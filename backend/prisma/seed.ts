import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...\n');

    // Clear existing data (in reverse order of dependencies)
    console.log('Clearing existing data...');
    await prisma.insight.deleteMany();
    await prisma.metricReading.deleteMany();
    await prisma.metric.deleteMany();
    await prisma.zone.deleteMany();
    await prisma.garden.deleteMany();
    await prisma.installation.deleteMany();
    console.log('✓ Cleared existing data\n');

    // Create Installation
    console.log('Creating installation...');
    const installation = await prisma.installation.create({
        data: {
            name: 'Nairobi Green Tower',
            location: 'Westlands, Nairobi',
            status: 'active',
        },
    });
    console.log(`✓ Created installation: ${installation.name}\n`);

    // Create Gardens
    console.log('Creating gardens...');
    const lobbyGarden = await prisma.garden.create({
        data: {
            installationId: installation.id,
            name: 'Lobby Vertical Garden',
            type: 'vertical_garden',
            orientation: 'interior',
            size: { width: 6, height: 4, unit: 'meters' },
        },
    });

    const rooftopGarden = await prisma.garden.create({
        data: {
            installationId: installation.id,
            name: 'Rooftop Garden',
            type: 'green_roof',
            orientation: 'south',
            size: { width: 12, height: 8, unit: 'meters' },
        },
    });
    console.log(`✓ Created ${2} gardens\n`);

    // Create Zones
    console.log('Creating zones...');
    const zones = await Promise.all([
        // Lobby Garden Zones
        prisma.zone.create({
            data: {
                gardenId: lobbyGarden.id,
                name: 'Zone A - Upper Left',
                plantType: 'Ferns & Philodendrons',
                exposure: 'low',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: lobbyGarden.id,
                name: 'Zone B - Upper Right',
                plantType: 'Pothos & Snake Plants',
                exposure: 'low',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: lobbyGarden.id,
                name: 'Zone C - Middle',
                plantType: 'Mixed Tropical',
                exposure: 'medium',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: lobbyGarden.id,
                name: 'Zone D - Lower Left',
                plantType: 'Moss & Ferns',
                exposure: 'low',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: lobbyGarden.id,
                name: 'Zone E - Lower Right',
                plantType: 'Succulents',
                exposure: 'medium',
            },
        }),
        // Rooftop Garden Zones
        prisma.zone.create({
            data: {
                gardenId: rooftopGarden.id,
                name: 'Zone A - North Section',
                plantType: 'Sedums & Grasses',
                exposure: 'high',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: rooftopGarden.id,
                name: 'Zone B - South Section',
                plantType: 'Drought-Resistant Succulents',
                exposure: 'high',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: rooftopGarden.id,
                name: 'Zone C - East Section',
                plantType: 'Native Grasses',
                exposure: 'high',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: rooftopGarden.id,
                name: 'Zone D - West Section',
                plantType: 'Wildflowers',
                exposure: 'medium',
            },
        }),
        prisma.zone.create({
            data: {
                gardenId: rooftopGarden.id,
                name: 'Zone E - Center',
                plantType: 'Mixed Perennials',
                exposure: 'high',
            },
        }),
    ]);
    console.log(`✓ Created ${zones.length} zones\n`);

    // Create Metrics
    console.log('Creating metrics...');
    const metrics = await Promise.all([
        prisma.metric.create({
            data: {
                key: 'soil_moisture',
                unit: '%',
                idealMin: 30,
                idealMax: 45,
                description: 'Volumetric water content in soil',
            },
        }),
        prisma.metric.create({
            data: {
                key: 'temperature',
                unit: '°C',
                idealMin: 18,
                idealMax: 26,
                description: 'Ambient air temperature',
            },
        }),
        prisma.metric.create({
            data: {
                key: 'humidity',
                unit: '%',
                idealMin: 45,
                idealMax: 70,
                description: 'Relative humidity',
            },
        }),
        prisma.metric.create({
            data: {
                key: 'light',
                unit: 'lux',
                idealMin: 800,
                idealMax: 2500,
                description: 'Light intensity (PAR approximation)',
            },
        }),
    ]);
    console.log(`✓ Created ${metrics.length} metrics\n`);

    // Create initial readings (24 hours of data, every 5 minutes)
    console.log('Creating initial metric readings (24 hours)...');
    const now = new Date();
    const readings = [];
    const intervalsPerDay = (24 * 60) / 5; // 288 readings per metric per zone

    for (const zone of zones) {
        for (const metric of metrics) {
            for (let i = 0; i < intervalsPerDay; i++) {
                const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
                const value = generateRealisticValue(metric.key, timestamp);

                readings.push({
                    zoneId: zone.id,
                    metricKey: metric.key,
                    value,
                    timestamp,
                    source: 'mock' as const,
                });
            }
        }
    }

    // Batch insert readings
    await prisma.metricReading.createMany({
        data: readings,
    });
    console.log(`✓ Created ${readings.length} metric readings\n`);

    console.log('✅ Seed completed successfully!');
    console.log('\nSummary:');
    console.log(`- 1 installation`);
    console.log(`- 2 gardens`);
    console.log(`- ${zones.length} zones`);
    console.log(`- ${metrics.length} metrics`);
    console.log(`- ${readings.length} readings (24 hours of data)`);
}

// Helper function to generate realistic values
function generateRealisticValue(metricKey: string, timestamp: Date): number {
    const hour = timestamp.getHours();
    const minute = timestamp.getMinutes();
    const timeOfDay = hour + minute / 60;

    switch (metricKey) {
        case 'soil_moisture':
            // Slowly decaying from 40% to 32%, with random variation
            const baseDecay = 40 - (Math.random() * 8);
            return Math.max(28, Math.min(45, baseDecay + (Math.random() - 0.5) * 3));

        case 'temperature':
            // Sinusoidal pattern: cooler at night (18°C), warmer during day (24°C)
            const tempBase = 21 + 3 * Math.sin((timeOfDay - 6) * Math.PI / 12);
            return Math.max(16, Math.min(28, tempBase + (Math.random() - 0.5) * 2));

        case 'humidity':
            // Inverse to temperature: higher at night, lower during day
            const humidityBase = 60 - 10 * Math.sin((timeOfDay - 6) * Math.PI / 12);
            return Math.max(40, Math.min(75, humidityBase + (Math.random() - 0.5) * 5));

        case 'light':
            // Light follows sun: 0 at night, peak at noon
            if (timeOfDay < 6 || timeOfDay > 18) {
                return Math.random() * 100; // Very low light at night
            }
            const lightBase = 1500 + 800 * Math.sin((timeOfDay - 6) * Math.PI / 12);
            return Math.max(0, Math.min(3000, lightBase + (Math.random() - 0.5) * 300));

        default:
            return 0;
    }
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
