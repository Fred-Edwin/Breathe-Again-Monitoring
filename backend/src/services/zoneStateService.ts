// Zone state management for tracking watering times and anomalies

interface ZoneState {
    zoneId: string;
    lastWateringTime: Date;
    moistureTrend: 'stable' | 'declining' | 'recovering';
    anomalyActive: boolean;
    anomalyType?: 'flatline' | 'out_of_range' | 'no_recovery';
    anomalyStartTime?: Date;
    anomalyMetric?: string;
    anomalyValue?: number;
}

class ZoneStateService {
    private states: Map<string, ZoneState> = new Map();

    getZoneState(zoneId: string): ZoneState {
        if (!this.states.has(zoneId)) {
            // Initialize new zone state
            this.states.set(zoneId, {
                zoneId,
                lastWateringTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                moistureTrend: 'stable',
                anomalyActive: false,
            });
        }
        return this.states.get(zoneId)!;
    }

    updateZoneState(zoneId: string, updates: Partial<ZoneState>): void {
        const state = this.getZoneState(zoneId);
        Object.assign(state, updates);
    }

    resetAnomaly(zoneId: string): void {
        const state = this.getZoneState(zoneId);
        state.anomalyActive = false;
        state.anomalyType = undefined;
        state.anomalyStartTime = undefined;
        state.anomalyMetric = undefined;
        state.anomalyValue = undefined;
    }

    checkForAnomaly(zoneId: string): string | undefined {
        const state = this.getZoneState(zoneId);

        // If anomaly is active, check if it should end
        if (state.anomalyActive && state.anomalyStartTime) {
            const hoursSinceStart = (Date.now() - state.anomalyStartTime.getTime()) / (1000 * 60 * 60);

            // End anomaly based on type
            let shouldEnd = false;
            if (state.anomalyType === 'flatline' && hoursSinceStart > 4) {
                shouldEnd = true;
            } else if (state.anomalyType === 'out_of_range' && hoursSinceStart > 12) {
                shouldEnd = true;
            } else if (state.anomalyType === 'no_recovery' && hoursSinceStart > 24) {
                shouldEnd = true;
            }

            if (shouldEnd) {
                this.resetAnomaly(zoneId);
                return undefined;
            }

            return state.anomalyType;
        }

        // 5% chance of new anomaly (increased for better visibility)
        if (Math.random() < 0.05) {
            const rand = Math.random();
            let type: 'flatline' | 'out_of_range' | 'no_recovery';

            if (rand < 0.1) {
                type = 'flatline';
            } else if (rand < 0.75) {
                type = 'out_of_range';
            } else {
                type = 'no_recovery';
            }

            state.anomalyActive = true;
            state.anomalyType = type;
            state.anomalyStartTime = new Date();

            return type;
        }

        return undefined;
    }

    triggerWatering(zoneId: string): void {
        const state = this.getZoneState(zoneId);
        state.lastWateringTime = new Date();
        state.moistureTrend = 'recovering';
    }

    getHoursSinceWatering(zoneId: string): number {
        const state = this.getZoneState(zoneId);
        return (Date.now() - state.lastWateringTime.getTime()) / (1000 * 60 * 60);
    }
}

// Singleton instance
export const zoneStateService = new ZoneStateService();
