# Quick Start Guide

## Get Backend Running in 5 Minutes

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Sign up/Login
- Create new project: `breathe-again-monitoring`
- Save the database password!

### 2. Get Connection String
- Supabase Dashboard → Settings → Database
- Copy URI connection string
- Replace `[YOUR-PASSWORD]` with your password

### 3. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env and paste your DATABASE_URL
npm install
npm run db:push
npm run db:seed
npm run dev
```

### 4. Test
Open: http://localhost:3001/api/installations

✅ You should see JSON data!

---

## Useful Commands

```bash
# Development
npm run dev              # Start server with hot reload
npm run db:studio        # Open database GUI

# Database
npm run db:push          # Update database schema
npm run db:seed          # Add sample data
npm run db:push -- --force-reset  # Reset database

# Testing
curl http://localhost:3001/health
curl http://localhost:3001/api/zones
```

---

## API Endpoints

- `GET /health` - Server status
- `GET /api/installations` - All installations
- `GET /api/gardens` - All gardens
- `GET /api/zones` - All zones
- `GET /api/metrics` - All metrics

**With filters:**
- `GET /api/gardens?installationId=<id>`
- `GET /api/zones?gardenId=<id>`
- `GET /api/zones?include=readings`

---

## Need Help?

See detailed guides:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete Supabase setup
- [README.md](./README.md) - Full backend documentation
