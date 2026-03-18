import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all orders (user's own or all if admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );
    const isAdmin = roleCheck.rows.length > 0;

    let query = `
      SELECT o.*, 
             p.full_name,
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'products', json_build_object(
                   'name', pr.name,
                   'image_url', pr.image_url
                 )
               )
             ) FILTER (WHERE oi.id IS NOT NULL) as order_items
      FROM orders o
      LEFT JOIN profiles p ON o.user_id = p.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products pr ON oi.product_id = pr.id
    `;

    const params = [];
    let paramCount = 1;

    if (!isAdmin) {
      // Regular user - only their orders
      query += ` WHERE o.user_id = $${paramCount}`;
      params.push(req.user.userId);
      paramCount++;
    }

    query += ' GROUP BY o.id, p.full_name ORDER BY o.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Check if user owns the order or is admin
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );

    if (order.user_id !== req.user.userId && roleCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const itemsResult = await db.query(
      `SELECT oi.*, p.name as product_name, p.image_url as product_image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    res.json({
      ...order,
      order_items: itemsResult.rows
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, shipping_address, phone, coupon_code, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const productResult = await db.query('SELECT price, discount_price, stock FROM products WHERE id = $1', [item.product_id]);
      if (productResult.rows.length === 0) {
        return res.status(400).json({ error: `Product ${item.product_id} not found` });
      }
      const product = productResult.rows[0];
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.product_id}` });
      }
      const price = product.discount_price || product.price;
      total += price * item.quantity;
    }

    // Apply coupon if provided
    let discount_amount = 0;
    if (coupon_code) {
      const couponResult = await db.query(
        'SELECT * FROM coupons WHERE code = $1 AND is_active = true AND valid_until > NOW()',
        [coupon_code]
      );
      if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];
        if (total >= coupon.min_purchase_amount) {
          if (coupon.discount_percentage) {
            discount_amount = total * (coupon.discount_percentage / 100);
          } else if (coupon.discount_amount) {
            discount_amount = coupon.discount_amount;
          }
          total -= discount_amount;
        }
      }
    }

    // Create order
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, phone, coupon_code, discount_amount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [req.user.userId, total, shipping_address, phone, coupon_code || null, discount_amount, payment_method || 'cash_on_delivery']
    );
    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of items) {
      const productResult = await db.query('SELECT price, discount_price FROM products WHERE id = $1', [item.product_id]);
      const product = productResult.rows[0];
      const price = product.discount_price || product.price;

      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, price]
      );

      // Update stock
      await db.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order tracking (admin only)
router.patch('/:id/tracking', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { tracking_number, tracking_url, estimated_delivery } = req.body;
    const result = await db.query(
      'UPDATE orders SET tracking_number = $1, tracking_url = $2, estimated_delivery = $3 WHERE id = $4 RETURNING *',
      [tracking_number || null, tracking_url || null, estimated_delivery || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order tracking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

