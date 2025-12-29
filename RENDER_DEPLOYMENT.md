# Deploying Breathe Again to Render

This guide will help you deploy both the frontend and backend to Render.

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

---

## Step 1: Deploy Backend (Node.js API)

### 1.1 Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name**: `breathe-again-db`
   - **Database**: `breathe_again`
   - **User**: `breathe_again_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **Create Database**
5. **Copy the Internal Database URL** (starts with `postgresql://`)

### 1.2 Deploy Backend Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `breathe-again-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**:
   - `DATABASE_URL` = (paste the Internal Database URL from Step 1.1)
   - `NODE_ENV` = `production`
   - `PORT` = `3001`

5. Click **Create Web Service**

6. **Wait for deployment** (5-10 minutes)

7. **Run Database Migration**:
   - Go to your service → **Shell** tab
   - Run: `npx prisma db push`
   - Run: `npx prisma db seed` (to populate initial data)

8. **Copy your backend URL** (e.g., `https://breathe-again-backend.onrender.com`)

---

## Step 2: Deploy Frontend (Static Site)

### 2.1 Deploy Frontend Service
1. Click **New** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `breathe-again-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable**:
   - `VITE_API_URL` = (your backend URL from Step 1.2.8)

5. Click **Create Static Site**

6. **Wait for deployment** (3-5 minutes)

7. **Your app is live!** Visit the provided URL

---

## Step 3: Configure CORS (Backend)

Update `backend/src/index.ts` to allow your frontend domain:

```typescript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://breathe-again-frontend.onrender.com', // Add your Render frontend URL
    ],
    credentials: true,
}));
```

Then commit and push to trigger a redeploy.

---

## Troubleshooting

### Backend Issues
- **Database connection fails**: Check DATABASE_URL is correct
- **Build fails**: Check Node version (use 18.x or 20.x)
- **Prisma errors**: Run `npx prisma generate` in Shell

### Frontend Issues
- **API calls fail**: Check VITE_API_URL is correct
- **CORS errors**: Update backend CORS configuration
- **Build fails**: Check all dependencies are in package.json

---

## Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime
- PostgreSQL database: 90 days retention

---

## Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Enable HTTPS (automatic on Render)
3. ✅ Set up monitoring and alerts
4. ✅ Configure automatic deployments on git push

Your Breathe Again monitoring system is now live! 🎉
