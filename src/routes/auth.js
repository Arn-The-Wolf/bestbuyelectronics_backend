import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+255123456789"
 *                 description: Full phone number with country code
 *               countryCode:
 *                 type: string
 *                 example: "+255"
 *                 description: Country code (alternative to full phone)
 *               phoneNumber:
 *                 type: string
 *                 example: "123456789"
 *                 description: Phone number without country code
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "password123"
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     phone:
 *                       type: string
 *                       example: "+255123456789"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */

// Register
router.post('/signup', async (req, res) => {
  try {
    const { phone, password, fullName, countryCode, phoneNumber, confirmPassword } = req.body;

    // Validate required fields
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate confirm password (if provided)
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Support both old format (full phone) and new format (countryCode + phoneNumber)
    let finalPhone = phone;
    if (countryCode && phoneNumber) {
      // Combine country code and phone number, remove any non-digit characters from phoneNumber
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      finalPhone = `${countryCode}${cleanPhoneNumber}`;
    }

    if (!finalPhone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Normalize phone number: remove spaces, keep + and digits
    const normalizedPhone = finalPhone.replace(/\s+/g, '').replace(/[-\s]/g, '');
    
    // Validate phone number format (should start with + and have at least 10 digits)
    if (!normalizedPhone.match(/^\+\d{6,15}$/)) {
      return res.status(400).json({ error: 'Invalid phone number format. Please include country code (e.g., +255123456789)' });
    }

    // Check if user exists (check both normalized and original format)
    const existingUser = await db.query(
      'SELECT id FROM users WHERE phone = $1 OR phone = $2',
      [normalizedPhone, finalPhone]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (store normalized phone)
    const userResult = await db.query(
      'INSERT INTO users (phone, password_hash) VALUES ($1, $2) RETURNING id',
      [normalizedPhone, passwordHash]
    );
    const userId = userResult.rows[0].id;

    // Create profile
    await db.query(
      'INSERT INTO profiles (id, full_name, phone) VALUES ($1, $2, $3)',
      [userId, fullName || null, normalizedPhone]
    );

    // Normalize phone number for admin check (remove + and all non-digits)
    const adminCheckPhone = normalizedPhone.replace(/\D/g, '');
    
    // Create user role (admin if phone is 255684868946, otherwise customer)
    const role = adminCheckPhone === '255684868946' ? 'admin' : 'customer';
    await db.query(
      'INSERT INTO user_roles (user_id, role) VALUES ($1, $2)',
      [userId, role]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, phone: normalizedPhone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: userId, phone: normalizedPhone }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+255123456789"
 *               countryCode:
 *                 type: string
 *                 example: "+255"
 *               phoneNumber:
 *                 type: string
 *                 example: "123456789"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password, countryCode, phoneNumber } = req.body;

    // Validate required fields
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Support both old format (full phone) and new format (countryCode + phoneNumber)
    let finalPhone = phone;
    if (countryCode && phoneNumber) {
      // Combine country code and phone number, remove any non-digit characters from phoneNumber
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      finalPhone = `${countryCode}${cleanPhoneNumber}`;
    }

    if (!finalPhone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Normalize phone number: remove spaces, keep + and digits
    const normalizedPhone = finalPhone.replace(/\s+/g, '').replace(/[-\s]/g, '');
    
    // Validate phone number format
    if (!normalizedPhone.match(/^\+\d{6,15}$/)) {
      return res.status(400).json({ error: 'Invalid phone number format. Please include country code (e.g., +255123456789)' });
    }

    // Find user (check normalized format - phone is stored normalized in DB)
    const userResult = await db.query(
      'SELECT id, phone, password_hash FROM users WHERE phone = $1',
      [normalizedPhone]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    
    // Normalize phone number for admin check (remove + and all non-digits)
    const adminCheckPhone = normalizedPhone.replace(/\D/g, '');
    
    // Ensure admin role is set for admin phone number
    if (adminCheckPhone === '255684868946') {
      const roleCheck = await db.query(
        'SELECT role FROM user_roles WHERE user_id = $1 AND role = $2',
        [user.id, 'admin']
      );
      if (roleCheck.rows.length === 0) {
        // Remove any existing customer role and add admin role
        await db.query('DELETE FROM user_roles WHERE user_id = $1', [user.id]);
        await db.query(
          'INSERT INTO user_roles (user_id, role) VALUES ($1, $2)',
          [user.id, 'admin']
        );
      }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, phone: user.phone }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - $ref: '#/components/schemas/Profile'
 *                     - type: object
 *                       properties:
 *                         role:
 *                           type: string
 *                           enum: [admin, customer]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userResult = await db.query(
      'SELECT id, phone, email, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileResult = await db.query('SELECT * FROM profiles WHERE id = $1', [req.user.userId]);
    const roleResult = await db.query('SELECT role FROM user_roles WHERE user_id = $1 LIMIT 1', [req.user.userId]);

    const user = {
      ...userResult.rows[0],
      ...profileResult.rows[0],
      role: roleResult.rows[0]?.role || 'customer'
    };

    res.json({
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

