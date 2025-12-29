# Frontend UX Specification

> **Note:** This document defines screen-by-screen layouts, user flows, and interactions. For visual design tokens (colors, typography, spacing), refer to `Design-System.md`.

---

## Design Principles

### 1. Calm, Natural, Trustworthy
- Nature-inspired aesthetic with rich photography
- Glassmorphism for depth and sophistication
- Smooth, organic animations
- Clear visual hierarchy with generous white space

### 2. Status-First, Numbers Second
- Lead with health indicators (✓ Healthy, ⚠ Warning, ✕ Critical)
- Large status badges, smaller metric values
- Color coding consistent with design system
- Plain English explanations, no jargon

### 3. Progressive Disclosure
- One primary action per screen
- Details revealed on interaction
- Contextual help where needed
- Minimal cognitive load

---

## Target Devices & Breakpoints

### Mobile-First (Primary Experience)
- **Breakpoint**: < 768px
- Single-column layouts
- Bottom tab navigation
- Touch-friendly (min 44x44px tap targets)
- Pull-to-refresh gesture
- Swipe navigation between zones

### Tablet (Enhanced)
- **Breakpoint**: 768px - 1024px
- 2-column grid layouts
- Side navigation drawer
- Larger metric cards
- Split-screen zone details

### Desktop (Full Experience)
- **Breakpoint**: > 1024px
- 3-4 column grid layouts
- Persistent left sidebar navigation
- Multi-panel views
- Keyboard shortcuts enabled
- Hover states and tooltips

---

## Screen-by-Screen Layouts

## 1. Dashboard Overview

### Purpose
Quick health check across all installations with immediate status visibility.

### Mobile Layout (< 768px)

```
┌─────────────────────────────────────┐
│ [Status Bar: 9:40 PM]               │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [HERO: Full-bleed garden photo] │ │
│ │                                 │ │
│ │  ┌───────────────────────────┐  │ │
│ │  │ [Glass Card - Frosted]    │  │ │
│ │  │                           │  │ │
│ │  │ 🌿 Nairobi Green Tower    │  │ │
│ │  │ 22°C ☀️                   │  │ │
│ │  │                           │  │ │
│ │  │ Area: 15m² │ Zones: 8     │  │ │
│ │  │ Plant Age: 44 Days        │  │ │
│ │  └───────────────────────────┘  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ✓ All Systems Healthy          │ │
│ │  Last updated: 2 min ago        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌──────────┐  ┌──────────┐         │
│ │ 💧 Water │  │ 🌡️ Temp  │         │
│ │          │  │          │         │
│ │   50%    │  │  22.3°C  │         │
│ │ Optimal  │  │ Optimal  │         │
│ │ ▁▂▃▄▅▄▃▂ │  │ ▂▃▄▅▄▃▂▁ │         │
│ └──────────┘  └──────────┘         │
│                                     │
│ ┌──────────┐  ┌──────────┐         │
│ │ 💨 Humid │  │ ☀️ Light │         │
│ │          │  │          │         │
│ │  58.2%   │  │ 1200 lux │         │
│ │ Optimal  │  │ Optimal  │         │
│ │ ▃▄▅▄▃▂▁▂ │  │ ▁▂▃▄▃▂▁▂ │         │
│ └──────────┘  └──────────┘         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Recent Insights      [View All] │ │
│ ├─────────────────────────────────┤ │
│ │ ⚠ Zone A: Low moisture          │ │
│ │   "Below optimal for 6 hours"   │ │
│ │   2 hours ago                   │ │
│ ├─────────────────────────────────┤ │
│ │ ℹ Zone B: Temp normalized       │ │
│ │   "Returned to optimal range"   │ │
│ │   5 hours ago                   │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [🏠] [🌿] [🔔] [⚙️]                │
│ Home  Zones Alerts Settings         │
└─────────────────────────────────────┘
```

**Interactions:**
- **Pull down**: Refresh all data
- **Tap metric card**: Navigate to detailed chart view
- **Tap insight**: Navigate to zone detail
- **Swipe hero card left/right**: Switch between installations

**Auto-refresh:** Every 60 seconds (with subtle pulse animation)

---

### Desktop Layout (> 1024px)

```
┌────────────────────────────────────────────────────────────────┐
│ ┌──────┐                                        [Refresh] [⚙️] │
│ │ 🌿   │  Breathe Again                                        │
│ │      │                                                       │
│ ├──────┤                                                       │
│ │ 🏠   │  ┌──────────────────────────────────────────────────┐│
│ │ Dash │  │ [HERO: Full-width garden photo with blur]        ││
│ │      │  │                                                  ││
│ ├──────┤  │  ┌────────────────────────────────────────────┐ ││
│ │ 🌿   │  │  │ [Glass Card - Centered]                    │ ││
│ │ Zones│  │  │                                            │ ││
│ │      │  │  │  🌿 Nairobi Green Tower        22°C ☀️    │ ││
│ ├──────┤  │  │                                            │ ││
│ │ 🔔   │  │  │  Area: 15m²  │  Zones: 8  │  Age: 44 Days │ ││
│ │Alerts│  │  └────────────────────────────────────────────┘ ││
│ │      │  │                                                  ││
│ ├──────┤  │            ✓ All Systems Healthy                 ││
│ │ ⚙️   │  └──────────────────────────────────────────────────┘│
│ │ Set  │                                                       │
│ │      │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ └──────┘  │ 💧 Water │ │ 🌡️ Temp  │ │ 💨 Humid │ │ ☀️ Light ││
│           │          │ │          │ │          │ │          ││
│           │   50%    │ │  22.3°C  │ │  58.2%   │ │ 1200 lux ││
│           │ ✓Optimal │ │ ✓Optimal │ │ ✓Optimal │ │ ✓Optimal ││
│           │          │ │          │ │          │ │          ││
│           │ ▁▂▃▄▅▄▃▂ │ │ ▂▃▄▅▄▃▂▁ │ │ ▃▄▅▄▃▂▁▂ │ │ ▁▂▃▄▃▂▁▂ ││
│           │          │ │          │ │          │ │          ││
│           │ Ideal:   │ │ Ideal:   │ │ Ideal:   │ │ Ideal:   ││
│           │ 30-45%   │ │ 18-26°C  │ │ 45-70%   │ │800-2500  ││
│           └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                                │
│           ┌────────────────────────┐ ┌───────────────────────┐│
│           │ Recent Insights        │ │ Zone Status Summary   ││
│           ├────────────────────────┤ ├───────────────────────┤│
│           │ ⚠ Zone A: Low moisture │ │ ✓ Healthy:      6     ││
│           │   2 hours ago          │ │ ⚠ Warning:      2     ││
│           │                        │ │ ✕ Critical:     0     ││
│           │ ℹ Zone B: Temp normal  │ │                       ││
│           │   5 hours ago          │ │ [View All Zones →]    ││
│           │                        │ │                       ││
│           │ [View All Insights →]  │ │                       ││
│           └────────────────────────┘ └───────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- **Hover metric card**: Lift effect + detailed tooltip
- **Click metric card**: Expand to full historical chart
- **Keyboard**: `R` to refresh, `G+D` for dashboard
- **Click zone status**: Filter zones by status

---

## 2. Zone Detail View

### Purpose
Deep dive into specific zone performance with comprehensive metrics and insights.

### Mobile Layout

```
┌─────────────────────────────────────┐
│ [← Back]  Zone A - Upper Left   [•••]│
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [Photo: Close-up of ferns]      │ │
│ │                                 │ │
│ │  ┌───────────────────────────┐  │ │
│ │  │ [Dark glass overlay]      │  │ │
│ │  │                           │  │ │
│ │  │ Ferns & Philodendrons     │  │ │
│ │  │ Medium Exposure           │  │ │
│ │  │                           │  │ │
│ │  │ ✓ Healthy                 │  │ │
│ │  └───────────────────────────┘  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Live Metrics                        │
│ ┌──────────┐  ┌──────────┐         │
│ │ 💧 38.5% │  │ 🌡️ 22°C  │         │
│ │ Optimal  │  │ Optimal  │         │
│ └──────────┘  └──────────┘         │
│ ┌──────────┐  ┌──────────┐         │
│ │ 💨 58%   │  │ ☀️ 1200  │         │
│ │ Optimal  │  │ Optimal  │         │
│ └──────────┘  └──────────┘         │
│                                     │
│ Historical Trends                   │
│ [Moisture][Temp][Humidity][Light]   │
│ ┌─────────────────────────────────┐ │
│ │ Soil Moisture - Last 24h        │ │
│ │                                 │ │
│ │ 45% ┤                           │ │
│ │     │     ╱╲    ╱╲              │ │
│ │ 35% ┤────────────────────       │ │
│ │     │   ╱    ╲╱    ╲            │ │
│ │ 25% ┤                           │ │
│ │     └──────────────────         │ │
│ │     0h   6h   12h  18h  24h     │ │
│ │                                 │ │
│ │ [24h] [7d] [30d] [Custom]       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Active Insights (1)                 │
│ ┌─────────────────────────────────┐ │
│ │ ⚠ Warning • 6 hours ago         │ │
│ │                                 │ │
│ │ Soil moisture trending downward │ │
│ │                                 │ │
│ │ "Soil moisture in Zone A has    │ │
│ │ remained below optimal for 6    │ │
│ │ hours. This zone has medium     │ │
│ │ exposure, which may be          │ │
│ │ increasing evaporation."        │ │
│ │                                 │ │
│ │ Confidence: 85%                 │ │
│ │                                 │ │
│ │ [Dismiss] [View Details]        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Interactions:**
- **Swipe left/right on photo**: Navigate to adjacent zones
- **Tap metric card**: Expand to full-screen chart
- **Tap chart tab**: Switch between metrics
- **Pinch chart**: Zoom in/out on timeline
- **Tap insight**: Expand for full details and recommendations

---

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [Sidebar]  Zone A - Upper Left                    [•••] [✕]    │
├────────────────────────────────────────────────────────────────┤
│           ┌──────────────────────┐  ┌──────────────────────┐   │
│           │ [Zone Photo]         │  │ Live Metrics         │   │
│           │                      │  ├──────────────────────┤   │
│           │  ┌────────────────┐  │  │ 💧 Soil Moisture     │   │
│           │  │ Ferns &        │  │  │    38.5%   ✓Optimal  │   │
│           │  │ Philodendrons  │  │  │    ▁▂▃▄▅▄▃▂          │   │
│           │  │                │  │  ├──────────────────────┤   │
│           │  │ Medium Exposure│  │  │ 🌡️ Temperature       │   │
│           │  │ ✓ Healthy      │  │  │    22.3°C  ✓Optimal  │   │
│           │  └────────────────┘  │  │    ▂▃▄▅▄▃▂▁          │   │
│           └──────────────────────┘  ├──────────────────────┤   │
│                                     │ 💨 Humidity          │   │
│           ┌──────────────────────────────────────────────┐ │   │
│           │ Historical Trends                            │ │   │
│           ├──────────────────────────────────────────────┤ │   │
│           │ [Moisture][Temp][Humidity][Light]            │ │   │
│           │                                              │ │   │
│           │ Soil Moisture - Last 7 Days                  │ │   │
│           │                                              │ │   │
│           │ 45% ┤                    ●  ← Anomaly        │ │   │
│           │     │              ╱╲  ╱  ╲                  │ │   │
│           │ 35% ┤─────────────────────────  ← Ideal max  │ │   │
│           │     │        ╱╲  ╱  ╲╱    ╲                  │ │   │
│           │ 25% ┤─────────────────────────  ← Ideal min  │ │   │
│           │     └────────────────────────────            │ │   │
│           │     Mon  Tue  Wed  Thu  Fri  Sat  Sun        │ │   │
│           │                                              │ │   │
│           │ [24h] [7d] [30d] [Custom Range]              │ │   │
│           └──────────────────────────────────────────────┘ │   │
│                                                              │   │
│           ┌──────────────────────────────────────────────┐   │
│           │ Active Insights (1)                          │   │
│           ├──────────────────────────────────────────────┤   │
│           │ ⚠ Warning • 6 hours ago                      │   │
│           │                                              │   │
│           │ Soil moisture trending downward              │   │
│           │                                              │   │
│           │ "Soil moisture in Zone A has remained below  │   │
│           │ optimal for 6 hours. This zone has medium    │   │
│           │ exposure, which may be increasing            │   │
│           │ evaporation. Consider checking irrigation    │   │
│           │ schedule."                                   │   │
│           │                                              │   │
│           │ Confidence: 85%                              │   │
│           │                                              │   │
│           │ [Dismiss] [View Full History]                │   │
│           └──────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- **Hover chart**: Show crosshair + tooltip with exact values
- **Click chart point**: Pin tooltip, show related insights
- **Drag chart**: Pan timeline
- **Scroll wheel on chart**: Zoom in/out
- **Click time range**: Update chart data
- **Keyboard**: Arrow keys to navigate between zones

---

## 3. Insights Feed

### Purpose
Chronological timeline of all system events, alerts, and status changes.

### Mobile Layout

```
┌─────────────────────────────────────┐
│ Insights & Alerts                   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [All] [Critical] [Warning] [Info]│ │
│ │                                 │ │
│ │ [All Zones ▼]  [Last 7 Days ▼]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Today                               │
│ ┌─────────────────────────────────┐ │
│ │ ⚠ 14:30                          │ │
│ │ Zone A: Low moisture detected   │ │
│ │                                 │ │
│ │ "Soil moisture below 30%..."    │ │
│ │                                 │ │
│ │ [View Zone →]                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ℹ 09:15                          │ │
│ │ Zone B: Temperature normalized  │ │
│ │                                 │ │
│ │ "Temperature returned to..."    │ │
│ │                                 │ │
│ │ [Resolved]                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Yesterday                           │
│ ┌─────────────────────────────────┐ │
│ │ ⚠ 18:45                          │ │
│ │ Zone C: High humidity variance  │ │
│ │                                 │ │
│ │ "Readings more variable..."     │ │
│ │                                 │ │
│ │ [View Zone →]                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Load More]                         │
└─────────────────────────────────────┘
```

**Interactions:**
- **Tap filter chip**: Filter by severity
- **Tap dropdown**: Filter by zone or date range
- **Tap insight card**: Expand for full details
- **Swipe card left**: Mark as read / Dismiss
- **Pull down**: Refresh feed
- **Scroll to bottom**: Auto-load more

---

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [Sidebar]  Insights & Alerts                                   │
├────────────────────────────────────────────────────────────────┤
│           ┌──────────────────────────────────────────────────┐ │
│           │ Filters                                          │ │
│           ├──────────────────────────────────────────────────┤ │
│           │ [All] [Critical] [Warning] [Info]                │ │
│           │                                                  │ │
│           │ Zone: [All Zones ▼]  Period: [Last 7 Days ▼]    │ │
│           └──────────────────────────────────────────────────┘ │
│                                                                │
│           ┌────────────────────────┐  ┌──────────────────────┐│
│           │ Timeline               │  │ Summary              ││
│           ├────────────────────────┤  ├──────────────────────┤│
│           │ Today                  │  │ Unresolved: 3        ││
│           │                        │  │ Critical:   0        ││
│           │ ⚠ 14:30                │  │ Warning:    2        ││
│           │ Zone A: Low moisture   │  │ Info:       1        ││
│           │                        │  │                      ││
│           │ "Soil moisture below   │  │ Resolved Today: 2    ││
│           │ 30% for 6 hours. This  │  │                      ││
│           │ zone has medium        │  │ [Export Report]      ││
│           │ exposure..."           │  └──────────────────────┘│
│           │                        │                          │
│           │ Confidence: 85%        │                          │
│           │                        │                          │
│           │ [View Zone] [Dismiss]  │                          │
│           │                        │                          │
│           ├────────────────────────┤                          │
│           │ ℹ 09:15                │                          │
│           │ Zone B: Temp normal    │                          │
│           │                        │                          │
│           │ "Temperature returned  │                          │
│           │ to optimal range"      │                          │
│           │                        │                          │
│           │ [Resolved]             │                          │
│           │                        │                          │
│           ├────────────────────────┤                          │
│           │ Yesterday              │                          │
│           │                        │                          │
│           │ ⚠ 18:45                │                          │
│           │ Zone C: High variance  │                          │
│           │ ...                    │                          │
│           └────────────────────────┘                          │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- **Click filter chip**: Toggle filter
- **Click insight**: Expand inline for full details
- **Hover insight**: Show quick actions (View Zone, Dismiss)
- **Keyboard**: `J/K` to navigate up/down, `Enter` to expand
- **Click "Export Report"**: Download PDF of insights

---

## 4. Zones List View

### Purpose
Overview of all zones with quick status assessment.

### Mobile Layout

```
┌─────────────────────────────────────┐
│ Zones (8)                   [Filter]│
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [Photo: Ferns]                  │ │
│ │  ┌───────────────────────────┐  │ │
│ │  │ Zone A - Upper Left       │  │ │
│ │  │ Ferns & Philodendrons     │  │ │
│ │  │ ✓ Healthy                 │  │ │
│ │  └───────────────────────────┘  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Photo: Succulents]             │ │
│ │  ┌───────────────────────────┐  │ │
│ │  │ Zone B - Upper Right      │  │ │
│ │  │ Succulents                │  │ │
│ │  │ ⚠ Warning                 │  │ │
│ │  └───────────────────────────┘  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [... more zones ...]                │
└─────────────────────────────────────┘
```

**Interactions:**
- **Tap zone card**: Navigate to zone detail
- **Tap filter**: Show filter options (status, plant type, exposure)
- **Long press zone**: Show quick actions menu

---

## User Flows

### Flow 1: Morning Health Check (30 seconds)

```
1. Open App
   ↓
2. Dashboard loads with hero image + glass card
   ↓
3. See "✓ All Systems Healthy" status
   ↓
4. Glance at 4 metric cards (all green)
   ↓
5. Scroll to Recent Insights (nothing critical)
   ↓
6. Close app (confident everything is fine)
```

### Flow 2: Investigating a Warning (2 minutes)

```
1. Open App → See yellow warning badge
   ↓
2. Tap "Recent Insights" → See "Zone A: Low moisture"
   ↓
3. Tap insight card → Navigate to Zone A detail
   ↓
4. View zone photo + current metrics
   ↓
5. Tap "Moisture" tab → See 7-day trend chart
   ↓
6. Read insight explanation with context
   ↓
7. Understand issue (high exposure + evaporation)
   ↓
8. Decide action (check irrigation schedule)
```

### Flow 3: Comparing Zones (Desktop)

```
1. Navigate to Zones page
   ↓
2. Click "Compare" button
   ↓
3. Select Zone A and Zone B
   ↓
4. View side-by-side metrics
   ↓
5. Overlay charts to see differences
   ↓
6. Identify that Zone B (high exposure) has faster moisture loss
```

---

## Page-Specific Interactions

### Dashboard

**Mobile:**
- Pull-to-refresh: Reload all data
- Swipe hero card: Switch installations
- Tap metric: Go to detailed chart
- Tap insight: Go to zone detail

**Desktop:**
- Hover metric: Show tooltip with trend
- Click metric: Expand to modal with full chart
- Keyboard `R`: Refresh
- Keyboard `1-4`: Focus on metric 1-4

---

### Zone Detail

**Mobile:**
- Swipe photo left/right: Navigate zones
- Pinch chart: Zoom timeline
- Tap chart tab: Switch metrics
- Pull-to-refresh: Reload zone data

**Desktop:**
- Hover chart: Crosshair + tooltip
- Drag chart: Pan timeline
- Scroll wheel: Zoom in/out
- Click anomaly dot: Show related insight
- Keyboard arrows: Navigate zones

---

### Insights Feed

**Mobile:**
- Swipe card left: Dismiss
- Tap card: Expand details
- Pull-to-refresh: Reload feed
- Scroll to bottom: Load more

**Desktop:**
- Click insight: Expand inline
- Hover: Show quick actions
- Keyboard `J/K`: Navigate
- Keyboard `D`: Dismiss selected

---

## Responsive Behavior Per Screen

### Dashboard

| Element | Mobile (< 768px) | Tablet (768-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|-------------------|
| Hero | Full-bleed vertical | Full-bleed horizontal | Full-width with sidebar |
| Metrics | 2x2 grid | 4x1 row | 4x1 row (larger cards) |
| Insights | Stacked list | 2-column grid | Sidebar panel |
| Navigation | Bottom tabs | Side drawer | Persistent sidebar |

### Zone Detail

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Photo | Full-width | 50% width | 33% width |
| Metrics | 2x2 grid | 4x1 row | Sidebar panel |
| Chart | Full-width | Full-width | 66% width |
| Insights | Below chart | Below chart | Right sidebar |

### Insights Feed

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Filters | Horizontal scroll chips | Inline buttons | Sticky top bar |
| Timeline | Single column | Single column | 66% width |
| Summary | Hidden | Hidden | 33% sidebar |

---

## Accessibility Implementation

### Keyboard Navigation

**Global Shortcuts:**
- `G + D`: Go to Dashboard
- `G + Z`: Go to Zones
- `G + I`: Go to Insights
- `R`: Refresh current page
- `?`: Show keyboard shortcuts help
- `/`: Focus search (future)

**Page-Specific:**
- `Tab`: Navigate interactive elements
- `Enter`: Activate focused element
- `Esc`: Close modals/expanded views
- `Arrow keys`: Navigate lists/zones
- `Space`: Scroll page down

### Screen Reader Support

```html
<!-- Dashboard Example -->
<main aria-label="Dashboard">
  <section aria-labelledby="health-status">
    <h1 id="health-status">Overall Health Status</h1>
    <div role="status" aria-live="polite">
      <span class="sr-only">System status:</span>
      All Systems Healthy
    </div>
  </section>
  
  <section aria-labelledby="live-metrics">
    <h2 id="live-metrics">Live Environmental Metrics</h2>
    <div role="list" aria-label="Metric cards">
      <article role="listitem" aria-labelledby="metric-moisture">
        <h3 id="metric-moisture">Soil Moisture</h3>
        <data value="50" aria-label="50 percent">50%</data>
        <span role="status" aria-label="Status: Optimal">Optimal</span>
      </article>
    </div>
  </section>
</main>
```

### Focus Management

```css
/* High-contrast focus indicator */
*:focus-visible {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: inherit;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary-700);
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Color Contrast

All text meets WCAG AA standards:
- **Body text on white**: 4.5:1 minimum
- **Large text (18px+)**: 3:1 minimum
- **Status badges**: 4.5:1 minimum
- **Glass card text**: Dark overlay ensures 4.5:1

### ARIA Labels

```html
<!-- Metric card with full context -->
<div 
  role="article" 
  aria-label="Soil moisture: 50 percent, Status: Optimal, Last 24 hours trend showing stable readings"
>
  <!-- Visual content -->
</div>

<!-- Chart with description -->
<figure aria-labelledby="chart-title" aria-describedby="chart-desc">
  <figcaption id="chart-title">Soil Moisture - Last 7 Days</figcaption>
  <div id="chart-desc" class="sr-only">
    Line chart showing soil moisture levels ranging from 35% to 42% 
    over the past 7 days. One anomaly detected on Thursday at 28%.
  </div>
  <!-- Chart SVG -->
</figure>
```

---

## Performance Considerations

### Image Optimization
- Hero images: WebP format, max 1920px width
- Zone photos: Lazy loaded, 800px width
- Responsive images with `srcset`
- Blur-up placeholder technique

### Data Loading Strategy
- **Dashboard**: Load critical data first (status, latest metrics)
- **Charts**: Load on-demand when tab selected
- **Insights**: Paginated, load 20 at a time
- **Images**: Progressive JPEG/WebP with blur placeholder

### Animation Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- Debounce scroll events
- Use `will-change` sparingly
- Disable animations on low-end devices

---

## Future Enhancements

1. **Dark Mode**: System preference detection + manual toggle
2. **Customizable Dashboard**: Drag-and-drop metric cards
3. **Push Notifications**: Critical alerts sent to mobile
4. **Offline Mode**: Service worker caching for offline viewing
5. **Multi-Installation Compare**: Side-by-side comparison view
6. **Export Reports**: PDF generation with charts and insights
7. **Voice Commands**: "Show me Zone A moisture levels"
8. **AR View**: Point camera at garden to see overlay metrics

---

**Last Updated:** 2024-12-29  
**Version:** 2.0 (Aligned with Design System)
