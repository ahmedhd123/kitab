// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import utilities and middleware
const DatabaseUtils = require('../src/utils/database');
const { globalErrorHandler, notFoundHandler } = require('../src/middleware/errorHandler');
const { sanitize } = require('../src/middleware/validate');

// Import routes
const authRoutes = require('../src/routes/auth');
const userRoutes = require('../src/routes/users');
const bookRoutes = require('../src/routes/books');
const reviewRoutes = require('../src/routes/reviews');
const adminRoutes = require('../src/routes/admin');
const freebooksRoutes = require('../src/routes/freebooks');
const aiRoutes = require('../src/routes/ai');

// Create Express app
const app = express();

/**
 * CORS Configuration for Production
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
    'https://kitabi.vercel.app',
    'https://kitabi-frontend.vercel.app',
    'http://localhost:3000'
  ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

/**
 * Global Middleware
 */
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(sanitize);

/**
 * Health Check Route
 */
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await DatabaseUtils.isConnected();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/freebooks', freebooksRoutes);
app.use('/api/ai', aiRoutes);

/**
 * Root route
 */
app.get('/', (req, res) => {
  res.json({
    message: '📚 Kitabi Backend API',
    version: '1.0.0',
    status: 'Running on Vercel',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      books: '/api/books',
      users: '/api/users',
      reviews: '/api/reviews',
      admin: '/api/admin',
      ai: '/api/ai'
    }
  });
});

/**
 * Error Handling
 */
app.use(notFoundHandler);
app.use(globalErrorHandler);

/**
 * Initialize Database Connection
 */
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database connection...');
    await DatabaseUtils.connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

// Initialize database on cold start
initializeDatabase();

module.exports = app;
