# Backend Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. **Configure the `.env` file**:
   - A `.env` file has been created in the `backend` directory
   - The default configuration uses PostgreSQL without a password
   - The file should look like this:
   ```env
   PORT=3001
   DATABASE_URL=postgresql://postgres@localhost:5432/tanzania_tech_nexus
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
   
   **If you have a PostgreSQL password**, update the `DATABASE_URL` to include it:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tanzania_tech_nexus
   ```
   
   **Note**: 
   - If your PostgreSQL username is different from `postgres`, replace it in the connection string
   - If you don't have a password (default Windows PostgreSQL setup), the connection string without password (as shown above) will work

3. Set up PostgreSQL:

   **Option A: Using PostgreSQL locally**
   - Install PostgreSQL if not already installed
   - Create the database:
   ```sql
   CREATE DATABASE tanzania_tech_nexus;
   ```
   - Default connection string format:
   ```
   postgresql://postgres:your_password@localhost:5432/tanzania_tech_nexus
   ```

   **Option B: Using a cloud database (Supabase, Railway, etc.)**
   - Get your connection string from your database provider
   - It should look like:
   ```
   postgresql://user:password@host:port/database
   ```

**Troubleshooting Database Connection:**
- If you see "role does not exist" error, check your PostgreSQL username in the DATABASE_URL
- Make sure PostgreSQL is running: `pg_isready` or check your PostgreSQL service
- Verify the database exists: `psql -U postgres -l` (lists all databases)
- Test connection: `psql -U postgres -d tanzania_tech_nexus`

4. Start the server:
```bash
npm run dev
```

The server will automatically run database migrations on startup.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Orders
- `GET /api/orders` - Get all orders (user's own or all if admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `PATCH /api/orders/:id/tracking` - Update order tracking (admin only)

### Reviews
- `GET /api/reviews` - Get all reviews (admin only)
- `GET /api/reviews/product/:productId` - Get reviews for a product
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

### Chat
- `GET /api/chat` - Get all messages
- `POST /api/chat` - Send message

### Coupons
- `GET /api/coupons/active` - Get active coupons
- `GET /api/coupons` - Get all coupons (admin only)
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (admin only)
- `DELETE /api/coupons/:id` - Delete coupon (admin only)

### Profiles
- `GET /api/profiles/me` - Get current user's profile
- `PUT /api/profiles/me` - Update current user's profile

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/customers` - Get all customers

## WebSocket

WebSocket server is available at `ws://localhost:3001/ws` for real-time chat functionality.

Connect with authentication token:
```
ws://localhost:3001/ws?token=YOUR_JWT_TOKEN
```
