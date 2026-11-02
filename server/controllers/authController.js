const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Generate JWT token for user payload
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      wallet_address: user.wallet_address,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { full_name, email, password, role, wallet_address } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields (full_name, email, password, role) are required.' });
    }

    if (!['farmer', 'admin', 'buyer'].includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Role must be 'farmer', 'admin', or 'buyer'." });
    }

    // Check if email already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const insertResult = await db.query(
      'INSERT INTO users (full_name, email, password_hash, role, wallet_address) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role, wallet_address, created_at',
      [full_name.trim(), email.toLowerCase().trim(), password_hash, role.toLowerCase(), wallet_address || null]
    );

    const user = insertResult.rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const userPayload = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      wallet_address: user.wallet_address,
    };

    const token = generateToken(userPayload);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
}

/**
 * GET /api/auth/me
 */
async function getMe(req, res) {
  try {
    const result = await db.query('SELECT id, full_name, email, role, wallet_address, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/bind-wallet
 */
async function bindWallet(req, res) {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address || !wallet_address.startsWith('0x') || wallet_address.length !== 42) {
      return res.status(400).json({ success: false, message: 'Valid 42-character Ethereum address required.' });
    }

    await db.query('UPDATE users SET wallet_address = $1 WHERE id = $2', [wallet_address, req.user.id]);
    return res.json({ success: true, message: 'Wallet address bound successfully.', wallet_address });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/demo-switch
 * Instant 1-click evaluator role switcher (farmer | admin | buyer)
 */
async function demoSwitchRole(req, res) {
  try {
    const { role } = req.body;
    const targetRole = (role || 'admin').toLowerCase();

    const roleEmails = {
      farmer: 'ramesh@sunderbans.in',
      admin: 'admin@veriflow.org',
      buyer: 'esg@greenfuture.com',
    };

    const targetEmail = roleEmails[targetRole] || roleEmails['admin'];
    const result = await db.query('SELECT id, full_name, email, role, wallet_address FROM users WHERE email = $1', [targetEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Demo user for role ${targetRole} not found.` });
    }

    const user = result.rows[0];
    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Switched demo role to ${targetRole.toUpperCase()}`,
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  register,
  login,
  getMe,
  bindWallet,
  demoSwitchRole,
};
