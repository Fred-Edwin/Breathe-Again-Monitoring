# Implementation Guide

## Overview

This guide provides a step-by-step roadmap for building **Breathe Again**, a biophilic systems monitoring platform. It references all other documentation files and provides a clear execution path for AI agents and developers.

---

## Prerequisites

### Required Knowledge
- TypeScript/JavaScript
- React/Next.js
- Node.js backend development
- PostgreSQL database design
- RESTful API design

### Development Environment
- Node.js v18+
- PostgreSQL v14+
- Git
- Code editor (VS Code recommended)

---

## Project Structure

```
breathe-again-monitoring/
├── docs/                          # Documentation
│   ├── PRD.md                     # Product requirements
│   ├── SYSTEM_ARCHITECTURE.md     # System design
│   ├── DATA_MODEL.md              # Database schema
│   ├── MOCK_DATA_ENGINE.md        # Simulation logic
│   ├── RULES_AND_INSIGHTS.md      # Alert generation
│   ├── API_CONTRACT.md            # API endpoints
│   ├── FRONTEND_UX.md             # UI/UX guidelines
│   └── IMPLEMENTATION_GUIDE.md    # This file
├── backend/                       # Backend service
│   ├── src/
│   │   ├── models/               # Database models
│   │   ├── services/             # Business logic
│   │   ├── routes/               # API routes
│   │   ├── jobs/                 # Background jobs
│   │   └── utils/                # Helpers
│   ├── prisma/                   # Database schema
│   └── package.json
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/           # UI components
│   │   ├── pages/                # Next.js pages
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Utilities
│   │   └── styles/               # CSS/Tailwind
│   └── package.json
└── README.md
```

---

## Implementation Phases

### Phase 1: Database & Backend Foundation (Week 1)

#### Step 1.1: Database Setup
**Reference:** `DATA_MODEL.md`

1. Install PostgreSQL and create database
2. Set up Prisma ORM
3. Define schema for all entities:
   - Installation
   - Garden
   - Zone
   - Metric
   - MetricReading
   - Insight

**Deliverable:** Working database with migrations

#### Step 1.2: Seed Initial Data
**Reference:** `DATA_MODEL.md` (Sample Data Structure)

1. Create seed script
2. Add 1 installation
3. Add 2 gardens
4. Add 4-6 zones per garden
5. Define 4 metrics (soil_moisture, temperature, humidity, light)

**Deliverable:** Database populated with test data

#### Step 1.3: Basic API Setup
**Reference:** `API_CONTRACT.md`

1. Set up Express.js or Fastify
2. Implement core endpoints:
   - GET /installations
   - GET /gardens
   - GET /zones
   - GET /metrics

**Deliverable:** API returning static data from database

---

### Phase 2: Mock Data Engine (Week 2)

#### Step 2.1: Background Job Infrastructure
**Reference:** `MOCK_DATA_ENGINE.md` (Execution Strategy)

1. Set up node-cron or Bull queue
2. Create job scheduler (runs every 5 minutes)
3. Implement state management (database-driven)

**Deliverable:** Scheduled job running successfully

#### Step 2.2: Implement Simulation Logic
**Reference:** `MOCK_DATA_ENGINE.md` (Simulation Behavior)

1. Implement daily cycle calculations:
   - Light intensity (sinusoidal)
   - Temperature (follows light with lag)
   - Humidity (inverse to temperature)
   - Soil moisture (linear decay with watering events)

2. Add zone-specific modifiers (exposure levels)
3. Implement slow trends (seasonal variation)

**Deliverable:** Realistic metric readings generated every 5 minutes

#### Step 2.3: Add Anomaly Generation
**Reference:** `MOCK_DATA_ENGINE.md` (Anomalies)

1. Implement rare event triggers (1-2% probability)
2. Add anomaly types:
   - Moisture not recovering
   - Flatlined sensor
   - Extended out-of-range

**Deliverable:** Occasional anomalies appearing in data

---

### Phase 3: Rules & Insights Engine (Week 3)

#### Step 3.1: Threshold Rules
**Reference:** `RULES_AND_INSIGHTS.md` (Threshold Rules)

1. Implement instant threshold checks
2. Generate insights when values out of range
3. Assign severity levels (warning/critical)

**Deliverable:** Insights created for out-of-range readings

#### Step 3.2: Duration Rules
**Reference:** `RULES_AND_INSIGHTS.md` (Duration Rules)

1. Implement sustained out-of-range detection
2. Add sensor offline detection (no data for X minutes)
3. Set appropriate thresholds (6h warning, 24h critical)

**Deliverable:** Insights for prolonged issues

#### Step 3.3: Trend Rules
**Reference:** `RULES_AND_INSIGHTS.md` (Trend Rules)

1. Implement downward trend detection (linear regression)
2. Add variance increase detection
3. Calculate confidence scores

**Deliverable:** Predictive insights for trends

#### Step 3.4: Context-Aware Explanations
**Reference:** `RULES_AND_INSIGHTS.md` (Context-Aware Explanations)

1. Create explanation templates
2. Inject zone characteristics (exposure, plant type)
3. Generate plain-English narratives

**Deliverable:** Human-readable insight explanations

---

### Phase 4: Complete API (Week 4)

#### Step 4.1: Time-Series Endpoints
**Reference:** `API_CONTRACT.md` (Readings)

1. Implement GET /readings with filtering
2. Add pagination (cursor-based)
3. Implement aggregation (5min, 1hour, 1day intervals)
4. Optimize queries with proper indexes

**Deliverable:** Fast time-series data retrieval

#### Step 4.2: Insights Endpoints
**Reference:** `API_CONTRACT.md` (Insights)

1. Implement GET /insights with filters
2. Add GET /insights/summary
3. Implement auto-resolution logic

**Deliverable:** Complete insights API

#### Step 4.3: Enhanced Endpoints
**Reference:** `API_CONTRACT.md`

1. Add nested data loading (gardens with zones)
2. Implement latest metrics calculation
3. Add health status aggregation

**Deliverable:** Rich API responses with computed fields

---

### Phase 5: Frontend Foundation (Week 5)

#### Step 5.1: Project Setup
**Reference:** `FRONTEND_UX.md`

1. Initialize Next.js project
2. Set up Tailwind CSS
3. Configure React Query for data fetching
4. Set up routing structure

**Deliverable:** Working Next.js app with routing

#### Step 5.2: Design System
**Reference:** `FRONTEND_UX.md` (Color Palette, Typography)

1. Define CSS variables for colors
2. Set up typography scale
3. Create base component library:
   - Button
   - Card
   - Badge (status indicators)
   - Loading states

**Deliverable:** Reusable component library

#### Step 5.3: API Integration Layer
**Reference:** `API_CONTRACT.md`

1. Create API client with axios/fetch
2. Implement React Query hooks:
   - useInstallations
   - useGardens
   - useZones
   - useReadings
   - useInsights

**Deliverable:** Type-safe API integration

---

### Phase 6: Core UI Pages (Week 6-7)

#### Step 6.1: Dashboard Overview
**Reference:** `FRONTEND_UX.md` (Dashboard Overview)

1. Create overall health indicator
2. Build zone status summary (counts)
3. Add recent insights feed
4. Implement auto-refresh (60s polling)

**Deliverable:** Functional dashboard page

#### Step 6.2: Live Metrics View
**Reference:** `FRONTEND_UX.md` (Live Metrics View)

1. Create metric card component
2. Add status color coding
3. Implement mini sparklines (recharts)
4. Show ideal range reference

**Deliverable:** Real-time metrics display

#### Step 6.3: Historical Charts
**Reference:** `FRONTEND_UX.md` (Historical Charts)

1. Implement time range selector
2. Build line charts with recharts
3. Add ideal range shading
4. Highlight anomalies
5. Add zoom/pan on desktop

**Deliverable:** Interactive historical charts

#### Step 6.4: Zone Detail Page
**Reference:** `FRONTEND_UX.md` (Zone Detail Page)

1. Create zone header component
2. Build metrics grid
3. Add tabbed chart interface
4. Display active insights list

**Deliverable:** Complete zone detail view

#### Step 6.5: Insights Feed
**Reference:** `FRONTEND_UX.md` (Alerts & Insights Feed)

1. Create timeline component
2. Implement severity filtering
3. Add expandable details
4. Show timestamps and explanations

**Deliverable:** Chronological insights feed

---

### Phase 7: Polish & Optimization (Week 8)

#### Step 7.1: Responsive Design
**Reference:** `FRONTEND_UX.md` (Mobile Behavior)

1. Test on mobile devices
2. Implement responsive breakpoints
3. Add touch-friendly interactions
4. Optimize for tablet view

**Deliverable:** Mobile-optimized UI

#### Step 7.2: Animations & Micro-Interactions
**Reference:** `FRONTEND_UX.md` (Animations)

1. Add card hover effects
2. Implement smooth transitions
3. Add loading skeletons
4. Pulse animation for data updates

**Deliverable:** Polished, animated UI

#### Step 7.3: Accessibility
**Reference:** `FRONTEND_UX.md` (Accessibility)

1. Add ARIA labels
2. Ensure keyboard navigation
3. Test with screen reader
4. Verify color contrast ratios

**Deliverable:** WCAG 2.1 AA compliant

#### Step 7.4: Performance Optimization
**Reference:** `FRONTEND_UX.md` (Performance Targets)

1. Code splitting
2. Image optimization
3. Bundle size reduction
4. Lighthouse audit (score > 90)

**Deliverable:** Fast, optimized application

---

## Testing Strategy

### Backend Testing
```bash
# Unit tests for simulation logic
npm test -- mock-data-engine.test.ts

# Integration tests for API
npm test -- api.integration.test.ts

# Rules engine tests
npm test -- rules-engine.test.ts
```

### Frontend Testing
```bash
# Component tests
npm test -- components/

# E2E tests with Playwright
npm run test:e2e
```

---

## Deployment

### Backend Deployment
**Recommended:** Railway or Render

1. Set up PostgreSQL database (Supabase/Neon)
2. Configure environment variables
3. Deploy backend service
4. Set up background job worker

### Frontend Deployment
**Recommended:** Vercel

1. Connect GitHub repository
2. Configure build settings
3. Set API URL environment variable
4. Deploy

---

## Demo Preparation Checklist

Before investor/stakeholder demos:

- [ ] Database has realistic data (multiple zones)
- [ ] Mock data engine running continuously
- [ ] At least 7 days of historical data
- [ ] 1-2 active warnings/insights visible
- [ ] All charts rendering smoothly
- [ ] Mobile view tested
- [ ] Auto-refresh working (60s interval)
- [ ] Explanations are clear and professional
- [ ] No console errors
- [ ] Fast page load times (< 3s)

---

## Transition to Production

**Reference:** `SYSTEM_ARCHITECTURE.md` (Future Transition Plan)

When ready to integrate real sensors:

1. Build device ingestion service
2. Keep mock data engine for zones without sensors
3. Tag all readings with `source` field
4. No frontend changes required
5. Gradually migrate zones from mock to real data

---

## Maintenance & Monitoring

### Database Maintenance
- Archive readings older than 1 year
- Delete resolved insights older than 6 months
- Monitor table sizes and indexes

### Application Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track background job execution
- Set up uptime monitoring

---

## Support Resources

- **PRD**: Product vision and requirements
- **SYSTEM_ARCHITECTURE**: Technical design decisions
- **DATA_MODEL**: Database schema reference
- **MOCK_DATA_ENGINE**: Simulation algorithms
- **RULES_AND_INSIGHTS**: Alert logic
- **API_CONTRACT**: Endpoint documentation
- **FRONTEND_UX**: Design guidelines

---

## Success Criteria

The MVP is complete when:

1. ✅ Dashboard shows live-updating metrics
2. ✅ Historical charts display 7+ days of data
3. ✅ Insights are generated automatically
4. ✅ Explanations are clear and actionable
5. ✅ Mobile experience is smooth
6. ✅ Demo can run unattended for 30+ minutes
7. ✅ Stakeholders understand system health in < 30 seconds
8. ✅ No technical jargon visible to users
