# 🌐 Vercel Environment Variables

Copy and paste these environment variables into your Vercel project:

## Frontend Environment Variables for Vercel

```
VITE_SUPABASE_PROJECT_ID=oskmwettgeiejhhjtxym
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
VITE_SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
```

## ⚠️ IMPORTANT: Add API URL

You need to add one more environment variable after deploying your backend:

**Key:** `VITE_API_URL`
**Value:** `https://your-backend-url.onrender.com/api`

Replace `your-backend-url` with your actual Render backend URL.

---

## 📋 Step-by-Step Vercel Setup

### 1. Import Project
- Go to https://vercel.com/
- Click "Add New..." → "Project"
- Import your GitHub repository

### 2. Configure Project
- **Framework Preset:** `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3. Add Environment Variables
During setup or in project settings:
- Add each variable from above
- Add `VITE_API_URL` after backend deployment

### 4. Deploy
- Click "Deploy"
- Wait for build and deployment (usually 2-3 minutes)
- Your frontend will be available at: `https://your-project-name.vercel.app`

---

## 🔄 Post-Deployment Updates

### After Backend Deployment:
1. Copy your Render backend URL
2. Go to Vercel project settings
3. Add/update `VITE_API_URL` environment variable
4. Redeploy frontend

### After Frontend Deployment:
1. Copy your Vercel frontend URL
2. Go to Render service settings
3. Update `FRONTEND_URL` environment variable
4. Redeploy backend

---

## ✅ Verification

After deployment, test your frontend:

1. **Visit your Vercel URL**
2. **Check console for errors** (F12 → Console)
3. **Test API connection:**
   - Try loading products on homepage
   - Attempt login/signup
   - Check if admin dashboard loads

### Common Issues:

**CORS Errors:**
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Redeploy backend after updating

**API Connection Failed:**
- Verify `VITE_API_URL` points to correct Render backend
- Check backend health endpoint is working
- Ensure backend is deployed and running

**Build Failures:**
- Check all dependencies are in `package.json`
- Verify Node.js version compatibility (18+)