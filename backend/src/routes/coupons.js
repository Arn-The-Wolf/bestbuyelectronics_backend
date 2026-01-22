import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active coupons (public)
router.get('/active', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM coupons WHERE is_active = true AND valid_until > NOW() ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get active coupons error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all coupons (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, amount } = req.body;

    const result = await db.query(
      'SELECT * FROM coupons WHERE code = $1 AND is_active = true AND valid_until > NOW()',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }

    const coupon = result.rows[0];

    if (amount < coupon.min_purchase_amount) {
      return res.status(400).json({ 
        error: `Minimum purchase amount is ${coupon.min_purchase_amount}` 
      });
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ error: 'Coupon has reached maximum uses' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create coupon (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, discount_percentage, discount_amount, min_purchase_amount, max_uses, valid_until } = req.body;

    const result = await db.query(
      `INSERT INTO coupons (code, discount_percentage, discount_amount, min_purchase_amount, max_uses, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [code, discount_percentage, discount_amount || null, min_purchase_amount || 0, max_uses || null, valid_until]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete coupon (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM coupons WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

