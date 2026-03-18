import express from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM profiles WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { full_name, email, phone, address, city, countryCode, phoneNumber } = req.body;

    // Support both old format (full phone) and new format (countryCode + phoneNumber)
    let finalPhone = phone;
    if (countryCode && phoneNumber) {
      // Combine country code and phone number, remove any non-digit characters from phoneNumber
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      finalPhone = `${countryCode}${cleanPhoneNumber}`;
    }

    // Normalize phone number if provided
    let normalizedPhone = finalPhone;
    if (finalPhone) {
      normalizedPhone = finalPhone.replace(/\s+/g, '').replace(/[-\s]/g, '');
      // Validate phone number format
      if (!normalizedPhone.match(/^\+\d{6,15}$/)) {
        return res.status(400).json({ error: 'Invalid phone number format. Please include country code (e.g., +255123456789)' });
      }
    }

    const result = await db.query(
      `INSERT INTO profiles (id, full_name, email, phone, address, city)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) 
       DO UPDATE SET full_name = $2, email = $3, phone = $4, address = $5, city = $6, updated_at = NOW()
       RETURNING *`,
      [req.user.userId, full_name || null, email || null, normalizedPhone || null, address || null, city || null]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

