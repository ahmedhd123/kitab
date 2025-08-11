/**
 * Authentication Routes
 * Enhanced authentication with MongoDB and sample data fallback
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Load sample users for fallback authentication
let sampleUsers = [];
try {
  const sampleUsersPath = path.join(__dirname, '../../data/sample-users.json');
  if (fs.existsSync(sampleUsersPath)) {
    const data = fs.readFileSync(sampleUsersPath, 'utf8');
    sampleUsers = JSON.parse(data).users || [];
    console.log(`📚 Loaded ${sampleUsers.length} sample users for authentication`);
  }
} catch (error) {
  console.log('⚠️  Could not load sample users:', error.message);
}

// Check if MongoDB is connected
const isMongoConnected = () => {
  try {
    return require('mongoose').connection.readyState === 1;
  } catch (error) {
    return false;
  }
};

/**
 * Public Routes
 */

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

/**
 * Protected Routes (require authentication)
 */

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, authController.getProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, authController.logout);

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, authController.changePassword);

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh-token', auth, authController.refreshToken);

// Alternative refresh route for backward compatibility
router.post('/refresh', auth, authController.refreshToken);

/**
 * Utility Routes
 */

// @route   GET /api/auth/health
// @desc    Authentication service health check
// @access  Public
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Authentication',
    status: 'operational',
    database: {
      connected: isMongoConnected(),
      fallback: 'sample-users.json'
    },
    features: {
      registration: true,
      login: true,
      profileManagement: true,
      tokenRefresh: true
    },
    sampleData: {
      usersLoaded: sampleUsers.length,
      adminUser: 'admin@kitabi.com / admin123'
    },
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/auth/config
// @desc    Get authentication configuration
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: {
      passwordMinLength: 6,
      usernamePattern: '^[a-zA-Z0-9_]+$',
      tokenExpiry: process.env.JWT_EXPIRES_IN || '7d',
      emailVerificationRequired: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',
      passwordResetExpiry: '1h',
      maxLoginAttempts: 5,
      lockoutDuration: '15m'
    },
    validation: {
      email: 'Valid email address required',
      password: 'Minimum 6 characters',
      username: 'Letters, numbers, and underscores only (3-30 chars)'
    },
    isDemoMode: !isMongoConnected()
  });
});

module.exports = router;
