import { PrismaClient } from '@prisma/client';
import { zoneStateService } from './zoneStateService';

const prisma = new PrismaClient();

interface Zone {
    id: string;
    exposure: string;
    garden: {
        orientation: string;
    };
}

export class SimulationService {
    /**
     * Generate a realistic reading for a specific zone and metric
     */
    async generateReading(
        zone: Zone,
        metricKey: string,
        timestamp: Date
    ): Promise<number> {
        const hour = timestamp.getHours();
        const minute = timestamp.getMinutes();
        const timeOfDay = hour + minute / 60;

        // Check for active anomaly
        const anomalyType = zoneStateService.checkForAnomaly(zone.id);

        switch (metricKey) {
            case 'light':
                return this.generateLight(zone, timeOfDay, anomalyType);
            case 'temperature':
                return this.generateTemperature(zone, timeOfDay, anomalyType);
            case 'humidity':
                return this.generateHumidity(zone, timeOfDay, anomalyType);
            case 'soil_moisture':
                return await this.generateSoilMoisture(zone, timeOfDay, anomalyType);
            default:
                return 0;
        }
    }

    /**
     * Light intensity - Sinusoidal sun cycle
     */
    private generateLight(zone: Zone, timeOfDay: number, anomalyType?: string): number {
        // Flatline anomaly
        if (anomalyType === 'flatline') {
            const state = zoneStateService.getZoneState(zone.id);
            if (!state.anomalyValue) {
                state.anomalyValue = 1200 + Math.random() * 400;
                state.anomalyMetric = 'light';
            }
            return state.anomalyValue;
        }

        // Night time (very low light)
        if (timeOfDay < 6 || timeOfDay > 18) {
            return Math.random() * 100;
        }

        // Daytime - sinusoidal pattern
        const base = 1500;
        const amplitude = 1000;
        const lightValue = base + amplitude * Math.sin(((timeOfDay - 6) * Math.PI) / 12);

        // Zone modifiers
        let modifier = 1.0;
        if (zone.garden.orientation === 'interior') {
            modifier = 0.7; // 30% less light indoors
        } else if (zone.exposure === 'high') {
            modifier = 1.2; // 20% more light
        } else if (zone.exposure === 'low') {
            modifier = 0.8; // 20% less light
        }

        // Add natural variation
        const variation = (Math.random() - 0.5) * 300;
        const finalValue = lightValue * modifier + variation;

        return Math.max(0, Math.min(3000, finalValue));
    }

    /**
     * Temperature - Follows light with lag
     */
    private generateTemperature(zone: Zone, timeOfDay: number, anomalyType?: string): number {
        // Flatline anomaly
        if (anomalyType === 'flatline') {
            const state = zoneStateService.getZoneState(zone.id);
            if (!state.anomalyValue || state.anomalyMetric !== 'temperature') {
                state.anomalyValue = 20 + Math.random() * 4;
                state.anomalyMetric = 'temperature';
            }
            return state.anomalyValue;
        }

        // Out of range anomaly
        if (anomalyType === 'out_of_range') {
            const state = zoneStateService.getZoneState(zone.id);
            if (!state.anomalyValue || state.anomalyMetric !== 'temperature') {
                // Either too hot or too cold
                state.anomalyValue = Math.random() < 0.5 ? 28 + Math.random() * 3 : 15 + Math.random() * 2;
                state.anomalyMetric = 'temperature';
            }
            return state.anomalyValue;
        }

        // Normal temperature pattern (lags light by 1-2 hours)
        const base = 21;
        const amplitude = 3;
        const laggedTime = timeOfDay - 1.5; // 1.5 hour lag
        const tempValue = base + amplitude * Math.sin(((laggedTime - 6) * Math.PI) / 12);

        // Zone modifiers
        let modifier = 0;
        if (zone.garden.orientation !== 'interior' && timeOfDay > 10 && timeOfDay < 16) {
            modifier = 2; // Exterior zones warmer during peak sun
        }

        // Natural variation
        const variation = (Math.random() - 0.5) * 2;
        const finalValue = tempValue + modifier + variation;

        return Math.max(15, Math.min(30, finalValue));
    }

    /**
     * Humidity - Inverse to temperature
     */
    private generateHumidity(zone: Zone, timeOfDay: number, anomalyType?: string): number {
        // Flatline anomaly
        if (anomalyType === 'flatline') {
            const state = zoneStateService.getZoneState(zone.id);
            if (!state.anomalyValue || state.anomalyMetric !== 'humidity') {
                state.anomalyValue = 50 + Math.random() * 15;
                state.anomalyMetric = 'humidity';
            }
            return state.anomalyValue;
        }

        // Inverse sinusoidal pattern (high at night, low during day)
        const base = 60;
        const amplitude = 10;
        const humidityValue = base - amplitude * Math.sin(((timeOfDay - 6) * Math.PI) / 12);

        // Zone modifiers
        let modifier = 0;
        if (zone.exposure === 'high') {
            modifier = -5; // High exposure = more evaporation = less humidity
        } else if (zone.exposure === 'low') {
            modifier = 5; // Low exposure = less evaporation = more humidity
        }

        // Natural variation
        const variation = (Math.random() - 0.5) * 4;
        const finalValue = humidityValue + modifier + variation;

        return Math.max(35, Math.min(80, finalValue));
    }

    /**
     * Soil Moisture - Linear decay with watering events
     */
    private async generateSoilMoisture(
        zone: Zone,
        timeOfDay: number,
        anomalyType?: string
    ): Promise<number> {
        // Get last reading
        const lastReading = await prisma.metricReading.findFirst({
            where: {
                zoneId: zone.id,
                metricKey: 'soil_moisture',
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        let moisture = lastReading ? lastReading.value : 38;

        // No recovery anomaly - skip watering
        if (anomalyType === 'no_recovery') {
            // Just decay, no watering
            const hoursSinceLastWatering = zoneStateService.getHoursSinceWatering(zone.id);
            const decayRate = zone.exposure === 'high' ? 0.12 : zone.exposure === 'low' ? 0.05 : 0.08;
            const decay = decayRate * (5 / 60); // 5 minutes in hours
            moisture = Math.max(25, moisture - decay);
            return moisture;
        }

        // Flatline anomaly
        if (anomalyType === 'flatline') {
            const state = zoneStateService.getZoneState(zone.id);
            if (!state.anomalyValue || state.anomalyMetric !== 'soil_moisture') {
                state.anomalyValue = 32 + Math.random() * 6;
                state.anomalyMetric = 'soil_moisture';
            }
            return state.anomalyValue;
        }

        // Normal moisture behavior
        const hoursSinceLastWatering = zoneStateService.getHoursSinceWatering(zone.id);

        // Decay rate based on exposure
        const decayRate = zone.exposure === 'high' ? 0.12 : zone.exposure === 'low' ? 0.05 : 0.08;
        const decay = decayRate * (5 / 60); // 5 minutes in hours

        // Apply decay
        moisture = moisture - decay;

        // Watering event (approximately 2x per day = ~0.7% chance every 5 minutes)
        // More likely if moisture is low
        const wateringProbability = moisture < 32 ? 0.02 : 0.007;

        if (Math.random() < wateringProbability) {
            moisture = 40 + Math.random() * 3; // Restore to 40-43%
            zoneStateService.triggerWatering(zone.id);
        }

        // Clamp to realistic range
        return Math.max(25, Math.min(45, moisture));
    }
}

export const simulationService = new SimulationService();
