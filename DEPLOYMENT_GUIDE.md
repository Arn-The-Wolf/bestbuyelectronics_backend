# 🚀 Tanzania Tech Nexus - Deployment Guide

## Current Status ✅

Your application is ready for deployment with the new Supabase database!

### What's Been Updated:
- ✅ Backend `.env` configured with new Supabase credentials
- ✅ Frontend `.env` updated to match new Supabase project
- ✅ All environment variables prepared for Render deployment

---

## 🔑 Critical Step: Get Your DATABASE_URL

Before deploying, you need the PostgreSQL connection string from Supabase:

### Steps:
1. Go to: https://supabase.com/dashboard/project/oskmwettgeiejhhjtxym/settings/database
2. Scroll down to **"Connection string"** section
3. Click the **"URI"** tab
4. Copy the connection string
5. **Important:** Replace `[YOUR-PASSWORD]` with your actual database password

### Format:
```
postgresql://postgres.oskmwettgeiejhhjtxym:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 📦 Deploy Backend to Render

### Option 1: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard:** https://dashboard.render.com/
2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure Service:**
   - **Name:** `tanzania-tech-nexus-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=7ab8a91c942927526d4213a76b992e11416d34f048d6353ff816f9d6e951
   
   # Supabase Configuration
   SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
   SUPABASE_SERVICE_ROLE_KEY=5b96a2b7-7673-44ed-b7bb-7d22378fa4d2
   
   # Database URL (GET THIS FROM SUPABASE - see above)
   DATABASE_URL=postgresql://postgres.oskmwettgeiejhhjtxym:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   
   # Frontend URL (update after deploying frontend)
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://tanzania-tech-nexus-backend.onrender.com`)

### Option 2: Using render.yaml (Infrastructure as Code)

The `backend/render.yaml` file is already configured. You'll need to:

1. Update `render.yaml` with environment variables
2. Push to GitHub
3. Connect repository in Render dashboard
4. Render will auto-detect the `render.yaml` file

---

## 🌐 Deploy Frontend to Vercel

### Steps:

1. **Go to Vercel:** https://vercel.com/
2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables:**
   
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SUPABASE_PROJECT_ID=oskmwettgeiejhhjtxym
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
   VITE_SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment
   - Copy your frontend URL

6. **Update Backend FRONTEND_URL:**
   - Go back to Render dashboard
   - Update the `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend

---

## 🔄 Post-Deployment Steps

### 1. Test Backend Health
```bash
curl https://your-backend-url.onrender.com/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### 2. Test Database Connection
The backend will automatically run migrations on startup. Check Render logs for:
```
✅ Database connection established
Database migrations completed
```

### 3. Create Admin Account
Use your admin phone number: `+255684868946`
- Go to your frontend URL
- Click "Sign Up"
- Use phone: `+255684868946`
- Set a password
- This account will automatically have admin privileges

### 4. Test Frontend
- Visit your Vercel URL
- Try logging in
- Check if products load
- Test admin dashboard

---

## 🐛 Troubleshooting

### Backend Issues:

**Database Connection Failed:**
- Verify DATABASE_URL is correct
- Check password is properly replaced in connection string
- Ensure Supabase database is active

**CORS Errors:**
- Update `FRONTEND_URL` in Render to match your Vercel URL
- Redeploy backend after updating

**WebSocket Connection Failed:**
- Render free tier supports WebSockets
- Check if token is being passed correctly

### Frontend Issues:

**API Calls Failing:**
- Verify `VITE_API_URL` points to your Render backend URL
- Check backend is running and healthy
- Look for CORS errors in browser console

**Build Failures:**
- Check all dependencies are in `package.json`
- Verify Node version compatibility

---

## 📊 Environment Variables Summary

### Backend (Render):
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<from-supabase>
JWT_SECRET=7ab8a91c942927526d4213a76b992e11416d34f048d6353ff816f9d6e951
SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
SUPABASE_SERVICE_ROLE_KEY=5b96a2b7-7673-44ed-b7bb-7d22378fa4d2
FRONTEND_URL=<your-vercel-url>
```

### Frontend (Vercel):
```env
VITE_API_URL=<your-render-backend-url>/api
VITE_SUPABASE_PROJECT_ID=oskmwettgeiejhhjtxym
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
VITE_SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
```

---

## 🎉 You're Ready!

Once you provide the DATABASE_URL, you can:
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Update cross-references (FRONTEND_URL and VITE_API_URL)
4. Test your live application!

**Need Help?** Share any error messages or deployment logs and I'll help troubleshoot!
