# System Architecture

## High-Level Architecture

```
┌─────────────────────────┐
│  Mock Data Engine       │  ← Simulates sensor readings
│  (Background Job)       │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Time-Series Data Store │  ← PostgreSQL with optimized indexes
│  (PostgreSQL)           │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Rules & Insights       │  ← Evaluates conditions, generates alerts
│  Engine                 │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  REST API               │  ← Express/Node.js or similar
│  (Backend Service)      │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Web Dashboard          │  ← React/Next.js frontend
│  (React)                │
└─────────────────────────┘
```

## Key Architectural Principles

### 1. Hardware-Agnostic Design
- System architecture does not depend on specific sensor hardware
- Data ingestion layer is abstracted and replaceable
- API contracts remain stable regardless of data source

### 2. Data-Driven UI
- Frontend renders based purely on API responses
- No hardcoded assumptions about installations or zones
- Dynamic configuration from backend

### 3. Mock Data Behaves Like Real Sensors
- Simulated data follows realistic patterns
- Temporal coherence (smooth transitions, no jumps)
- Biologically plausible ranges and behaviors

### 4. Frontend Unaware of Data Source
- Frontend cannot distinguish between mock and real data
- Same API contracts for both modes
- Seamless transition path to production

## Component Responsibilities

### Backend Responsibilities

#### 1. Domain Entity Management
- Store and manage installations, gardens, zones
- Maintain metric definitions and thresholds
- Handle entity relationships

#### 2. Time-Series Data Generation
- Execute mock data engine on schedule
- Write metric readings to database
- Maintain temporal consistency

#### 3. Rules Evaluation
- Continuously evaluate threshold rules
- Detect anomalies and trends
- Calculate confidence scores

#### 4. Insight Production
- Generate plain-English explanations
- Assign severity levels
- Store insight history

#### 5. API Service
- Expose RESTful endpoints
- Handle authentication (future)
- Implement pagination and filtering

### Frontend Responsibilities

#### 1. System Health Visualization
- Display overall status indicators
- Show zone-level health summaries
- Provide visual hierarchy of issues

#### 2. Live Metrics Display
- Render current values with context
- Show status colors (green/yellow/red)
- Update in real-time or near-real-time

#### 3. Trends and Charts
- Visualize historical data
- Overlay ideal ranges
- Highlight anomalies

#### 4. Insight Surfacing
- Present alerts in chronological order
- Format explanations for readability
- Filter by severity

## Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL (v14+)
- **ORM**: Prisma or TypeORM
- **Background Jobs**: node-cron or Bull

### Frontend
- **Framework**: React 18+ with Next.js 14+
- **State Management**: React Query + Context API
- **Charts**: Recharts or Chart.js
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui or custom

### DevOps
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Database**: Supabase or Neon
- **Monitoring**: Sentry (errors) + Vercel Analytics

## Data Flow

### 1. Mock Data Generation Flow
```
Background Job (every 1-5 min)
  → Read zone configurations from DB
  → Calculate next values based on time + previous state
  → Write MetricReading records
  → Trigger rules evaluation
```

### 2. Rules Evaluation Flow
```
New MetricReading inserted
  → Check against threshold rules
  → Check duration rules (query recent history)
  → Check trend rules (analyze time windows)
  → Generate Insight if rule triggered
```

### 3. Frontend Data Flow
```
User opens dashboard
  → Fetch installations
  → Fetch gardens for selected installation
  → Fetch zones for selected garden
  → Fetch latest readings for each zone
  → Fetch active insights
  → Poll for updates every 30-60 seconds
```

## Future Transition Plan

### Phase 1: Mock Data (Current)
- Mock data engine generates all readings
- Fully functional demo system
- No hardware dependencies

### Phase 2: Hybrid Mode
- Real sensor data ingestion service added
- Mock data engine runs for zones without sensors
- Same database schema and API

### Phase 3: Production Mode
- Mock data engine disabled
- Device ingestion service handles all data
- **No frontend changes required**
- Same API contracts maintained

### Transition Requirements
To ensure smooth transition:
1. All readings tagged with `source` field (mock | device)
2. API endpoints remain identical
3. Database schema supports both sources
4. Frontend never queries `source` field for logic

## Scalability Considerations

### Database Optimization
- Partitioning on `timestamp` for MetricReading table
- Indexes on `(zone_id, metric_key, timestamp)`
- Retention policies for old data (archive after 1 year)

### API Performance
- Response caching for static data (installations, zones)
- Pagination for time-series queries
- Aggregation at database level

### Real-Time Updates
- WebSocket support for live data (future)
- Server-Sent Events (SSE) as alternative
- Polling with smart intervals (current MVP)

## Security Considerations (Future)
- JWT-based authentication
- Role-based access control (RBAC)
- Installation-level data isolation
- API rate limiting
- HTTPS enforcement
