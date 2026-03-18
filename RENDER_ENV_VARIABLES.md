# 🔧 Render Environment Variables

Copy and paste these environment variables into your Render web service:

## Backend Environment Variables for Render

```
NODE_ENV=production
PORT=10000
JWT_SECRET=7ab8a91c942927526d4213a76b992e11416d34f048d6353ff816f9d6e951
SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
SUPABASE_SERVICE_ROLE_KEY=5b96a2b7-7673-44ed-b7bb-7d22378fa4d2
DATABASE_URL=postgresql://postgres:Arn1122wolf!@db.oskmwettgeiejhhjtxym.supabase.co:5432/postgres
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## ⚠️ IMPORTANT: Add DATABASE_URL

You need to add one more environment variable with your Supabase database connection string:

**Key:** `DATABASE_URL`
**Value:** `postgresql://postgres:Arn1122wolf!@db.oskmwettgeiejhhjtxym.supabase.co:5432/postgres`

✅ **Your DATABASE_URL is ready!** I found it in your .env file.

---

## 📋 Step-by-Step Render Setup

### 1. Create Web Service
- Go to https://dashboard.render.com/
- Click "New +" → "Web Service"
- Connect your GitHub repository

### 2. Configure Service
- **Name:** `tanzania-tech-nexus-backend`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** `Free`

### 3. Add Environment Variables
Copy each variable above into Render's environment variables section:
- Click "Advanced" during setup
- Or go to "Environment" tab after creation
- Add each key-value pair

### 4. Deploy
- Click "Create Web Service"
- Wait for deployment (usually 3-5 minutes)
- Your backend will be available at: `https://tanzania-tech-nexus-backend.onrender.com`

---

## ✅ Verification

After deployment, test your backend:

```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Should return:
{"status":"ok","message":"Server is running"}
```

Check Render logs for:
- ✅ Database connection established
- ✅ Database migrations completed
- ✅ Server is running on port 10000