// Service for generating plain-English explanations for insights

import { formatDuration } from './mathUtils';

interface Zone {
    id: string;
    name: string;
    plantType: string;
    exposure: string;
    garden: {
        orientation: string;
    };
}

interface Metric {
    key: string;
    unit: string;
    idealMin: number;
    idealMax: number;
    description: string;
}

interface ThresholdContext {
    type: 'threshold';
    zone: Zone;
    metric: Metric;
    value: number;
    severity: 'info' | 'warning' | 'critical';
}

interface DurationContext {
    type: 'duration';
    zone: Zone;
    metric: Metric;
    durationHours: number;
    severity: 'info' | 'warning' | 'critical';
}

interface TrendContext {
    type: 'trend';
    zone: Zone;
    metric: Metric;
    slope: number;
    projectedValue: number;
    hoursAhead: number;
}

interface SensorOfflineContext {
    type: 'sensor_offline';
    zone: Zone;
    metric: Metric;
    durationMinutes: number;
}

type ExplanationContext =
    | ThresholdContext
    | DurationContext
    | TrendContext
    | SensorOfflineContext;

export class ExplanationService {
    generateExplanation(context: ExplanationContext): string {
        switch (context.type) {
            case 'threshold':
                return this.generateThresholdExplanation(context);
            case 'duration':
                return this.generateDurationExplanation(context);
            case 'trend':
                return this.generateTrendExplanation(context);
            case 'sensor_offline':
                return this.generateSensorOfflineExplanation(context);
            default:
                return 'An issue has been detected with this zone.';
        }
    }

    private generateThresholdExplanation(context: ThresholdContext): string {
        const { zone, metric, value } = context;
        const isLow = value < metric.idealMin;
        const isCritical = context.severity === 'critical';

        let explanation = '';

        // Main issue statement
        if (metric.key === 'soil_moisture') {
            explanation = `Soil moisture in ${zone.name} is currently ${value.toFixed(1)}${metric.unit}, ${isLow ? 'below' : 'above'
                } the optimal range of ${metric.idealMin}-${metric.idealMax}${metric.unit}. `;

            // Context about zone
            explanation += `This zone has ${zone.exposure} exposure`;
            if (zone.exposure === 'high') {
                explanation += ', which may be increasing evaporation. ';
            } else {
                explanation += '. ';
            }

            // Recommendation
            if (isLow) {
                explanation += isCritical
                    ? 'Immediate watering is recommended to prevent plant stress. '
                    : 'Consider checking the irrigation schedule or adjusting watering frequency. ';
            } else {
                explanation += 'Reduce watering frequency to prevent root rot. ';
            }
        } else if (metric.key === 'temperature') {
            explanation = `Temperature in ${zone.name} is currently ${value.toFixed(1)}${metric.unit}, ${isLow ? 'below' : 'above'
                } the optimal range of ${metric.idealMin}-${metric.idealMax}${metric.unit}. `;

            if (zone.garden.orientation !== 'interior') {
                explanation += `This ${zone.garden.orientation}-facing zone may be receiving ${isLow ? 'insufficient' : 'excessive'
                    } direct sunlight. `;
            }

            if (!isLow) {
                explanation += 'Consider adding shade or adjusting ventilation to cool the area. ';
            } else {
                explanation += 'Consider relocating heat-sensitive plants or improving insulation. ';
            }
        } else if (metric.key === 'humidity') {
            explanation = `Humidity in ${zone.name} is currently ${value.toFixed(1)}${metric.unit}, ${isLow ? 'below' : 'above'
                } the optimal range of ${metric.idealMin}-${metric.idealMax}${metric.unit}. `;

            if (isLow) {
                explanation += `Low humidity can stress ${zone.plantType}. Consider misting or adding a humidifier. `;
            } else {
                explanation += 'High humidity may promote fungal growth. Improve air circulation. ';
            }
        } else if (metric.key === 'light') {
            explanation = `Light levels in ${zone.name} are currently ${value.toFixed(0)}${metric.unit}, ${isLow ? 'below' : 'above'
                } the optimal range of ${metric.idealMin}-${metric.idealMax}${metric.unit}. `;

            if (isLow) {
                explanation += `${zone.plantType} may not be receiving adequate light for healthy growth. Consider supplemental lighting or relocating plants. `;
            } else {
                explanation += 'Excessive light may cause leaf burn. Add shade cloth or relocate sensitive plants. ';
            }
        }

        return explanation.trim();
    }

    private generateDurationExplanation(context: DurationContext): string {
        const { zone, metric, durationHours } = context;
        const formattedDuration = formatDuration(durationHours);
        const isLow = true; // Assuming we track sustained low values

        let explanation = '';

        if (metric.key === 'soil_moisture') {
            explanation = `Soil moisture in ${zone.name} has remained below optimal (${metric.idealMin}${metric.unit}) for ${formattedDuration}. `;
            explanation += `This sustained low moisture level may indicate an irrigation system malfunction or insufficient watering frequency for ${zone.plantType}. `;
            explanation += 'Recommend immediate inspection of the watering system and manual watering if necessary.';
        } else if (metric.key === 'temperature') {
            explanation = `Temperature in ${zone.name} has remained above optimal (${metric.idealMax}${metric.unit}) for ${formattedDuration}. `;
            explanation += `This ${zone.garden.orientation} zone may be receiving excessive direct sunlight or inadequate ventilation. `;
            explanation += 'Consider adding shade, improving air circulation, or relocating heat-sensitive plants.';
        } else if (metric.key === 'humidity') {
            explanation = `Humidity in ${zone.name} has been outside the optimal range for ${formattedDuration}. `;
            explanation += 'Prolonged humidity issues can stress plants and promote disease. ';
            explanation += 'Check ventilation systems and consider environmental controls.';
        } else if (metric.key === 'light') {
            explanation = `Light levels in ${zone.name} have been outside optimal range for ${formattedDuration}. `;
            explanation += `${zone.plantType} require consistent appropriate light levels for healthy growth. `;
            explanation += 'Review lighting schedules and equipment functionality.';
        }

        return explanation.trim();
    }

    private generateTrendExplanation(context: TrendContext): string {
        const { zone, metric, slope, projectedValue, hoursAhead } = context;

        let explanation = '';

        if (metric.key === 'soil_moisture') {
            explanation = `Soil moisture in ${zone.name} is trending downward at a rate of ${Math.abs(
                slope
            ).toFixed(2)}${metric.unit} per hour. `;
            explanation += `At this rate, moisture may reach ${projectedValue.toFixed(1)}${metric.unit
                } within ${hoursAhead} hours, potentially falling below critical levels. `;
            explanation += `This declining trend suggests the irrigation system may not be functioning properly for this zone's ${zone.plantType}. `;
            explanation += 'Recommend immediate inspection of the watering system to prevent plant stress.';
        } else if (metric.key === 'temperature') {
            const increasing = slope > 0;
            explanation = `Temperature in ${zone.name} is trending ${increasing ? 'upward' : 'downward'
                } at ${Math.abs(slope).toFixed(2)}${metric.unit} per hour. `;
            explanation += `This trend may indicate ${increasing ? 'increasing heat exposure' : 'cooling conditions'
                } that could affect plant health. `;
            explanation += 'Monitor closely and adjust environmental controls as needed.';
        } else {
            explanation = `${metric.description} in ${zone.name} is showing a concerning trend. `;
            explanation += 'Recommend monitoring this metric closely and investigating potential causes.';
        }

        return explanation.trim();
    }

    private generateSensorOfflineExplanation(context: SensorOfflineContext): string {
        const { zone, metric, durationMinutes } = context;

        let explanation = `No data received from ${zone.name} ${metric.description.toLowerCase()} sensor for ${durationMinutes} minutes. `;
        explanation +=
            'This may indicate a sensor malfunction, connectivity issue, or power problem. ';
        explanation += 'Check sensor status, connections, and power supply. ';

        if (durationMinutes > 60) {
            explanation += 'Extended sensor downtime requires immediate attention to ensure proper monitoring.';
        }

        return explanation.trim();
    }
}

export const explanationService = new ExplanationService();
