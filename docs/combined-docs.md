1. PRD.md — Product Requirements Document
Product Name

Biophilic Systems Monitoring Dashboard (working name)

Product Vision

A web-based platform that allows clients to monitor, understand, and trust the performance of biophilic installations (starting with vertical gardens) through real-time metrics, historical trends, and intelligent insights.

The system is software-first and uses realistic simulated data in early stages, with a clean path to real sensor integration later.

Primary Goal

Create a highly convincing, real-time, investor-demo-ready dashboard that behaves like a real deployed system.

Target Users

Building owners

Facilities managers

Design stakeholders

Investors (demo mode)

Core User Needs

“Is the garden healthy?”

“Is something wrong?”

“Is performance improving or degrading?”

“Can I trust this system without checking physically?”

Core Features (MVP)

Installation & garden overview

Live environmental metrics

Historical charts (24h / 7d / 30d)

Zone-level detail views

Alerts & insights feed

Plain-English explanations of issues

Non-Goals (for MVP)

Manual control of irrigation or lighting

Native mobile apps

Advanced ML or computer vision

Full BMS integration

Demo Requirements

Continuous live-updating data

Believable biological behavior

Occasional anomalies

Clear insight narratives

2. SYSTEM_ARCHITECTURE.md
High-Level Architecture
[ Mock Data Engine ]
        ↓
[ Time-Series Data Store (Postgres) ]
        ↓
[ Rules & Insights Engine ]
        ↓
[ REST API ]
        ↓
[ Web Dashboard (React) ]

Key Principles

Hardware-agnostic

Data-driven UI

Mock data behaves like real sensor data

Frontend unaware of data source (mock vs real)

Backend Responsibilities

Store domain entities

Generate time-series readings

Evaluate rules

Produce insights

Serve API endpoints

Frontend Responsibilities

Visualize system health

Display live metrics

Render trends and charts

Surface insights clearly

Future Transition Plan

Mock data engine will be replaced by:

Device ingestion service

Same API contracts

Same database schema

No frontend changes

3. DATA_MODEL.md
Core Entities
Installation

Represents a real-world site.

id (uuid)

name

location

status

created_at

Garden

A biophilic system (e.g. vertical wall).

id

installation_id (FK)

name

type (vertical_garden)

orientation

size

created_at

Zone

A subsection of a garden.

id

garden_id (FK)

name

plant_type

exposure (low | medium | high)

created_at

Metric

Defines what is measured.

key (soil_moisture, temperature, humidity, light)

unit (% | °C | lux)

ideal_min

ideal_max

description

MetricReading (Time-Series)

Primary data table.

id

zone_id

metric_key

value

timestamp

source (mock | device)

Indexes:

(zone_id, metric_key, timestamp)

Insight

Generated interpretation.

id

zone_id

metric_key

severity (info | warning | critical)

explanation

confidence

created_at

4. MOCK_DATA_ENGINE.md
Purpose

Simulate a realistic network of environmental sensors for vertical gardens.

Design Principles

Continuous generation (not one-time seeding)

Biologically plausible ranges

Temporal coherence (no random jumps)

Config-driven behavior

Metrics & Ranges
Metric	Range
Soil moisture	20–45 %
Temperature	18–28 °C
Humidity	40–70 %
Light	500–3000 lux
Simulation Behavior
Daily Cycles

Sinusoidal variation

Light peaks mid-day

Temperature follows light

Moisture decreases between watering events

Slow Trends

Gradual drift over days

Seasonal-style variation

Zone Differences

Each zone has an offset factor

Exposure affects evaporation and light

Anomalies (rare)

Moisture not recovering after watering

Flatlined sensor values

Extended out-of-range conditions

Execution

Background job

Runs every 1–5 minutes

Writes new MetricReadings

Reads zone configuration from DB

5. RULES_AND_INSIGHTS.md
Rule Types
Threshold Rules

Value < ideal_min → warning

Value > ideal_max → warning

Duration Rules

Out of range for > X hours

No data for > Y minutes

Trend Rules

Downward trend over N days

Increasing variance

Insight Generation

Rules emit structured insights with:

Severity

Metric

Explanation

Confidence level

Example Insight

“Soil moisture in Zone B has remained below optimal for 48 hours.
This zone has higher airflow exposure, which may be increasing evaporation.”

Important Constraints

All insights must be explainable

No black-box predictions in MVP

6. API_CONTRACT.md
Core Endpoints
Installations

GET /installations

GET /installations/:id

Gardens

GET /gardens?installation_id=

Zones

GET /zones?garden_id=

Metrics

GET /metrics

Readings

GET /readings?zone_id=&metric=&from=&to=

Insights

GET /insights?zone_id=

GET /insights?severity=

Response Format

JSON

ISO timestamps

Paginated for time-series queries

7. FRONTEND_UX.md
Design Principles

Calm, natural, trustworthy

Status-first, numbers second

Minimal cognitive load

Target Devices

Mobile-first (primary)

Desktop-enhanced

Pages
Dashboard Overview

Overall health indicator

Zone status summary

Recent insights

Garden visualization

Live Metrics

Metric cards

Status color

Mini sparklines

Historical Charts

Time-range selector

Ideal range shading

Anomaly highlights

Zone Detail Page

Zone metadata

Live metrics

Trends

Active insights

Alerts & Insights Feed

Timeline view

Plain English explanations

Severity indicators

Mobile Behavior

Single-column layout

Card-based UI

Large tap targets

Desktop Enhancements

Multi-column layouts

Side-by-side charts

Persistent navigation

Final note (important)

These seven documents together form:

A complete cognitive map of the system