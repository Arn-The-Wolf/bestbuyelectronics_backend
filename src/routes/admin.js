import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [productsResult, ordersResult, messagesResult, customersResult, reviewsResult] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM products'),
      db.query('SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue FROM orders'),
      db.query('SELECT COUNT(*) as count FROM chat_messages'),
      db.query('SELECT COUNT(*) as count FROM profiles'),
      db.query('SELECT COUNT(*) as count FROM reviews')
    ]);

    res.json({
      products: parseInt(productsResult.rows[0].count),
      orders: parseInt(ordersResult.rows[0].count),
      revenue: parseFloat(ordersResult.rows[0].revenue),
      messages: parseInt(messagesResult.rows[0].count),
      customers: parseInt(customersResult.rows[0].count),
      reviews: parseInt(reviewsResult.rows[0].count)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, ur.role 
       FROM profiles p
       LEFT JOIN user_roles ur ON p.id = ur.user_id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

