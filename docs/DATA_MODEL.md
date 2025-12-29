# Data Model

## Entity Relationship Overview

```
Installation (1) ──< (N) Garden (1) ──< (N) Zone (1) ──< (N) MetricReading
                                                    │
                                                    └──< (N) Insight
```

## Core Entities

### 1. Installation

Represents a real-world site or building with biophilic systems.

**Schema:**
```typescript
{
  id: UUID (PK)
  name: String (required)
  location: String (required)
  status: Enum ['active', 'inactive', 'maintenance']
  created_at: Timestamp
  updated_at: Timestamp
}
```

**Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Nairobi Green Tower",
  "location": "Westlands, Nairobi",
  "status": "active",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**Business Rules:**
- One installation can have multiple gardens
- Status affects whether data is actively generated
- Location is free-text for MVP (structured address in future)

---

### 2. Garden

A biophilic system installation (e.g., vertical garden wall).

**Schema:**
```typescript
{
  id: UUID (PK)
  installation_id: UUID (FK → Installation)
  name: String (required)
  type: Enum ['vertical_garden', 'green_roof', 'living_wall']
  orientation: Enum ['north', 'south', 'east', 'west', 'interior']
  size: JSON { width: Number, height: Number, unit: 'meters' }
  created_at: Timestamp
  updated_at: Timestamp
}
```

**Example:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "installation_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Lobby Vertical Garden",
  "type": "vertical_garden",
  "orientation": "interior",
  "size": { "width": 6, "height": 4, "unit": "meters" }
}
```

**Business Rules:**
- Type determines default metric expectations
- Orientation affects light exposure simulation
- Size is informational (not used in calculations for MVP)

---

### 3. Zone

A subsection of a garden with specific plant types and characteristics.

**Schema:**
```typescript
{
  id: UUID (PK)
  garden_id: UUID (FK → Garden)
  name: String (required)
  plant_type: String (required)
  exposure: Enum ['low', 'medium', 'high']
  created_at: Timestamp
  updated_at: Timestamp
}
```

**Example:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "garden_id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Zone A - Upper Left",
  "plant_type": "Ferns & Philodendrons",
  "exposure": "medium"
}
```

**Business Rules:**
- Exposure affects evaporation rates in mock data
- Plant type is informational (used in insights)
- Each zone has independent metric readings

---

### 4. Metric

Defines what environmental parameters are measured.

**Schema:**
```typescript
{
  key: String (PK) ['soil_moisture', 'temperature', 'humidity', 'light']
  unit: String (required) ['%', '°C', 'lux']
  ideal_min: Number (required)
  ideal_max: Number (required)
  description: String (required)
  created_at: Timestamp
}
```

**Predefined Metrics:**

| Key            | Unit | Ideal Min | Ideal Max | Description                          |
|----------------|------|-----------|-----------|--------------------------------------|
| soil_moisture  | %    | 30        | 45        | Volumetric water content in soil     |
| temperature    | °C   | 18        | 26        | Ambient air temperature              |
| humidity       | %    | 45        | 70        | Relative humidity                    |
| light          | lux  | 800       | 2500      | Light intensity (PAR approximation)  |

**Business Rules:**
- Metrics are system-wide (not per-zone)
- Ideal ranges used for threshold rules
- Additional metrics can be added without schema changes

---

### 5. MetricReading (Time-Series)

**Primary data table** storing all sensor measurements.

**Schema:**
```typescript
{
  id: UUID (PK)
  zone_id: UUID (FK → Zone, required)
  metric_key: String (FK → Metric, required)
  value: Decimal (required)
  timestamp: Timestamp (required, indexed)
  source: Enum ['mock', 'device'] (required)
  created_at: Timestamp
}
```

**Indexes:**
```sql
CREATE INDEX idx_readings_zone_metric_time 
  ON metric_reading (zone_id, metric_key, timestamp DESC);

CREATE INDEX idx_readings_timestamp 
  ON metric_reading (timestamp DESC);
```

**Example:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "zone_id": "770e8400-e29b-41d4-a716-446655440002",
  "metric_key": "soil_moisture",
  "value": 38.5,
  "timestamp": "2024-12-29T00:00:00Z",
  "source": "mock"
}
```

**Business Rules:**
- Readings are immutable (never updated, only inserted)
- Timestamp must be in UTC
- Source field enables hybrid mock/real data mode
- Retention: Keep 1 year, then archive

**Query Patterns:**
```sql
-- Latest reading for a zone + metric
SELECT * FROM metric_reading
WHERE zone_id = ? AND metric_key = ?
ORDER BY timestamp DESC
LIMIT 1;

-- Readings in time range
SELECT * FROM metric_reading
WHERE zone_id = ? 
  AND metric_key = ?
  AND timestamp BETWEEN ? AND ?
ORDER BY timestamp ASC;
```

---

### 6. Insight

Generated interpretations and alerts based on rules evaluation.

**Schema:**
```typescript
{
  id: UUID (PK)
  zone_id: UUID (FK → Zone, nullable)
  metric_key: String (FK → Metric, nullable)
  severity: Enum ['info', 'warning', 'critical']
  explanation: Text (required)
  confidence: Decimal (0.0 - 1.0, required)
  created_at: Timestamp
  resolved_at: Timestamp (nullable)
}
```

**Example:**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "zone_id": "770e8400-e29b-41d4-a716-446655440002",
  "metric_key": "soil_moisture",
  "severity": "warning",
  "explanation": "Soil moisture in Zone A has remained below optimal (30%) for 48 hours. This zone has medium exposure, which may be increasing evaporation. Consider checking irrigation schedule.",
  "confidence": 0.85,
  "created_at": "2024-12-29T00:00:00Z",
  "resolved_at": null
}
```

**Business Rules:**
- Insights can be zone-specific or garden-wide (zone_id nullable)
- Confidence reflects rule certainty (1.0 = definitive, 0.5 = uncertain)
- Resolved insights have `resolved_at` timestamp
- Explanations must be plain English, no codes

**Severity Levels:**
- **info**: Informational, no action needed
- **warning**: Attention recommended, not urgent
- **critical**: Immediate attention required

---

## Relationships Summary

```sql
Installation (1) ──< (N) Garden
Garden (1) ──< (N) Zone
Zone (1) ──< (N) MetricReading
Zone (1) ──< (N) Insight
Metric (1) ──< (N) MetricReading
Metric (1) ──< (N) Insight
```

## Data Retention Policy

| Table          | Retention | Archive Strategy                    |
|----------------|-----------|-------------------------------------|
| Installation   | Permanent | N/A                                 |
| Garden         | Permanent | Soft delete on decommission         |
| Zone           | Permanent | Soft delete on reconfiguration      |
| Metric         | Permanent | N/A                                 |
| MetricReading  | 1 year    | Move to cold storage after 1 year   |
| Insight        | 6 months  | Delete resolved insights after 6mo  |

## Sample Data Structure

```json
{
  "installation": {
    "id": "inst-001",
    "name": "Nairobi Green Tower",
    "gardens": [
      {
        "id": "garden-001",
        "name": "Lobby Vertical Garden",
        "zones": [
          {
            "id": "zone-001",
            "name": "Zone A - Upper Left",
            "latest_readings": {
              "soil_moisture": { "value": 38.5, "timestamp": "2024-12-29T00:00:00Z" },
              "temperature": { "value": 22.3, "timestamp": "2024-12-29T00:00:00Z" }
            },
            "active_insights": [
              {
                "severity": "warning",
                "explanation": "Soil moisture trending downward..."
              }
            ]
          }
        ]
      }
    ]
  }
}
```
