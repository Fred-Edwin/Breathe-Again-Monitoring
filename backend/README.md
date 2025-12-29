# Breathe Again - Backend Service

Backend API service for the Breathe Again biophilic systems monitoring platform.

## Overview

This backend provides:
- RESTful API for installations, gardens, zones, and metrics
- PostgreSQL database with Prisma ORM
- Mock data generation for realistic sensor readings
- Time-series data storage and retrieval

## Prerequisites

- Node.js v18 or higher
- Supabase account (free tier works fine)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project:
   - **Name**: breathe-again-monitoring
   - **Database Password**: Generate and save a strong password
   - **Region**: Choose closest to your location
3. Wait for project provisioning (2-3 minutes)

### 3. Get Database Connection String

1. In Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **Database** in the left sidebar
3. Scroll to **Connection string** section
4. Select **URI** tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual database password

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase connection string:

```env
DATABASE_URL="postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres"
PORT=3001
NODE_ENV=development
```

### 5. Push Database Schema

```bash
npm run db:push
```

This will create all tables in your Supabase database.

### 6. Seed Initial Data

```bash
npm run db:seed
```

This creates:
- 1 installation (Nairobi Green Tower)
- 2 gardens (Lobby Vertical Garden, Rooftop Garden)
- 10 zones (5 per garden)
- 4 metrics (soil_moisture, temperature, humidity, light)
- 11,520 initial readings (24 hours of data, every 5 minutes)

### 7. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3001

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:generate` - Generate Prisma Client

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Installations
```
GET /api/installations
GET /api/installations?include=gardens
GET /api/installations?include=gardens,zones
GET /api/installations/:id
```

### Gardens
```
GET /api/gardens
GET /api/gardens?installationId=<id>
GET /api/gardens?include=zones
GET /api/gardens/:id
```

### Zones
```
GET /api/zones
GET /api/zones?gardenId=<id>
GET /api/zones?include=readings
GET /api/zones/:id
```

### Metrics
```
GET /api/metrics
GET /api/metrics/:key
```

## Database Schema

### Entities
- **Installation**: Top-level site/building
- **Garden**: Biophilic system (vertical garden, green roof, etc.)
- **Zone**: Subsection of garden with specific plants
- **Metric**: Metric definitions (soil_moisture, temperature, etc.)
- **MetricReading**: Time-series sensor data
- **Insight**: Generated alerts and recommendations

### Relationships
```
Installation (1) ──< (N) Garden (1) ──< (N) Zone (1) ──< (N) MetricReading
                                                    └──< (N) Insight
```

## Development Tools

### Prisma Studio
View and edit database data in a GUI:
```bash
npm run db:studio
```
Opens at http://localhost:5555

### Database Reset
To clear all data and re-seed:
```bash
npm run db:push
npm run db:seed
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express server entry point
│   ├── routes/               # API route handlers
│   │   ├── installations.ts
│   │   ├── gardens.ts
│   │   ├── zones.ts
│   │   └── metrics.ts
│   ├── services/             # Business logic (future)
│   └── utils/                # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data script
├── .env                      # Environment variables (gitignored)
├── .env.example              # Example env file
├── package.json
├── tsconfig.json
└── README.md
```

## Testing API Endpoints

### Using curl
```bash
# Health check
curl http://localhost:3001/health

# Get all installations
curl http://localhost:3001/api/installations

# Get installations with gardens
curl http://localhost:3001/api/installations?include=gardens

# Get all zones with latest readings
curl http://localhost:3001/api/zones?include=readings
```

### Using Browser
Simply navigate to:
- http://localhost:3001/health
- http://localhost:3001/api/installations
- http://localhost:3001/api/gardens
- http://localhost:3001/api/zones
- http://localhost:3001/api/metrics

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check that your Supabase project is active
- Ensure your IP is not blocked by Supabase (check project settings)
- Try regenerating the connection string

### Prisma Issues
```bash
# Regenerate Prisma Client
npm run db:generate

# Reset database
npm run db:push -- --force-reset
npm run db:seed
```

### Port Already in Use
Change the PORT in your `.env` file:
```env
PORT=3002
```

## Next Steps

After Phase 1 is complete:
- **Phase 2**: Implement Mock Data Engine (background job to generate continuous readings)
- **Phase 3**: Build Rules & Insights Engine (automatic alert generation)
- **Phase 4**: Add time-series endpoints with pagination and aggregation

## Support

For issues or questions, refer to:
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com)
- [Supabase Documentation](https://supabase.com/docs)
