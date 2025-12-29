# Mock Data Engine

## Purpose

Simulate a realistic network of environmental sensors for vertical gardens to create a convincing demo system that behaves like real deployed hardware.

## Design Principles

### 1. Continuous Generation (Not One-Time Seeding)
- Background job runs on schedule (every 1-5 minutes)
- Generates new readings based on current time and previous state
- Maintains temporal continuity across restarts

### 2. Biologically Plausible Ranges
- Values stay within realistic bounds for plant health
- Follows known environmental patterns
- Respects physical constraints (e.g., moisture can't exceed 100%)

### 3. Temporal Coherence
- No random jumps between readings
- Smooth transitions using interpolation
- State carries forward from previous reading

### 4. Config-Driven Behavior
- Zone characteristics affect simulation
- Exposure levels modify evaporation rates
- Garden orientation influences light patterns

---

## Metrics & Ranges

| Metric         | Unit | Realistic Range | Ideal Range | Notes                                    |
|----------------|------|-----------------|-------------|------------------------------------------|
| Soil Moisture  | %    | 20 – 50         | 30 – 45     | Below 25% triggers stress                |
| Temperature    | °C   | 16 – 32         | 18 – 26     | Follows outdoor temp with lag            |
| Humidity       | %    | 35 – 80         | 45 – 70     | Inversely correlated with temperature    |
| Light          | lux  | 200 – 4000      | 800 – 2500  | Peaks mid-day, zero at night             |

---

## Simulation Behavior

### 1. Daily Cycles

All metrics follow **sinusoidal variation** based on time of day:

#### Light Intensity
```typescript
function calculateLight(hour: number, baseLight: number): number {
  // Peak at 13:00 (1 PM), minimum at 01:00 (1 AM)
  const peakHour = 13;
  const amplitude = baseLight * 0.8;
  const offset = baseLight * 0.2;
  
  const radians = ((hour - peakHour) / 12) * Math.PI;
  return offset + amplitude * Math.cos(radians);
}
```

**Pattern:**
- 06:00 - 08:00: Sunrise (rapid increase)
- 12:00 - 14:00: Peak intensity
- 18:00 - 20:00: Sunset (rapid decrease)
- 22:00 - 05:00: Night (near zero)

#### Temperature
```typescript
function calculateTemperature(hour: number, baseTemp: number): number {
  // Follows light with 2-hour lag
  const peakHour = 15;
  const amplitude = 4; // ±4°C daily variation
  
  const radians = ((hour - peakHour) / 12) * Math.PI;
  return baseTemp + amplitude * Math.cos(radians);
}
```

**Pattern:**
- Lags behind light by ~2 hours
- Minimum at ~05:00
- Maximum at ~15:00

#### Humidity
```typescript
function calculateHumidity(temperature: number, baseHumidity: number): number {
  // Inversely proportional to temperature
  const tempDelta = temperature - 22; // 22°C is baseline
  const humidityChange = tempDelta * -2; // -2% per degree
  
  return Math.max(35, Math.min(80, baseHumidity + humidityChange));
}
```

**Pattern:**
- High in early morning (cool, moist)
- Low in afternoon (warm, dry)
- Recovers in evening

#### Soil Moisture
```typescript
function calculateMoisture(
  currentMoisture: number,
  exposure: 'low' | 'medium' | 'high',
  hoursSinceWatering: number
): number {
  // Evaporation rates by exposure
  const evaporationRates = {
    low: 0.3,    // %/hour
    medium: 0.5,
    high: 0.8
  };
  
  const rate = evaporationRates[exposure];
  const loss = rate * hoursSinceWatering;
  
  return Math.max(20, currentMoisture - loss);
}
```

**Pattern:**
- Decreases linearly between watering events
- Watering events occur when moisture < 32%
- Jumps to 42-45% after watering
- Rate depends on zone exposure

---

### 2. Slow Trends

Overlay **gradual drift** over days/weeks to simulate seasonal changes:

```typescript
function applySeasonalTrend(baseValue: number, dayOfYear: number): number {
  // Simulate seasonal variation (e.g., summer warmer, winter cooler)
  const seasonalAmplitude = baseValue * 0.1; // ±10%
  const radians = (dayOfYear / 365) * 2 * Math.PI;
  
  return baseValue + seasonalAmplitude * Math.sin(radians);
}
```

**Examples:**
- Temperature: +2°C in summer months, -2°C in winter
- Humidity: Drier in hot season
- Light: Longer days in summer (shift peak times)

---

### 3. Zone Differences

Each zone has unique characteristics affecting simulation:

```typescript
interface ZoneConfig {
  id: string;
  exposure: 'low' | 'medium' | 'high';
  baseTemperature: number;  // Offset from ambient
  baseHumidity: number;     // Baseline %
  baseLightMultiplier: number; // 0.5 - 1.5
}

// Example zones
const zones = [
  {
    id: 'zone-a',
    exposure: 'high',
    baseTemperature: 23,
    baseHumidity: 55,
    baseLightMultiplier: 1.2 // Gets more light
  },
  {
    id: 'zone-b',
    exposure: 'low',
    baseTemperature: 21,
    baseHumidity: 65,
    baseLightMultiplier: 0.7 // Shadier
  }
];
```

**Effects:**
- **High exposure**: Faster moisture loss, higher light, warmer
- **Low exposure**: Slower moisture loss, lower light, cooler
- **Medium exposure**: Balanced characteristics

---

### 4. Anomalies (Rare Events)

Introduce occasional issues to demonstrate system capabilities:

#### Moisture Not Recovering
```typescript
// Simulate irrigation failure
if (Math.random() < 0.01) { // 1% chance per day
  // Skip next watering event
  skipNextWatering = true;
  // Moisture continues declining
}
```

**Result:** Moisture drops below 25%, triggers critical alert

#### Flatlined Sensor
```typescript
// Simulate sensor malfunction
if (Math.random() < 0.005) { // 0.5% chance per day
  // Return same value for 6+ hours
  return previousReading.value;
}
```

**Result:** No variance detected, triggers "sensor offline" insight

#### Extended Out-of-Range
```typescript
// Simulate environmental stress
if (Math.random() < 0.02) { // 2% chance per day
  // Temperature spike (e.g., HVAC failure)
  temperature += 8; // +8°C for 4-6 hours
}
```

**Result:** Temperature > 26°C for extended period, triggers warning

---

## Execution Strategy

### Background Job Architecture

```typescript
// Pseudo-code for background job
async function runMockDataEngine() {
  const zones = await db.zones.findAll({ include: 'garden' });
  const now = new Date();
  
  for (const zone of zones) {
    // Get last reading for each metric
    const lastReadings = await getLastReadings(zone.id);
    
    // Calculate new values
    const newReadings = {
      soil_moisture: calculateNextMoisture(zone, lastReadings.soil_moisture, now),
      temperature: calculateNextTemperature(zone, now),
      humidity: calculateNextHumidity(zone, now),
      light: calculateNextLight(zone, now)
    };
    
    // Insert new readings
    await db.metricReadings.createMany(
      Object.entries(newReadings).map(([metric, value]) => ({
        zone_id: zone.id,
        metric_key: metric,
        value,
        timestamp: now,
        source: 'mock'
      }))
    );
  }
  
  console.log(`Generated readings for ${zones.length} zones at ${now}`);
}

// Schedule execution
cron.schedule('*/5 * * * *', runMockDataEngine); // Every 5 minutes
```

### State Management

**Option 1: Database-Driven (Recommended)**
```typescript
// Read previous state from database
const lastReading = await db.metricReadings.findFirst({
  where: { zone_id, metric_key },
  orderBy: { timestamp: 'desc' }
});

const nextValue = calculateNext(lastReading.value, now);
```

**Option 2: In-Memory State**
```typescript
// Store state in memory (lost on restart)
const zoneStates = new Map<string, ZoneState>();

function getOrInitState(zoneId: string): ZoneState {
  if (!zoneStates.has(zoneId)) {
    zoneStates.set(zoneId, initializeState(zoneId));
  }
  return zoneStates.get(zoneId);
}
```

**Recommendation:** Use database-driven approach for persistence across restarts.

---

## Configuration Example

```json
{
  "mockDataEngine": {
    "enabled": true,
    "intervalMinutes": 5,
    "anomalyProbability": 0.01,
    "zones": [
      {
        "id": "zone-001",
        "exposure": "medium",
        "baseTemperature": 22,
        "baseHumidity": 60,
        "baseLightMultiplier": 1.0,
        "wateringSchedule": {
          "enabled": true,
          "triggerThreshold": 32,
          "targetMoisture": 43
        }
      }
    ]
  }
}
```

---

## Testing the Engine

### Validation Checklist

- [ ] Values stay within realistic ranges
- [ ] Daily cycles are smooth and predictable
- [ ] Zone differences are observable
- [ ] Anomalies occur but are rare
- [ ] Moisture decreases over time
- [ ] Watering events restore moisture
- [ ] Light is zero at night
- [ ] Temperature lags behind light
- [ ] Humidity inversely correlates with temperature

### Manual Testing

```bash
# Run engine once manually
npm run mock-data:generate

# Check generated readings
psql -d biophilic_db -c "
  SELECT zone_id, metric_key, value, timestamp 
  FROM metric_reading 
  WHERE source = 'mock' 
  ORDER BY timestamp DESC 
  LIMIT 20;
"

# Verify daily patterns (24 hours of data)
npm run mock-data:analyze-patterns
```

---

## Future Enhancements

1. **Weather API Integration**: Use real weather data to influence indoor conditions
2. **Event Simulation**: Scheduled events (e.g., "simulate HVAC failure on Tuesday")
3. **Machine Learning**: Learn from real sensor data to improve simulation accuracy
4. **Multi-Garden Correlation**: Gardens in same building share ambient conditions
