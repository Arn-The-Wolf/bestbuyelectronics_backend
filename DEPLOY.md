# 🚀 Deploy Backend to Render

## Quick Deploy Steps

### 1. Create Render Service
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `bestbuyelectronics_backend`

### 2. Configure Service
- **Name:** `tanzania-tech-nexus-backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free

### 3. Environment Variables
Copy these exactly:

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

### 4. Deploy
- Click "Create Web Service"
- Wait for build and deployment
- Your API will be available at: `https://your-service-name.onrender.com`

### 5. Test Deployment
- Health check: `https://your-backend-url.onrender.com/api/health`
- API docs: `https://your-backend-url.onrender.com/api-docs`

## ✅ Success Indicators
- Build completes without errors
- Health endpoint returns `{"status":"ok"}`
- Database migrations run successfully
- Swagger documentation loads

## 🔧 Update Frontend URL
After deploying frontend:
1. Go to Render service settings
2. Update `FRONTEND_URL` environment variable
3. Redeploy service