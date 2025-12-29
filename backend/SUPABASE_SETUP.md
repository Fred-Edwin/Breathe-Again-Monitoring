# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Breathe Again monitoring platform.

## Why Supabase?

- **Managed PostgreSQL**: No need to install PostgreSQL locally
- **Free Tier**: Perfect for development and demos
- **Built-in Tools**: Database GUI, SQL editor, and monitoring
- **Easy Scaling**: Can upgrade as your project grows

---

## Step-by-Step Setup

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up with:
   - GitHub (recommended)
   - Google
   - Email

### Step 2: Create New Project

1. After signing in, click **New Project**
2. Select or create an **Organization** (you can use the default one)
3. Fill in project details:
   - **Name**: `breathe-again-monitoring`
   - **Database Password**: 
     - Click the **Generate a password** button
     - **IMPORTANT**: Copy and save this password somewhere safe!
     - You'll need it for the connection string
   - **Region**: Choose the closest to your location:
     - East US (Ohio)
     - West US (N. California)
     - Europe (Frankfurt)
     - Asia Pacific (Singapore) 
     - etc.
   - **Pricing Plan**: Free (perfect for development)

4. Click **Create new project**
5. Wait 2-3 minutes for provisioning (you'll see a progress indicator)

### Step 3: Get Database Connection String

1. Once your project is ready, you'll see the project dashboard
2. Click the **Settings** icon (⚙️) in the left sidebar
3. Click **Database** in the settings menu
4. Scroll down to the **Connection string** section
5. Select the **URI** tab (not "Session mode" or "Transaction mode")
6. You'll see a connection string like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   Or:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
   ```

7. **Copy this entire string**
8. Replace `[YOUR-PASSWORD]` with the password you saved in Step 2

**Example:**
```
Before: postgresql://postgres:[YOUR-PASSWORD]@db.abc123xyz.supabase.co:5432/postgres
After:  postgresql://postgres:MyStr0ngP@ssw0rd!@db.abc123xyz.supabase.co:5432/postgres
```

### Step 4: Configure Backend

1. Navigate to your backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file (copy from example):
   ```bash
   cp .env.example .env
   ```

3. Open `.env` in your code editor

4. Paste your connection string:
   ```env
   DATABASE_URL="postgresql://postgres:YourPassword@db.xxx.supabase.co:5432/postgres"
   PORT=3001
   NODE_ENV=development
   ```

5. Save the file

### Step 5: Install Dependencies

```bash
npm install
```

This will install all required packages including Prisma.

### Step 6: Push Database Schema

```bash
npm run db:push
```

**What this does:**
- Reads your `prisma/schema.prisma` file
- Creates all tables in your Supabase database
- Sets up relationships and indexes

**Expected output:**
```
✔ Generated Prisma Client
✔ The database is now in sync with the Prisma schema
```

### Step 7: Verify Tables in Supabase

1. Go back to your Supabase project dashboard
2. Click **Table Editor** in the left sidebar
3. You should see these tables:
   - `installation`
   - `garden`
   - `zone`
   - `metric`
   - `metric_reading`
   - `insight`

### Step 8: Seed Initial Data

```bash
npm run db:seed
```

**What this does:**
- Creates 1 installation (Nairobi Green Tower)
- Creates 2 gardens
- Creates 10 zones
- Creates 4 metrics
- Generates 11,520 initial readings (24 hours of data)

**Expected output:**
```
🌱 Starting seed...
Clearing existing data...
✓ Cleared existing data
Creating installation...
✓ Created installation: Nairobi Green Tower
Creating gardens...
✓ Created 2 gardens
Creating zones...
✓ Created 10 zones
Creating metrics...
✓ Created 4 metrics
Creating initial metric readings (24 hours)...
✓ Created 11520 metric readings
✅ Seed completed successfully!
```

### Step 9: Verify Data in Supabase

1. In Supabase **Table Editor**, click on different tables
2. You should see data in each table
3. Check `metric_reading` table - should have ~11,520 rows

### Step 10: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
🌿 API endpoints:
   - GET http://localhost:3001/api/installations
   - GET http://localhost:3001/api/gardens
   - GET http://localhost:3001/api/zones
   - GET http://localhost:3001/api/metrics
```

### Step 11: Test API

Open your browser and visit:
- http://localhost:3001/health
- http://localhost:3001/api/installations
- http://localhost:3001/api/zones

You should see JSON data!

---

## Useful Supabase Features

### Table Editor
- View and edit data directly
- Add/delete rows
- Filter and search

### SQL Editor
- Run custom SQL queries
- Create views
- Analyze data

### Database Monitoring
- View connection count
- Monitor query performance
- Check database size

### Prisma Studio (Alternative)
You can also use Prisma Studio to view/edit data:
```bash
npm run db:studio
```
Opens at http://localhost:5555

---

## Troubleshooting

### "Can't reach database server"
- Check your internet connection
- Verify the connection string is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check if your Supabase project is active (not paused)

### "Password authentication failed"
- Double-check your password
- If password has special characters, make sure they're properly encoded
- Try resetting the database password in Supabase settings

### "SSL connection required"
Supabase requires SSL. Your connection string should work by default, but if you have issues, add `?sslmode=require` to the end:
```
DATABASE_URL="postgresql://...?sslmode=require"
```

### "Too many connections"
Free tier has connection limits. Make sure to:
- Close Prisma Studio when not using it
- Restart your dev server if it's been running a long time

### Reset Everything
If you need to start fresh:
```bash
# Clear all data
npm run db:push -- --force-reset

# Re-seed
npm run db:seed
```

---

## Next Steps

✅ **Phase 1 Complete!** You now have:
- Working Supabase database
- All tables created
- Realistic seed data
- Running API server

**Next**: Phase 2 - Mock Data Engine (continuous data generation)

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
