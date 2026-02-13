import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get unread count
router.get('/unread', authenticateToken, async (req, res) => {
  try {
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );
    const isAdmin = roleCheck.rows.length > 0;

    let query = 'SELECT COUNT(*) FROM chat_messages WHERE is_read = FALSE';
    const params = [];

    if (isAdmin) {
      // Admin unread count (messages FROM users)
      query += ' AND is_from_admin = FALSE';
    } else {
      // User unread count (messages FROM admin)
      query += ' AND receiver_id = $1 AND is_from_admin = TRUE';
      params.push(req.user.userId);
    }

    const result = await db.query(query, params);
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all messages (user's own messages or all if admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );
    const isAdmin = roleCheck.rows.length > 0;

    let query = `
      SELECT cm.*, p.full_name 
      FROM chat_messages cm
      LEFT JOIN profiles p ON cm.sender_id = p.id
    `;

    const params = [];
    if (!isAdmin) {
      query += ' WHERE cm.sender_id = $1 OR cm.receiver_id = $1';
      params.push(req.user.userId);
    }

    query += ' ORDER BY cm.created_at ASC';

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, receiver_id, is_from_admin } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if user is admin
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );
    const isAdmin = roleCheck.rows.length > 0;

    const result = await db.query(
      'INSERT INTO chat_messages (sender_id, receiver_id, message, is_from_admin) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, receiver_id || null, message, isAdmin || is_from_admin || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.post('/mark-read', authenticateToken, async (req, res) => {
  try {
    const { sender_id } = req.body;

    // Check if user is admin
    const roleCheck = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
      [req.user.userId, 'admin']
    );
    const isAdmin = roleCheck.rows.length > 0;

    let query = 'UPDATE chat_messages SET is_read = TRUE WHERE is_read = FALSE';
    const params = [];

    if (isAdmin) {
      if (!sender_id) return res.status(400).json({ error: 'Sender ID required for admin' });
      // Admin marking user's messages as read
      query += ' AND sender_id = $1 AND receiver_id IS NULL';
      // Note: receiver_id might be null for messages to admin? 
      // Actually per previous insert: receiver_id is NULL for user->admin messages? 
      // Let's check insert: receiver_id || null. 
      // If user sends to admin, receiver_id is likely NULL or configured admin ID.
      // Re-reading insert: sender_id=$1, receiver_id=$2. 
      // Usually generic user->admin messages have receiver_id as NULL or specific admin.
      // Let's assume generic for now based on context, or refine logic.
      // Safer: "AND sender_id = $1 AND is_from_admin = FALSE"
      query = 'UPDATE chat_messages SET is_read = TRUE WHERE sender_id = $1 AND is_from_admin = FALSE AND is_read = FALSE';
      params.push(sender_id);
    } else {
      // User marking admin's messages as read
      query += ' AND receiver_id = $1 AND is_from_admin = TRUE';
      params.push(req.user.userId);
    }

    await db.query(query, params);
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

