import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'Product ID and Rating are required' });
    }

    // Check if user has already reviewed this product? (Optional: let them review multiple times or update? Standard is one per product)
    // For simplicity, let's allow multiple for now or just insert.

    const result = await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, req.user.userId, rating, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reviews by product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const query = `
      SELECT r.*, p.full_name 
      FROM reviews r
      LEFT JOIN profiles p ON r.user_id = p.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;

    const result = await db.query(query, [productId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all reviews (for Admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    // Check admin
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );
    if (roleCheck.rows.length === 0) return res.status(403).json({ error: 'Not authorized' });

    // Join with product name for admin convenience
    const query = `
        SELECT r.*, p.full_name, pr.name as product_name
        FROM reviews r
        LEFT JOIN profiles p ON r.user_id = p.id
        LEFT JOIN products pr ON r.product_id = pr.id
        ORDER BY r.created_at DESC
      `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
