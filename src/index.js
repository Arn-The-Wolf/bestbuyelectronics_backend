import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db/index.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import ordersRoutes from './routes/orders.js';

import reviewsRoutes from './routes/reviews.js';
import chatRoutes from './routes/chat.js';
import couponsRoutes from './routes/coupons.js';
import profilesRoutes from './routes/profiles.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import { setupWebSocket } from './websocket/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Create HTTP server
const server = createServer(app);

// Setup WebSocket for real-time chat
setupWebSocket(server);

// Initialize database and start server
// Start server immediately to satisfy Render's port binding requirement
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Initialize database after server starts
  db.init().then(() => {
    console.log('Database initialized successfully');
  }).catch((error) => {
    console.error('Failed to initialize database:', error);
    // Don't exit process, just log error - API endpoints needing DB will fail but server stays up
  });
});

export default app;
