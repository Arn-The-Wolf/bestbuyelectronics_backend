# ⚡ Quick Deploy - Tanzania Tech Nexus

## 🎯 You're Ready to Deploy!

I found your DATABASE_URL in the .env file! Everything is configured and ready for deployment.

### ✅ What's Ready:
- ✅ Backend .env with Supabase DATABASE_URL
- ✅ Frontend .env with new Supabase credentials  
- ✅ All environment variables prepared
- ✅ Deployment guides created

---

## 🚀 Deploy Now (5 minutes total)

### Step 1: Deploy Backend to Render (3 minutes)

1. **Go to Render:** https://dashboard.render.com/
2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Add Environment Variables** (copy from [RENDER_ENV_VARIABLES.md](./RENDER_ENV_VARIABLES.md)):
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

4. **Deploy** → Copy your backend URL (e.g., `https://tanzania-tech-nexus-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel (2 minutes)

1. **Go to Vercel:** https://vercel.com/
2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - **Root Directory:** `frontend`

3. **Add Environment Variables** (copy from [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SUPABASE_PROJECT_ID=oskmwettgeiejhhjtxym
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
   VITE_SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
   ```

4. **Deploy** → Copy your frontend URL

### Step 3: Update Cross-References

1. **Update Backend FRONTEND_URL:**
   - Go to Render → Your service → Environment
   - Update `FRONTEND_URL` with your Vercel URL
   - Redeploy

2. **Update Frontend API_URL:**
   - Go to Vercel → Your project → Settings → Environment Variables
   - Update `VITE_API_URL` with your Render backend URL
   - Redeploy

---

## ✅ Test Your Live App

### Backend Health Check:
```bash
curl https://your-backend-url.onrender.com/api/health
# Should return: {"status":"ok","message":"Server is running"}
```

### Frontend Test:
1. Visit your Vercel URL
2. Check homepage loads with products
3. Try creating account with `+255684868946` (admin access)
4. Test admin dashboard

---

## 🎉 You're Live!

Your e-commerce platform is now deployed and ready for customers!

### What's Working:
- 🛍️ Product catalog
- 🛒 Shopping cart & checkout
- 👤 User authentication
- 📱 Admin dashboard
- 💬 Real-time chat
- 📦 Order management
- 📚 **Swagger API Documentation** at `/api-docs`

### API Documentation:
- **Local:** http://localhost:3001/api-docs
- **Production:** https://your-backend-url.onrender.com/api-docs

### Next Steps:
- Add your products via admin dashboard
- Configure payment methods
- Set up domain name
- Add SSL certificate (automatic on Vercel/Render)
- **Test API endpoints** using Swagger UI

**Need help?** Check the logs in Render/Vercel dashboards, visit the API documentation, or ask for assistance!