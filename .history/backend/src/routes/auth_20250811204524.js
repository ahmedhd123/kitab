/**
 * Authentication Routes
 * Enhanced authentication with MongoDB and sample data fallback
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { authValidators } = require('../validators/authValidators');
const { auth, optionalAuth } = require('../middleware/auth');

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
router.post('/register', 
  validate(authValidators.register), 
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', 
  validate(authValidators.login), 
  authController.login
);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', 
  validate(authValidators.forgotPassword), 
  authController.forgotPassword
);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', 
  validate(authValidators.resetPassword), 
  authController.resetPassword
);

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', 
  validate(authValidators.verifyEmail), 
  authController.verifyEmail
);

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post('/resend-verification', 
  validate(authValidators.resendVerification), 
  authController.resendVerification
);

/**
 * Protected Routes (require authentication)
 */

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, authController.getProfile);

// @route   PUT /api/auth/me
// @desc    Update current user profile
// @access  Private
router.put('/me', 
  auth, 
  validate(authValidators.updateProfile), 
  authController.updateProfile
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, authController.logout);

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', 
  auth, 
  validate(authValidators.changePassword), 
  authController.changePassword
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh-token', auth, authController.refreshToken);

// Alternative refresh route for backward compatibility
router.post('/refresh', auth, authController.refreshToken);

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, authController.deleteAccount);

/**
 * Admin Routes (require admin privileges)
 */

// @route   GET /api/auth/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', auth, authController.getAllUsers);

// @route   PUT /api/auth/users/:userId/status
// @desc    Update user status (admin only)
// @access  Private/Admin
router.put('/users/:userId/status', 
  auth, 
  validate(authValidators.updateUserStatus), 
  authController.updateUserStatus
);

// @route   PUT /api/auth/users/:userId/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put('/users/:userId/role', 
  auth, 
  validate(authValidators.updateUserRole), 
  authController.updateUserRole
);

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
      passwordReset: true,
      emailVerification: true,
      profileManagement: true,
      adminControls: true,
      tokenRefresh: true,
      accountDeletion: true
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
