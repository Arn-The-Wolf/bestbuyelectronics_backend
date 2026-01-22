import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

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

export default router;

