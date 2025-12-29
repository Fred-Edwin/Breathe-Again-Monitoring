# Breathe Again: Biophilic Systems Monitoring Platform

> **Status:** Backend Complete ✅ | Frontend Ready to Build

A real-time monitoring platform for vertical gardens and biophilic installations, featuring intelligent alert generation and beautiful data visualization.

---

## 🎯 Project Overview

**Breathe Again** monitors environmental conditions in biophilic systems (vertical gardens, green walls, living installations) to ensure optimal plant health. The platform uses simulated sensor data to demonstrate full functionality, with a clear path to real sensor integration.

**Target Users:** Facility managers, building operators, sustainability teams

---

## ✅ What's Complete

### Backend (100%)

**Phase 1: Database & API**
- PostgreSQL database on Supabase
- Prisma ORM with 6 entities
- RESTful API with 4 core endpoints
- 11,520 initial seed readings (24 hours of data)

**Phase 2: Mock Data Engine**
- Background job running every 5 minutes
- Realistic simulation algorithms for 4 metrics:
  - Light (sinusoidal sun cycle)
  - Temperature (follows light with lag)
  - Humidity (inverse to temperature)
  - Soil moisture (decay with watering events)
- Zone-specific modifiers (exposure levels)
- Anomaly generation (1.5% probability)

**Phase 3: Rules & Insights Engine**
- 4 rule types: Threshold, Duration, Trend, Sensor Offline
- Plain-English explanations with zone context
- Auto-resolution when conditions normalize
- Confidence scoring (0.6-1.0)

**Tech Stack:**
- Node.js + Express.js
- TypeScript
- Prisma ORM
- Supabase (PostgreSQL)
- node-cron

---

## 📊 Current Data

**Installation:** Nairobi Green Tower  
**Gardens:** 2 (Lobby Vertical Garden, Rooftop Garden)  
**Zones:** 10 active monitoring zones  
**Metrics:** 4 (soil moisture, temperature, humidity, light)  
**Readings:** ~11,520+ (continuously growing)  
**Insights:** Generated automatically based on conditions

---

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
npm run db:push    # Push schema to Supabase
npm run db:seed    # Seed initial data
npm run dev        # Start server on port 3001
```

**Server:** http://localhost:3001  
**API Docs:** See `backend/README.md`

### API Endpoints

```
GET /api/installations  # All installations
GET /api/gardens        # All gardens
GET /api/zones          # All zones with latest readings
GET /api/zones/:id      # Zone detail with insights
GET /api/metrics        # Metric definitions
```

---

## 📁 Project Structure

```
breathe-again-monitoring/
├── backend/                    # ✅ Complete
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── simulationService.ts
│   │   │   ├── rulesEngine.ts
│   │   │   ├── explanationService.ts
│   │   │   └── mathUtils.ts
│   │   ├── jobs/              # Background jobs
│   │   │   └── mockDataGenerator.ts
│   │   └── index.ts           # Server entry
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed script
│   ├── README.md
│   ├── SUPABASE_SETUP.md
│   ├── PHASE2_COMPLETE.md
│   └── PHASE3_COMPLETE.md
├── docs/                       # Planning & specs
│   ├── PRD.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── API_CONTRACT.md
│   ├── FRONTEND_IMPLEMENTATION.md  # 👈 Start here for frontend
│   ├── FRONTEND_UX.md
│   └── Design-System.md
└── frontend/                   # 🚧 To be built
    └── (Next.js app)
```

---

## 🎨 Frontend Implementation

**See:** `docs/FRONTEND_IMPLEMENTATION.md` for comprehensive plan

**Tech Stack:**
- **React 18+** with TypeScript
- **Vite 5** for blazing-fast development
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Query** for data fetching & caching
- **Axios** for HTTP requests

**Why Vite?**
- ⚡ Lightning-fast HMR (<50ms)
- 🚀 Instant dev server startup (<1 second)
- 📦 10-100x faster builds than webpack
- 🎯 Perfect for dashboard apps (client-side only)

**Timeline:** 4 weeks for MVP

**Key Pages:**
1. Overview Dashboard - System health at a glance
2. Zones List - Browse all monitoring zones
3. Zone Detail - Deep dive with 24h charts
4. Insights Center - Manage alerts and recommendations

---

## 🔑 Key Features

### Real-Time Monitoring
- Live sensor data updates every 5 minutes
- 24-hour historical charts
- Trend analysis with linear regression

### Intelligent Alerts
- **Threshold Rules:** Instant alerts for out-of-range values
- **Duration Rules:** Sustained issues (6h warning, 24h critical)
- **Trend Rules:** Predictive alerts before critical levels
- **Sensor Offline:** Connectivity issue detection

### Context-Aware Insights
```
"Soil moisture in Zone A - Upper Left is currently 28%, below 
the optimal range of 30-45%. This zone has high exposure, which 
may be increasing evaporation. Consider checking the irrigation 
schedule or adjusting watering frequency."
```

### Auto-Resolution
- Insights resolve automatically when conditions normalize
- Resolution tracking for historical analysis

---

## 📈 Example API Response

```json
{
  "id": "e7f888c8-fa5f-4c62-82b0-4dcec9c64e90",
  "name": "Zone E - Center",
  "plantType": "Ferns & Shade Plants",
  "exposure": "low",
  "garden": {
    "name": "Lobby Vertical Garden",
    "orientation": "interior"
  },
  "latestReadings": [
    {
      "metricKey": "soil_moisture",
      "value": 38.5,
      "timestamp": "2025-12-29T07:17:46.105Z",
      "source": "mock"
    }
  ],
  "insights": [
    {
      "severity": "warning",
      "explanation": "Humidity in Zone E is currently 46.2%, below optimal...",
      "confidence": 1.0,
      "createdAt": "2025-12-29T07:17:46.105Z",
      "resolvedAt": null
    }
  ]
}
```

---

## 🛠️ Development

### Backend Development

```bash
npm run dev        # Development server with hot reload
npm run build      # TypeScript compilation
npm run db:studio  # Open Prisma Studio (database GUI)
npm run db:seed    # Re-seed database
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."  # Supabase connection string
PORT=3001
NODE_ENV=development
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `PRD.md` | Product requirements |
| `SYSTEM_ARCHITECTURE.md` | System design |
| `DATA_MODEL.md` | Database schema |
| `API_CONTRACT.md` | API specifications |
| `FRONTEND_IMPLEMENTATION.md` | **Frontend build guide** |
| `FRONTEND_UX.md` | UX specifications |
| `backend/README.md` | Backend setup guide |
| `backend/SUPABASE_SETUP.md` | Database setup |

---

## 🎯 Next Steps

### For Frontend Development:
1. Review `docs/FRONTEND_IMPLEMENTATION.md`
2. Initialize Next.js project
3. Set up Tailwind + design system
4. Create API client with React Query
5. Build overview dashboard

### For Production Deployment:
1. Deploy backend to Railway/Render
2. Deploy frontend to Vercel
3. Configure environment variables
4. Set up monitoring/logging
5. Integrate real sensors (replace mock data)

---

## 🤝 Contributing

This project is designed for AI-assisted development. All backend code is production-ready with:
- ✅ TypeScript type safety
- ✅ Error handling
- ✅ Comprehensive logging
- ✅ Modular architecture
- ✅ Clear separation of concerns

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🌿 About Breathe Again

Breathe Again makes biophilic systems intelligent, ensuring optimal plant health through continuous monitoring and proactive alerts. From vertical gardens to living walls, we help facilities maintain thriving green spaces with minimal manual oversight.

**Built with ❤️ for a greener future**
