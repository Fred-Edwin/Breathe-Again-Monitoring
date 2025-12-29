# Rules and Insights Engine

## Overview

The Rules and Insights Engine continuously evaluates environmental data to detect issues, identify trends, and generate plain-English explanations for users.

**Core Principle:** All insights must be **explainable** and **actionable**. No black-box predictions in MVP.

---

## Rule Types

### 1. Threshold Rules

Detect when a metric exceeds safe operating ranges.

#### Out of Range (Instant)
```typescript
interface ThresholdRule {
  metric: string;
  idealMin: number;
  idealMax: number;
  severity: 'warning' | 'critical';
}

function evaluateThreshold(reading: MetricReading, metric: Metric): Insight | null {
  if (reading.value < metric.ideal_min) {
    return {
      severity: 'warning',
      explanation: `${metric.key} is below optimal range (${reading.value}${metric.unit} < ${metric.ideal_min}${metric.unit})`,
      confidence: 1.0
    };
  }
  
  if (reading.value > metric.ideal_max) {
    return {
      severity: 'warning',
      explanation: `${metric.key} is above optimal range (${reading.value}${metric.unit} > ${metric.ideal_max}${metric.unit})`,
      confidence: 1.0
    };
  }
  
  return null; // Within range
}
```

**Examples:**
- Soil moisture at 28% (below 30% ideal minimum) → **Warning**
- Temperature at 29°C (above 26°C ideal maximum) → **Warning**

---

### 2. Duration Rules

Detect when conditions persist for too long.

#### Sustained Out-of-Range
```typescript
async function evaluateDuration(
  zoneId: string,
  metricKey: string,
  thresholdHours: number
): Promise<Insight | null> {
  const cutoff = new Date(Date.now() - thresholdHours * 60 * 60 * 1000);
  
  const readings = await db.metricReadings.findMany({
    where: {
      zone_id: zoneId,
      metric_key: metricKey,
      timestamp: { gte: cutoff }
    },
    orderBy: { timestamp: 'asc' }
  });
  
  const metric = await db.metrics.findUnique({ where: { key: metricKey } });
  const allOutOfRange = readings.every(r => 
    r.value < metric.ideal_min || r.value > metric.ideal_max
  );
  
  if (allOutOfRange && readings.length >= thresholdHours / (5/60)) {
    return {
      severity: 'critical',
      explanation: `${metricKey} has remained outside optimal range for ${thresholdHours} hours. Immediate attention recommended.`,
      confidence: 0.95
    };
  }
  
  return null;
}
```

**Thresholds:**
- **Warning**: Out of range for > 6 hours
- **Critical**: Out of range for > 24 hours

**Examples:**
- Soil moisture below 30% for 48 hours → **Critical**
- Temperature above 26°C for 8 hours → **Warning**

#### No Data Received
```typescript
async function evaluateDataFreshness(
  zoneId: string,
  metricKey: string,
  maxAgeMinutes: number
): Promise<Insight | null> {
  const lastReading = await db.metricReadings.findFirst({
    where: { zone_id: zoneId, metric_key: metricKey },
    orderBy: { timestamp: 'desc' }
  });
  
  if (!lastReading) {
    return {
      severity: 'critical',
      explanation: `No ${metricKey} data has ever been received for this zone. Sensor may not be configured.`,
      confidence: 1.0
    };
  }
  
  const ageMinutes = (Date.now() - lastReading.timestamp.getTime()) / 60000;
  
  if (ageMinutes > maxAgeMinutes) {
    return {
      severity: 'warning',
      explanation: `No ${metricKey} data received for ${Math.round(ageMinutes)} minutes. Sensor may be offline.`,
      confidence: 0.9
    };
  }
  
  return null;
}
```

**Thresholds:**
- **Warning**: No data for > 15 minutes (3x expected interval)
- **Critical**: No data for > 60 minutes

---

### 3. Trend Rules

Detect patterns over time that indicate degradation or improvement.

#### Downward Trend
```typescript
async function evaluateDownwardTrend(
  zoneId: string,
  metricKey: string,
  windowDays: number
): Promise<Insight | null> {
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  
  const readings = await db.metricReadings.findMany({
    where: {
      zone_id: zoneId,
      metric_key: metricKey,
      timestamp: { gte: cutoff }
    },
    orderBy: { timestamp: 'asc' }
  });
  
  if (readings.length < 10) return null; // Insufficient data
  
  // Simple linear regression
  const slope = calculateSlope(readings.map(r => ({
    x: r.timestamp.getTime(),
    y: r.value
  })));
  
  const metric = await db.metrics.findUnique({ where: { key: metricKey } });
  const isDecreasing = slope < -0.1; // Threshold for "significant" decline
  
  if (isDecreasing && readings[readings.length - 1].value < metric.ideal_min) {
    return {
      severity: 'warning',
      explanation: `${metricKey} has been trending downward over the past ${windowDays} days and is now below optimal. This may indicate a systemic issue.`,
      confidence: 0.75
    };
  }
  
  return null;
}
```

**Examples:**
- Soil moisture declining 0.5%/day for 7 days → **Warning**
- Average temperature decreasing 0.3°C/day for 5 days → **Info**

#### Increasing Variance
```typescript
async function evaluateVariance(
  zoneId: string,
  metricKey: string,
  windowDays: number
): Promise<Insight | null> {
  const readings = await getReadingsInWindow(zoneId, metricKey, windowDays);
  
  const variance = calculateVariance(readings.map(r => r.value));
  const historicalVariance = await getHistoricalVariance(zoneId, metricKey);
  
  if (variance > historicalVariance * 2) {
    return {
      severity: 'info',
      explanation: `${metricKey} readings are more variable than usual. This may indicate environmental instability or sensor issues.`,
      confidence: 0.6
    };
  }
  
  return null;
}
```

---

## Insight Generation

### Insight Structure

```typescript
interface Insight {
  id: string;
  zone_id: string;
  metric_key: string;
  severity: 'info' | 'warning' | 'critical';
  explanation: string;
  confidence: number; // 0.0 - 1.0
  created_at: Date;
  resolved_at: Date | null;
}
```

### Severity Levels

| Severity  | Color  | Meaning                                  | User Action                  |
|-----------|--------|------------------------------------------|------------------------------|
| info      | Blue   | Informational, no action needed          | Awareness only               |
| warning   | Yellow | Attention recommended, not urgent        | Review within 24 hours       |
| critical  | Red    | Immediate attention required             | Investigate immediately      |

### Confidence Scores

| Confidence | Interpretation                                    |
|------------|---------------------------------------------------|
| 1.0        | Definitive (e.g., value exceeds threshold)        |
| 0.9        | Very likely (e.g., sensor offline)                |
| 0.75       | Probable (e.g., trend detected)                   |
| 0.6        | Possible (e.g., variance increase)                |
| < 0.5      | Uncertain (not used in MVP)                       |

---

## Context-Aware Explanations

Insights should reference **zone characteristics** to provide context:

### Template Examples

#### Low Moisture + High Exposure
```
"Soil moisture in {zone_name} has remained below optimal for {duration}. 
This zone has {exposure} exposure, which may be increasing evaporation. 
Consider checking irrigation schedule or adjusting watering frequency."
```

#### High Temperature + South Orientation
```
"Temperature in {zone_name} has exceeded 28°C for {duration}. 
This {orientation}-facing garden receives direct sunlight during peak hours. 
Ensure adequate ventilation or consider shade adjustments."
```

#### Sensor Offline
```
"No {metric} data received from {zone_name} for {duration}. 
Sensor may be offline or experiencing connectivity issues. 
Please verify sensor status and connections."
```

### Implementation

```typescript
function generateExplanation(
  rule: Rule,
  zone: Zone,
  metric: Metric,
  context: any
): string {
  const templates = {
    low_moisture_high_exposure: `Soil moisture in ${zone.name} has remained below optimal for ${context.duration}. This zone has ${zone.exposure} exposure, which may be increasing evaporation. Consider checking irrigation schedule.`,
    
    high_temp_south: `Temperature in ${zone.name} has exceeded ${metric.ideal_max}°C for ${context.duration}. This ${zone.garden.orientation}-facing garden receives direct sunlight. Ensure adequate ventilation.`,
    
    sensor_offline: `No ${metric.key} data received from ${zone.name} for ${context.duration}. Sensor may be offline. Please verify sensor status.`
  };
  
  return templates[rule.template] || rule.defaultExplanation;
}
```

---

## Rule Execution Schedule

### Continuous Evaluation
```typescript
// Run after each new reading batch
async function evaluateAllRules() {
  const zones = await db.zones.findAll();
  
  for (const zone of zones) {
    // Threshold rules (instant)
    await evaluateThresholdRules(zone.id);
    
    // Duration rules (every 15 minutes)
    if (shouldRunDurationRules()) {
      await evaluateDurationRules(zone.id);
    }
    
    // Trend rules (every 6 hours)
    if (shouldRunTrendRules()) {
      await evaluateTrendRules(zone.id);
    }
  }
}

// Trigger after mock data generation
mockDataEngine.on('complete', evaluateAllRules);
```

### Deduplication
```typescript
async function createInsightIfNew(insight: Insight): Promise<void> {
  // Check if similar insight already exists
  const existing = await db.insights.findFirst({
    where: {
      zone_id: insight.zone_id,
      metric_key: insight.metric_key,
      severity: insight.severity,
      resolved_at: null,
      created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
  });
  
  if (!existing) {
    await db.insights.create({ data: insight });
  }
}
```

---

## Auto-Resolution

Insights should automatically resolve when conditions improve:

```typescript
async function autoResolveInsights() {
  const activeInsights = await db.insights.findMany({
    where: { resolved_at: null }
  });
  
  for (const insight of activeInsights) {
    const isResolved = await checkResolutionCondition(insight);
    
    if (isResolved) {
      await db.insights.update({
        where: { id: insight.id },
        data: { resolved_at: new Date() }
      });
    }
  }
}

async function checkResolutionCondition(insight: Insight): boolean {
  const latestReading = await getLatestReading(insight.zone_id, insight.metric_key);
  const metric = await db.metrics.findUnique({ where: { key: insight.metric_key } });
  
  // Resolved if back in range for 1 hour
  const recentReadings = await getReadingsInLastHour(insight.zone_id, insight.metric_key);
  const allInRange = recentReadings.every(r => 
    r.value >= metric.ideal_min && r.value <= metric.ideal_max
  );
  
  return allInRange;
}
```

---

## Testing Rules

### Unit Tests
```typescript
describe('Threshold Rules', () => {
  it('should trigger warning when moisture below minimum', async () => {
    const reading = { value: 28, metric_key: 'soil_moisture' };
    const metric = { ideal_min: 30, ideal_max: 45 };
    
    const insight = evaluateThreshold(reading, metric);
    
    expect(insight).not.toBeNull();
    expect(insight.severity).toBe('warning');
  });
});
```

### Integration Tests
```typescript
describe('Rules Engine', () => {
  it('should generate insight for sustained low moisture', async () => {
    // Seed 48 hours of low moisture readings
    await seedLowMoistureReadings('zone-001', 48);
    
    // Run rules engine
    await evaluateAllRules();
    
    // Check for critical insight
    const insights = await db.insights.findMany({
      where: { zone_id: 'zone-001', severity: 'critical' }
    });
    
    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0].explanation).toContain('48 hours');
  });
});
```

---

## Future Enhancements

1. **User-Defined Rules**: Allow users to configure custom thresholds
2. **Predictive Insights**: "Moisture will drop below optimal in 6 hours"
3. **Correlation Detection**: "Low moisture coincides with HVAC schedule"
4. **Seasonal Adjustments**: Different thresholds for summer vs. winter
