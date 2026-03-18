# 🚀 Tanzania Tech Nexus - Backend API

Node.js backend for Tanzania Tech Nexus e-commerce platform with comprehensive Swagger documentation.

## 📚 API Documentation

**Interactive Swagger UI:** `/api-docs`
- **Local:** http://localhost:3001/api-docs
- **Production:** https://your-backend-url.onrender.com/api-docs

## 🚀 Quick Deploy to Render

### 1. Deploy Backend
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect this GitHub repository: `bestbuyelectronics_backend`
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 18+

### 2. Environment Variables
Add these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=7ab8a91c942927526d4213a76b992e11416d34f048d6353ff816f9d6e951
SUPABASE_URL=https://oskmwettgeiejhhjtxym.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za213ZXR0Z2VpZWpoaGp0eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDAzNzEsImV4cCI6MjA4NjMxNjM3MX0.qBBGHEiIy27K7AAdGaIlarx54gizkw41gEmB2HSIR5I
SUPABASE_SERVICE_ROLE_KEY=5b96a2b7-7673-44ed-b7bb-7d22378fa4d2
DATABASE_URL=postgresql://postgres:Arn1122wolf!@db.oskmwettgeiejhhjtxym.supabase.co:5432/postgres
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 3. Deploy
- Click "Create Web Service"
- Wait for deployment (3-5 minutes)
- Copy your backend URL

## 🔧 Local Development

```bash
npm install
cp .env.example .env
# Add your environment variables
npm run dev
```

## 📊 Features

- 🔐 JWT Authentication
- 📱 RESTful API
- 💬 WebSocket Chat
- 📚 Swagger Documentation
- 🗄️ PostgreSQL Database
- 📁 File Upload Support
- 👤 Role-based Access Control

## 🛡️ Security

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- SQL injection prevention
- CORS protection

## 📈 Endpoints

- **Auth:** `/api/auth/*`
- **Products:** `/api/products/*`
- **Orders:** `/api/orders/*`
- **Categories:** `/api/categories/*`
- **Reviews:** `/api/reviews/*`
- **Chat:** `/api/chat/*`
- **Admin:** `/api/admin/*`

**Full documentation at `/api-docs`**