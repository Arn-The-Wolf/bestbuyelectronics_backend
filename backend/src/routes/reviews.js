import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all reviews (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, 
              p.full_name,
              pr.name as product_name
       FROM reviews r
       LEFT JOIN profiles p ON r.user_id = p.id
       LEFT JOIN products pr ON r.product_id = pr.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, p.full_name 
       FROM reviews r
       LEFT JOIN profiles p ON r.user_id = p.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.productId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const result = await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id, user_id) 
       DO UPDATE SET rating = $3, comment = $4, created_at = NOW()
       RETURNING *`,
      [product_id, req.user.userId, rating, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review (admin or owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin or owner
    const reviewResult = await db.query('SELECT user_id FROM reviews WHERE id = $1', [req.params.id]);
    if (reviewResult.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const isOwner = reviewResult.rows[0].user_id === req.user.userId;
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );
    const isAdmin = roleCheck.rows.length > 0;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

