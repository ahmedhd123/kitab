const authService = require('../services/authService');

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
class AuthController {
  /**
   * Register a new user
   * @route POST /api/auth/register
   * @access Public
   */
  async register(req, res) {
    try {
      console.log('🔐 Registration attempt:', { email: req.body.email, username: req.body.username });

      const result = await authService.register(req.body);

      res.status(201).json(result);
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      
      // Handle specific errors
      if (error.message.includes('already registered') || error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Login user
   * @route POST /api/auth/login
   * @access Public
   */
  async login(req, res) {
    try {
      console.log('🔐 Login attempt:', { 
        email: req.body.email, 
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        origin: req.get('Origin')
      });

      const result = await authService.login(req.body);

      console.log('✅ Login successful for:', req.body.email);
      res.json(result);
    } catch (error) {
      console.error('❌ Login error details:', {
        message: error.message,
        stack: error.stack,
        email: req.body.email,
        timestamp: new Date().toISOString()
      });
      
      // Handle specific Arabic error messages
      if (error.message.includes('البريد الإلكتروني أو كلمة المرور غير صحيحة')) {
        return res.status(401).json({
          success: false,
          message: 'بيانات تسجيل الدخول غير صحيحة'
        });
      }

      if (error.message.includes('الحساب غير نشط')) {
        return res.status(403).json({
          success: false,
          message: 'الحساب غير نشط. يرجى التواصل مع الدعم الفني.'
        });
      }

      if (error.message.includes('فشل في تسجيل الدخول')) {
        return res.status(400).json({
          success: false,
          message: 'حدث خطأ في تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        });
      }

      // General error with more specific message
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
        debug: process.env.NODE_ENV === 'development' ? {
          error: error.message,
          timestamp: new Date().toISOString()
        } : undefined
      });
    }
  }

  /**
   * Get user profile
   * @route GET /api/auth/me
   * @access Private
   */
  async getProfile(req, res) {
    try {
      const result = await authService.getProfile(req.user.userId);

      res.json(result);
    } catch (error) {
      console.error('❌ Get profile error:', error.message);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Update user profile
   * @route PUT /api/auth/profile
   * @access Private
   */
  async updateProfile(req, res) {
    try {
      const result = await authService.updateProfile(req.user.userId, req.body);

      res.json(result);
    } catch (error) {
      console.error('❌ Update profile error:', error.message);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Change user password
   * @route PUT /api/auth/change-password
   * @access Private
   */
  async changePassword(req, res) {
    try {
      const result = await authService.changePassword(req.user.userId, req.body);

      res.json(result);
    } catch (error) {
      console.error('❌ Change password error:', error.message);
      
      if (error.message.includes('Current password is incorrect')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Logout user
   * @route POST /api/auth/logout
   * @access Private
   */
  async logout(req, res) {
    try {
      // In a production app, you might want to blacklist the token
      // For now, we'll just confirm the logout on client side

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('❌ Logout error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Refresh JWT token
   * @route POST /api/auth/refresh
   * @access Private
   */
  async refreshToken(req, res) {
    try {
      const currentToken = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!currentToken) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const result = await authService.refreshToken(currentToken);

      res.json(result);
    } catch (error) {
      console.error('❌ Token refresh error:', error.message);
      
      res.status(401).json({
        success: false,
        message: 'Token refresh failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Verify token
   * @route POST /api/auth/verify
   * @access Public
   */
  async verifyToken(req, res) {
    try {
      const token = req.body.token || req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const result = await authService.verifyToken(token);

      res.json(result);
    } catch (error) {
      console.error('❌ Token verification error:', error.message);
      
      res.status(401).json({
        success: false,
        message: 'Token verification failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Auth health check
   * @route GET /api/auth/health
   * @access Public
   */
  async healthCheck(req, res) {
    try {
      const healthStatus = authService.getHealthStatus();
      res.json(healthStatus);
    } catch (error) {
      console.error('❌ Auth health check error:', error.message);
      
      res.status(500).json({
        status: 'ERROR',
        service: 'Authentication',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get authentication statistics
   * @route GET /api/auth/stats
   * @access Private (Admin only)
   */
  async getStats(req, res) {
    try {
      // Only admin can access stats
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const stats = {
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0
      };

      // If database is connected, get real stats
      const databaseUtils = require('../utils/database');
      if (databaseUtils.isConnected()) {
        const User = require('../models/User');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        stats.totalUsers = await User.countDocuments();
        stats.activeUsers = await User.countDocuments({ status: 'active' });
        stats.newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
        stats.newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });
        stats.newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: monthAgo } });
      } else {
        // Demo stats
        stats.totalUsers = authService.sampleUsers.length;
        stats.activeUsers = authService.sampleUsers.length;
        stats.newUsersToday = 0;
        stats.newUsersThisWeek = 0;
        stats.newUsersThisMonth = 0;
      }

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('❌ Auth stats error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get authentication statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

const authController = new AuthController();

module.exports = authController;
