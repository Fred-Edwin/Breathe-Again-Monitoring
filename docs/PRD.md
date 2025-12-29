# Product Requirements Document (PRD)

## Product Name
**Breathe Again**

## Product Vision
A web-based platform that allows clients to monitor, understand, and trust the performance of biophilic installations (starting with vertical gardens) through real-time metrics, historical trends, and intelligent insights.

The system is **software-first** and uses realistic simulated data in early stages, with a clean path to real sensor integration later.

## Primary Goal
Create a highly convincing, real-time, **investor-demo-ready dashboard** that behaves like a real deployed system.

## Target Users
- **Building owners** - Need to verify ROI and system health
- **Facilities managers** - Responsible for maintenance and operations
- **Design stakeholders** - Interested in performance validation
- **Investors** - Require demo mode for funding decisions

## Core User Needs
Users need answers to these critical questions:
1. "Is the garden healthy?"
2. "Is something wrong?"
3. "Is performance improving or degrading?"
4. "Can I trust this system without checking physically?"

## Core Features (MVP)

### 1. Installation & Garden Overview
- High-level health status across all installations
- Quick access to individual garden performance
- Visual representation of system topology

### 2. Live Environmental Metrics
- Real-time display of key environmental parameters
- Status indicators (healthy, warning, critical)
- Current values with context

### 3. Historical Charts
- Time-range selection: 24h / 7d / 30d
- Trend visualization with ideal range overlays
- Anomaly highlighting

### 4. Zone-Level Detail Views
- Granular metrics per zone
- Zone-specific insights
- Plant type and exposure information

### 5. Alerts & Insights Feed
- Chronological timeline of system events
- Severity-based filtering
- Actionable recommendations

### 6. Plain-English Explanations
- No jargon or technical codes
- Context-aware interpretations
- Confidence levels for insights

## Non-Goals (for MVP)
The following are explicitly **out of scope** for the initial release:
- Manual control of irrigation or lighting systems
- Native mobile applications (iOS/Android)
- Advanced ML or computer vision analysis
- Full Building Management System (BMS) integration
- Historical data export/reporting

## Demo Requirements
For investor and stakeholder demonstrations, the system must exhibit:

### 1. Continuous Live-Updating Data
- Data refreshes every 1-5 minutes
- Smooth transitions and animations
- No visible "loading" states during updates

### 2. Believable Biological Behavior
- Metrics follow natural daily cycles
- Gradual trends over time
- Realistic response to simulated events

### 3. Occasional Anomalies
- Rare but plausible issues (e.g., low moisture)
- System demonstrates detection capabilities
- Recovery patterns after anomalies

### 4. Clear Insight Narratives
- Every alert has a plain-English explanation
- Insights reference zone characteristics
- Confidence levels build trust

## Success Metrics
- **Demo effectiveness**: Can stakeholders understand system health in < 30 seconds?
- **Trust building**: Do users feel confident without physical inspection?
- **Engagement**: Average session duration > 3 minutes
- **Clarity**: Zero questions about metric meanings during demos

## Future Roadmap (Post-MVP)
- Real sensor integration via IoT gateway
- Mobile native applications
- Advanced predictive analytics
- Multi-site management
- Custom alerting rules
- Integration with BMS/HVAC systems
