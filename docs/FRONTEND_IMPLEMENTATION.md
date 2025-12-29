# Frontend Implementation Plan: Breathe Again Dashboard

## Executive Summary

Build a premium, real-time dashboard for monitoring biophilic systems using **React + Vite**, **TypeScript**, and **Tailwind CSS**. The frontend will consume the existing backend API to display live sensor data, insights, and system health with a stunning, Apple-level aesthetic.

---

## Technology Stack

### Core Framework
- **Vite 5** for blazing-fast development
- **React 18+** with TypeScript
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling

### Data Visualization
- **Recharts** for time-series charts
- **Framer Motion** for animations
- **Lucide React** for icons

### State Management
- **React Query (TanStack Query)** for server state & caching
- **React Context** for theme/settings (optional)

### HTTP Client
- **Axios** for API requests
- **Vite Proxy** for development CORS handling

### Real-Time Updates
- **Polling** (every 30 seconds via React Query)
- **WebSockets** (future enhancement)

---

## Why Vite?

✅ **Lightning-fast HMR** (Hot Module Replacement)  
✅ **Instant dev server startup** (<1 second)  
✅ **10-100x faster builds** than webpack  
✅ **Simpler architecture** (no SSR complexity)  
✅ **Perfect for dashboards** (client-side only)  
✅ **Better developer experience**

---

## Architecture Overview

```
frontend/
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Router setup
│   ├── pages/                  # Route components
│   │   ├── Overview.tsx        # Dashboard home
│   │   ├── ZonesList.tsx       # All zones
│   │   ├── ZoneDetail.tsx      # Single zone
│   │   └── InsightsCenter.tsx  # Insights management
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── charts/             # Chart components
│   │   ├── cards/              # Data cards
│   │   ├── insights/           # Insight displays
│   │   └── layout/             # Layout components
│   ├── lib/
│   │   ├── api.ts              # API client (axios)
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Utilities
│   ├── hooks/
│   │   ├── useZones.ts         # Data fetching hooks
│   │   ├── useInsights.ts
│   │   └── useReadings.ts
│   └── styles/
│       └── index.css           # Tailwind imports
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## Quick Start

### 1. Create Vite Project

```bash
# Create new Vite project with React + TypeScript
npm create vite@latest frontend -- --template react-ts

cd frontend
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install

# Routing
npm install react-router-dom

# Data fetching & caching
npm install @tanstack/react-query axios

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Charts & animations
npm install recharts framer-motion lucide-react

# Utilities
npm install date-fns clsx
```

### 3. Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### 4. Configure Tailwind

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
```

```css
/* src/styles/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Set Up Router

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import Overview from './pages/Overview'
import ZonesList from './pages/ZonesList'
import ZoneDetail from './pages/ZoneDetail'
import InsightsCenter from './pages/InsightsCenter'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000, // Poll every 30s
      staleTime: 25000,
      retry: 2,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="zones" element={<ZonesList />} />
            <Route path="zones/:id" element={<ZoneDetail />} />
            <Route path="insights" element={<InsightsCenter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
```

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Page Structure

### 1. Overview Dashboard (`/`)
**Purpose:** High-level system health at a glance

**Components:**
- **Hero Stats**: Total zones, active insights, system health score
- **Installation Card**: Nairobi Green Tower overview
- **Gardens Grid**: 2 cards (Lobby, Rooftop) with zone counts
- **Recent Insights**: Latest 5 insights with severity badges
- **System Status**: Mock data generator status, last update time

**Layout:** 
```
┌─────────────────────────────────────────┐
│  Hero Stats (3 cards)                   │
├─────────────────────────────────────────┤
│  Installation Overview                  │
├──────────────────┬──────────────────────┤
│  Lobby Garden    │  Rooftop Garden      │
├──────────────────┴──────────────────────┤
│  Recent Insights (list)                 │
└─────────────────────────────────────────┘
```

### 2. Zones List (`/zones`)
**Purpose:** Browse all zones with current status

**Components:**
- **Zone Cards Grid**: 10 cards showing:
  - Zone name, plant type, exposure
  - Latest readings (4 metrics) with color coding
  - Active insights count badge
  - Health score indicator
- **Filters**: By garden, exposure, health status
- **Search**: By zone name

**Interactions:**
- Click card → Navigate to zone detail
- Hover → Show quick stats tooltip

### 3. Zone Detail (`/zones/[id]`)
**Purpose:** Deep dive into single zone

**Components:**
- **Zone Header**: Name, plant type, location, exposure
- **Current Readings**: 4 metric cards with gauges
- **Time-Series Charts**: 24h history for each metric
  - Line charts with ideal range shading
  - Hover tooltips with exact values
- **Active Insights**: List with explanations
- **Historical Insights**: Resolved insights timeline

**Layout:**
```
┌─────────────────────────────────────────┐
│  Zone Header                            │
├─────────────────────────────────────────┤
│  Current Readings (4 gauge cards)       │
├─────────────────────────────────────────┤
│  Soil Moisture Chart (24h)              │
│  Temperature Chart (24h)                │
│  Humidity Chart (24h)                   │
│  Light Chart (24h)                      │
├─────────────────────────────────────────┤
│  Active Insights                        │
└─────────────────────────────────────────┘
```

### 4. Insights Center (`/insights`)
**Purpose:** Manage all system insights

**Components:**
- **Insights Summary**: Count by severity
- **Active Insights List**: Grouped by severity
  - Critical (red)
  - Warning (yellow)
  - Info (blue)
- **Filters**: By severity, zone, metric, date range
- **Resolved Insights**: Expandable section

**Insight Card:**
```
┌─────────────────────────────────────────┐
│ [!] Zone B - Light Critical             │
│ Light levels are 2733 lux, above...     │
│ Confidence: 100% | Created: 2 hours ago │
│ [View Zone] [Mark Resolved]             │
└─────────────────────────────────────────┘
```

---

## Design System

### Color Palette

**Primary (Biophilic Green):**
```css
--primary-50: #f0fdf4
--primary-500: #22c55e
--primary-600: #16a34a
--primary-900: #14532d
```

**Status Colors:**
```css
--success: #10b981  /* In range */
--warning: #f59e0b  /* Warning severity */
--critical: #ef4444 /* Critical severity */
--info: #3b82f6    /* Info */
```

**Backgrounds:**
```css
--bg-primary: #0f172a    /* Dark slate */
--bg-secondary: #1e293b  /* Card backgrounds */
--bg-tertiary: #334155   /* Hover states */
```

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 600-700 weight
- **Body**: Regular, 400 weight
- **Monospace**: JetBrains Mono for metrics

### Components Style
- **Glassmorphism**: Frosted glass effect for cards
- **Gradients**: Subtle gradients for backgrounds
- **Shadows**: Layered shadows for depth
- **Rounded Corners**: 12-16px border radius
- **Micro-animations**: Smooth transitions (200-300ms)

---

## Data Flow

### API Integration

**Backend URL:** `http://localhost:3001/api`  
**Frontend Dev Server:** `http://localhost:3000`  
**Proxy:** Vite proxy handles CORS in development

**Endpoints:**
```typescript
// Installations
GET /api/installations
GET /api/installations/:id

// Gardens
GET /api/gardens
GET /api/gardens/:id

// Zones
GET /api/zones
GET /api/zones/:id

// Metrics
GET /api/metrics
```

**API Client (`lib/api.ts`):**
```typescript
import axios from 'axios'
import type { Zone, Garden, Installation, Metric, Insight } from './types'

const api = axios.create({
  baseURL: '/api', // Vite proxy will forward to localhost:3001
  timeout: 10000,
})

export const zonesApi = {
  getAll: () => api.get<Zone[]>('/zones').then(r => r.data),
  getById: (id: string) => api.get<Zone>(`/zones/${id}`).then(r => r.data),
}

export const gardensApi = {
  getAll: () => api.get<Garden[]>('/gardens').then(r => r.data),
  getById: (id: string) => api.get<Garden>(`/gardens/${id}`).then(r => r.data),
}

export const installationsApi = {
  getAll: () => api.get<Installation[]>('/installations').then(r => r.data),
  getById: (id: string) => api.get<Installation>(`/installations/${id}`).then(r => r.data),
}

export const metricsApi = {
  getAll: () => api.get<Metric[]>('/metrics').then(r => r.data),
}
```

### React Query Setup

```typescript
// hooks/useZones.ts
import { useQuery } from '@tanstack/react-query'
import { zonesApi } from '@/lib/api'

export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: zonesApi.getAll,
    refetchInterval: 30000, // Poll every 30s
  })
}

export function useZone(id: string) {
  return useQuery({
    queryKey: ['zones', id],
    queryFn: () => zonesApi.getById(id),
    refetchInterval: 30000,
    enabled: !!id, // Only fetch if id exists
  })
}
```

```typescript
// hooks/useInsights.ts
import { useQuery } from '@tanstack/react-query'
import { zonesApi } from '@/lib/api'

export function useZoneInsights(zoneId: string) {
  return useQuery({
    queryKey: ['zones', zoneId, 'insights'],
    queryFn: async () => {
      const zone = await zonesApi.getById(zoneId)
      return zone.insights || []
    },
    refetchInterval: 30000,
  })
}
```

### Type Definitions

```typescript
// lib/types.ts
export interface Zone {
  id: string;
  name: string;
  plantType: string;
  exposure: 'low' | 'medium' | 'high';
  garden: Garden;
  latestReadings?: Reading[];
  insights?: Insight[];
}

export interface Reading {
  metricKey: string;
  value: number;
  timestamp: string;
  source: 'mock' | 'sensor';
  metric: Metric;
}

export interface Insight {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  explanation: string;
  confidence: number;
  createdAt: string;
  resolvedAt: string | null;
}
```

---

## Key Components

### 1. Metric Gauge Card

**Purpose:** Display current metric value with visual indicator

```tsx
<MetricGauge
  metric="soil_moisture"
  value={38.5}
  unit="%"
  idealMin={30}
  idealMax={45}
  status="success" // success | warning | critical
/>
```

**Visual:**
- Circular gauge or linear progress bar
- Color-coded by status
- Ideal range indicator
- Trend arrow (↑↓→)

### 2. Time-Series Chart

**Purpose:** Show 24h history with ideal range shading

```tsx
<TimeSeriesChart
  data={readings}
  metricKey="soil_moisture"
  idealMin={30}
  idealMax={45}
/>
```

**Features:**
- Line chart with gradient fill
- Shaded ideal range (green)
- Out-of-range areas highlighted (red/yellow)
- Hover tooltips with exact values
- Responsive to container width

### 3. Insight Card

**Purpose:** Display insight with severity and actions

```tsx
<InsightCard
  insight={insight}
  onViewZone={() => router.push(`/zones/${zoneId}`)}
  onResolve={() => resolveInsight(insight.id)}
/>
```

**Visual:**
- Severity badge (icon + color)
- Plain-English explanation
- Confidence percentage
- Timestamp (relative: "2 hours ago")
- Action buttons

### 4. Zone Health Score

**Purpose:** Calculate and display overall zone health

**Algorithm:**
```typescript
function calculateHealthScore(readings: Reading[], insights: Insight[]): number {
  let score = 100;
  
  // Deduct for out-of-range readings
  readings.forEach(r => {
    if (r.value < r.metric.idealMin || r.value > r.metric.idealMax) {
      score -= 10;
    }
  });
  
  // Deduct for active insights
  insights.forEach(i => {
    if (i.severity === 'critical') score -= 20;
    if (i.severity === 'warning') score -= 10;
  });
  
  return Math.max(0, score);
}
```

**Display:**
- 0-100 score
- Color gradient: 80-100 (green), 50-79 (yellow), 0-49 (red)
- Circular progress indicator

---

## Animations & Interactions

### Page Transitions
- **Fade in**: 300ms ease-in-out
- **Slide up**: Cards animate up 20px on mount

### Hover Effects
- **Cards**: Lift 4px, increase shadow
- **Buttons**: Scale 1.05, brightness 110%
- **Charts**: Highlight data point, show tooltip

### Loading States
- **Skeleton screens**: Shimmer effect
- **Spinners**: For button actions
- **Progressive loading**: Show cached data while fetching

### Real-Time Updates
- **Pulse animation**: On new insight
- **Number counter**: Animate value changes
- **Toast notifications**: For critical insights

---

## Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile Optimizations
- **Stack cards vertically**
- **Collapsible sections**
- **Bottom navigation** (sticky)
- **Touch-friendly targets** (44px minimum)
- **Simplified charts** (fewer data points)

---

## Performance Optimizations

### Code Splitting
- Route-based splitting (automatic with Next.js)
- Dynamic imports for heavy components
- Lazy load charts below fold

### Data Fetching
- **Server Components** for initial data
- **React Query** for client-side caching
- **Stale-while-revalidate** strategy
- **Prefetch** on link hover

### Bundle Size
- Tree-shake unused Recharts components
- Use Lucide React (smaller than Font Awesome)
- Optimize images with Next.js Image

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create Vite project with React + TypeScript template
- [ ] Set up Tailwind CSS + design tokens
- [ ] Configure Vite proxy for backend API
- [ ] Create API client with Axios
- [ ] Define TypeScript types
- [ ] Set up React Router
- [ ] Create layout shell + navigation
- [ ] Configure React Query

**Deliverables:**
- Working dev server on `localhost:3000`
- API proxy to backend
- Basic routing structure
- Design system in place

### Phase 2: Core Pages (Week 2)
- [ ] Build Overview dashboard
  - Hero stats cards
  - Installation overview
  - Gardens grid
  - Recent insights feed
- [ ] Build Zones list page
  - Zone cards grid
  - Filters (garden, exposure, health)
  - Search functionality
- [ ] Build Zone detail page
  - Zone header with metadata
  - Current readings (4 gauge cards)
  - 24h time-series charts
- [ ] Create reusable components
  - Metric gauge card
  - Time-series chart
  - Zone card

**Deliverables:**
- 3 functional pages
- Reusable component library
- Real data from backend API

### Phase 3: Insights & Polish (Week 3)
- [ ] Build Insights center
  - Insights summary stats
  - Active insights list (grouped by severity)
  - Filters & search
  - Resolved insights timeline
- [ ] Create Insight card component
- [ ] Add filtering/sorting logic
- [ ] Implement real-time updates (polling)
- [ ] Add loading states & skeletons
- [ ] Error handling & retry logic

**Deliverables:**
- Complete insights management
- Robust error handling
- Smooth loading states

### Phase 4: Animations & Responsive (Week 4)
- [ ] Add Framer Motion animations
  - Page transitions
  - Card hover effects
  - Number counters
- [ ] Implement micro-interactions
  - Button feedback
  - Chart tooltips
  - Pulse on new insights
- [ ] Mobile responsive design
  - Breakpoints (sm, md, lg, xl)
  - Touch-friendly targets
  - Collapsible sections
- [ ] Performance optimization
  - Code splitting
  - Lazy loading
  - Image optimization
- [ ] Final polish
  - Accessibility (WCAG AA)
  - Cross-browser testing
  - Documentation

**Deliverables:**
- Production-ready dashboard
- Mobile responsive
- 60fps animations
- Lighthouse score > 90

---

## Success Criteria

✅ **Functional:**
- All API endpoints integrated
- Real-time data updates (30s polling)
- Responsive on mobile/tablet/desktop
- Error handling for API failures

✅ **Visual:**
- Premium, Apple-level aesthetic
- Smooth animations (60fps)
- Consistent design system
- Accessible (WCAG AA)

✅ **Performance:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90

---

## Next Steps

1. **Initialize Vite project**
   ```bash
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

2. **Install all dependencies**
   ```bash
   npm install react-router-dom @tanstack/react-query axios
   npm install recharts framer-motion lucide-react date-fns clsx
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Configure Vite & Tailwind**
   - Set up `vite.config.ts` with proxy
   - Configure `tailwind.config.js` with design tokens
   - Create `src/styles/index.css` with Tailwind imports

4. **Set up routing & API client**
   - Create `App.tsx` with React Router
   - Create `lib/api.ts` with Axios client
   - Define TypeScript types in `lib/types.ts`

5. **Build layout shell**
   - Create `components/layout/Layout.tsx`
   - Add navigation sidebar
   - Set up responsive structure

6. **Start with Overview page**
   - Fetch data with React Query
   - Display hero stats
   - Show recent insights

**Estimated Timeline:** 4 weeks for MVP  
**Team Size:** 1 frontend developer  
**Dependencies:** Backend API (complete ✅)  
**Dev Server:** `npm run dev` (starts in <1 second with Vite)
