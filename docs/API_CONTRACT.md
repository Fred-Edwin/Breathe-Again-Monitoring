# API Contract

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.biophilic-monitor.com/api
```

## Authentication
**MVP**: No authentication required  
**Future**: JWT Bearer tokens

---

## Core Endpoints

### 1. Installations

#### GET /installations
Retrieve all installations.

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Nairobi Green Tower",
      "location": "Westlands, Nairobi",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z",
      "garden_count": 2
    }
  ],
  "meta": { "total": 1 }
}
```

#### GET /installations/:id
Retrieve a specific installation with gardens.

---

### 2. Gardens

#### GET /gardens
**Query Parameters:** `installation_id` (optional)

#### GET /gardens/:id
Retrieve garden with zones and latest metrics.

---

### 3. Zones

#### GET /zones
**Query Parameters:** `garden_id` (optional)

#### GET /zones/:id
Retrieve zone with latest metrics and active insights.

---

### 4. Metrics

#### GET /metrics
Retrieve all available metrics with definitions.

---

### 5. Readings (Time-Series)

#### GET /readings
**Query Parameters:**
- `zone_id` (required)
- `metric` (required)
- `from`, `to` (optional ISO timestamps)
- `interval` (optional: `raw`, `5min`, `1hour`, `1day`)
- `limit` (optional, max 1000)

---

### 6. Insights

#### GET /insights
**Query Parameters:**
- `zone_id`, `garden_id` (optional)
- `severity` (optional: `info`, `warning`, `critical`)
- `resolved` (optional: `true`, `false`)

#### GET /insights/summary
Get aggregated insight counts by severity.

---

## Response Format

### Success
```json
{
  "data": {},
  "meta": {}
}
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid parameters"
  }
}
```

## Timestamps
All timestamps in ISO 8601 UTC format: `2024-12-29T00:00:00Z`
