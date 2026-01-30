import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, featured } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category && category !== 'all') {
      query += ` AND category_id = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (search) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (featured === 'true') {
      query += ` AND is_featured = true`;
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else {
      query += ' ORDER BY name ASC';
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM products WHERE is_featured = true ORDER BY created_at DESC LIMIT 8'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, discount_price, stock, category_id, image_url, images, media, brand, specifications, is_featured } = req.body;


    const result = await db.query(
      `INSERT INTO products (name, description, price, discount_price, stock, category_id, image_url, images, media, brand, specifications, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [name, description, price, discount_price || null, stock || 0, category_id || null, image_url || null, images || null, media ? JSON.stringify(media) : null, brand || null, specifications ? JSON.stringify(specifications) : null, is_featured || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, discount_price, stock, category_id, image_url, images, media, brand, specifications, is_featured } = req.body;

    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, discount_price = $4, stock = $5, 
           category_id = $6, image_url = $7, images = $8, media = $9, brand = $10, specifications = $11, is_featured = $12
       WHERE id = $13 RETURNING *`,
      [name, description, price, discount_price || null, stock, category_id || null, image_url || null, images || null, media ? JSON.stringify(media) : null, brand || null, specifications ? JSON.stringify(specifications) : null, is_featured || false, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

