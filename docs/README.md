# Breathe Again - Documentation

## Overview

**Breathe Again** is a web-based monitoring platform for biophilic installations (starting with vertical gardens). It provides real-time metrics, historical trends, and intelligent insights to help building owners and facilities managers monitor system health without physical inspection.

This documentation suite provides complete context for AI agents and developers to build the system from scratch.

---

## Documentation Structure

### 1. **[PRD.md](./PRD.md)** - Product Requirements Document
**Purpose:** Defines what we're building and why

**Key Contents:**
- Product vision and goals
- Target users and their needs
- Core features (MVP scope)
- Non-goals (what we're NOT building)
- Demo requirements for investors

**Read this first to understand:** The business context and user needs

---

### 2. **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** - System Architecture
**Purpose:** High-level technical design and component responsibilities

**Key Contents:**
- Architecture diagram (mock data → database → API → frontend)
- Backend vs frontend responsibilities
- Technology stack recommendations
- Data flow patterns
- Transition plan from mock to real sensors

**Read this to understand:** How the system components fit together

---

### 3. **[DATA_MODEL.md](./DATA_MODEL.md)** - Data Model
**Purpose:** Complete database schema and relationships

**Key Contents:**
- Entity definitions (Installation, Garden, Zone, Metric, MetricReading, Insight)
- Schema with field types and constraints
- Relationships and foreign keys
- Indexes for performance
- Sample data structures
- Data retention policies

**Read this to understand:** What data we store and how it's organized

---

### 4. **[MOCK_DATA_ENGINE.md](./MOCK_DATA_ENGINE.md)** - Mock Data Engine
**Purpose:** Realistic sensor simulation algorithms

**Key Contents:**
- Simulation principles (temporal coherence, biological plausibility)
- Daily cycle calculations (light, temperature, humidity, moisture)
- Zone-specific variations (exposure levels)
- Anomaly generation (rare events)
- Execution strategy (background jobs)

**Read this to understand:** How to generate convincing fake sensor data

---

### 5. **[RULES_AND_INSIGHTS.md](./RULES_AND_INSIGHTS.md)** - Rules & Insights Engine
**Purpose:** Alert generation and plain-English explanations

**Key Contents:**
- Rule types (threshold, duration, trend)
- Insight generation logic
- Severity levels (info, warning, critical)
- Context-aware explanations
- Auto-resolution conditions

**Read this to understand:** How the system detects and explains issues

---

### 6. **[API_CONTRACT.md](./API_CONTRACT.md)** - API Contract
**Purpose:** Complete REST API specification

**Key Contents:**
- All endpoints with request/response formats
- Query parameters and filtering
- Pagination strategy
- Error handling
- Response format standards

**Read this to understand:** How frontend and backend communicate

---

### 7. **[FRONTEND_UX.md](./FRONTEND_UX.md)** - Frontend UX Design
**Purpose:** UI/UX guidelines and page layouts

**Key Contents:**
- Design principles (calm, status-first, minimal cognitive load)
- Page layouts (dashboard, metrics, charts, zone details, insights)
- Mobile-first responsive design
- Color palette and typography
- Animations and micro-interactions
- Accessibility requirements

**Read this to understand:** How the user interface should look and behave

---

### 8. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Implementation Guide
**Purpose:** Step-by-step build roadmap

**Key Contents:**
- Project structure
- 8-week phased implementation plan
- Detailed steps for each phase
- Testing strategy
- Deployment instructions
- Demo preparation checklist

**Read this to understand:** The exact sequence of implementation steps

---

## Quick Start for AI Agents

If you're an AI agent tasked with building this system:

1. **Start here:** Read `PRD.md` to understand the product vision
2. **Architecture:** Review `SYSTEM_ARCHITECTURE.md` for technical approach
3. **Implementation:** Follow `IMPLEMENTATION_GUIDE.md` phase by phase
4. **Reference as needed:**
   - `DATA_MODEL.md` when building database
   - `MOCK_DATA_ENGINE.md` when implementing simulation
   - `RULES_AND_INSIGHTS.md` when building alert logic
   - `API_CONTRACT.md` when creating endpoints
   - `FRONTEND_UX.md` when building UI

---

## Key Principles

### 1. Software-First Approach
- Start with mock data, transition to real sensors later
- Frontend never knows if data is mock or real
- Clean separation of concerns

### 2. Demo-Ready from Day One
- Continuous data generation (not one-time seeding)
- Believable biological behavior
- Occasional anomalies to demonstrate capabilities

### 3. User Trust is Paramount
- Plain English explanations (no jargon)
- Status-first, numbers second
- Context-aware insights
- Calm, trustworthy design

### 4. Mobile-First
- Optimized for phones and tablets
- Desktop is enhanced, not primary
- Touch-friendly interactions

---

## Technology Stack Summary

**Backend:**
- Node.js + Express/Fastify
- PostgreSQL + Prisma ORM
- node-cron for background jobs

**Frontend:**
- React 18 + Next.js 14
- Tailwind CSS
- React Query
- Recharts for visualizations

**Deployment:**
- Backend: Railway/Render
- Frontend: Vercel
- Database: Supabase/Neon

---

## Project Status

- [x] Documentation complete
- [ ] Database schema implementation
- [ ] Mock data engine
- [ ] Rules & insights engine
- [ ] API implementation
- [ ] Frontend implementation
- [ ] Testing
- [ ] Deployment

---

## Contributing

When making changes to this documentation:

1. Keep it **concise** - AI agents need clarity, not verbosity
2. Keep it **detailed** - Include enough context to understand decisions
3. Keep it **consistent** - Cross-reference between docs
4. Keep it **actionable** - Provide concrete examples and code snippets

---

## Support

For questions or clarifications about this documentation, refer to the specific document's content or create an issue in the project repository.

---

**Last Updated:** 2024-12-29  
**Product Name:** Breathe Again  
**Version:** 1.0 (MVP Documentation)
