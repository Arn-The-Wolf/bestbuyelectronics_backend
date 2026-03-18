# 📚 Tanzania Tech Nexus - API Documentation

## 🚀 Interactive Swagger Documentation

Your API now includes comprehensive Swagger documentation! 

### Access Documentation:

**Local Development:**
```
http://localhost:3001/api-docs
```

**Production (after deployment):**
```
https://your-backend-url.onrender.com/api-docs
```

---

## 🔑 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token:

1. **Register:** `POST /api/auth/signup`
2. **Login:** `POST /api/auth/login`
3. Use the returned `token` in subsequent requests

---

## 📋 API Endpoints Overview

### 🔐 Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### 🛍️ Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### 📂 Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Get category details
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### 📦 Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create new order
- `PATCH /api/orders/{id}/status` - Update order status (Admin)
- `PATCH /api/orders/{id}/tracking` - Update tracking info (Admin)

### ⭐ Reviews
- `GET /api/reviews/product/{productId}` - Get product reviews
- `GET /api/reviews/all` - Get all reviews (Admin)
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/{id}` - Delete review (Admin)

### 💬 Chat
- `GET /api/chat` - Get chat messages
- `POST /api/chat` - Send message
- `POST /api/chat/mark-read` - Mark messages as read
- `GET /api/chat/unread` - Get unread count

### 🎫 Coupons
- `GET /api/coupons/active` - Get active coupons
- `GET /api/coupons` - Get all coupons (Admin)
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (Admin)
- `DELETE /api/coupons/{id}` - Delete coupon (Admin)

### 👤 Profiles
- `GET /api/profiles/me` - Get user profile
- `PUT /api/profiles/me` - Update user profile

### 📊 Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/customers` - List customers

### 📁 Upload
- `POST /api/upload` - Upload files (images/videos)

---

## 🔧 Example Requests

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+255123456789",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+255123456789",
    "password": "password123"
  }'
```

### Get Products
```bash
curl -X GET "http://localhost:3001/api/products?category=smartphones&featured=true"
```

### Create Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "product_id": "uuid-here",
        "quantity": 2,
        "price": 1299.99
      }
    ],
    "shipping_address": "123 Main St, Dar es Salaam",
    "phone": "+255123456789",
    "payment_method": "cash_on_delivery"
  }'
```

### Upload File
```bash
curl -X POST http://localhost:3001/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@product-image.jpg" \
  -F "type=product"
```

---

## 📱 WebSocket Connection

For real-time chat functionality:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws?token=YOUR_JWT_TOKEN');

// Send typing indicator
ws.send(JSON.stringify({
  type: 'typing',
  receiverId: 'user-uuid',
  isTyping: true
}));
```

---

## 🎯 Admin Features

### Admin Access
Use phone number `+255684868946` to create an admin account.

### Admin Endpoints
- All product management (CRUD)
- All category management (CRUD)
- Order status updates
- Customer management
- Review moderation
- Coupon management
- Dashboard statistics

---

## 🔍 Query Parameters

### Products Filtering
```
GET /api/products?category=uuid&search=iphone&sort=price_asc&featured=true
```

**Available sort options:**
- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `name_asc` - Name A-Z
- `name_desc` - Name Z-A
- `newest` - Newest first

---

## 📊 Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

### Pagination (where applicable)
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Role-based Access** - Admin vs Customer permissions
- **Input Validation** - express-validator middleware
- **CORS Protection** - Configured for frontend domain
- **SQL Injection Prevention** - Parameterized queries

---

## 🚀 Testing the API

### Using Swagger UI (Recommended)
1. Start your backend server
2. Visit `http://localhost:3001/api-docs`
3. Click "Authorize" and enter your JWT token
4. Test any endpoint directly from the browser

### Using Postman
1. Import the API collection (can be generated from Swagger)
2. Set up environment variables for base URL and token
3. Test all endpoints

### Using curl
See example requests above for curl commands.

---

## 📈 Rate Limiting & Performance

- **No rate limiting** currently implemented (add if needed)
- **Database connection pooling** via pg Pool
- **File upload limits** configured in multer
- **CORS** configured for production domains

---

## 🔧 Environment Variables

Make sure these are set in your deployment:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 📞 Support

- **Swagger Documentation:** `/api-docs`
- **Health Check:** `/api/health`
- **WebSocket Endpoint:** `/ws`

Your API is now fully documented and ready for development and production use! 🎉