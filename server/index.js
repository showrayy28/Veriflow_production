const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const plotRoutes = require('./routes/plotRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: origin not allowed.'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    // console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'resilient_in_memory_store';
  if (db.pool) {
    try {
      await db.query('SELECT 1');
      dbStatus = 'connected_postgresql';
    } catch (err) {
      dbStatus = `db_connection_error: ${err.message}`;
    }
  }

  res.json({
    status: 'ONLINE',
    service: 'VeriFlow Web 2.0 API',
    version: '2.0.0',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api', verifyRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌊 VeriFlow Web 2.0 Backend Server Running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🛰️ Satellite MRV: Zero-Image NASA POWER Engine Active`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
