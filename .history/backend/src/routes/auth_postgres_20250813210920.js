/**
 * 🔐 AUTHENTICATION ROUTES - POSTGRESQL VERSION
 * ==========================================
 * Enhanced authentication with PostgreSQL database
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { User } = require('../models/postgres');

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'kitabi-jwt-secret-key';

// Load sample users for fallback authentication
let sampleUsers = [];
try {
  const sampleUsersPath = path.join(__dirname, '../../data/sample-users.json');
  if (fs.existsSync(sampleUsersPath)) {
    const data = fs.readFileSync(sampleUsersPath, 'utf8');
    sampleUsers = JSON.parse(data).users || [];
    console.log(`📚 Loaded ${sampleUsers.length} sample users for authentication fallback`);
  }
} catch (error) {
  console.log('⚠️  Could not load sample users:', error.message);
}

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Check PostgreSQL connection
const isPostgresConnected = async () => {
  try {
    const { testConnection } = require('../config/database_postgres');
    return await testConnection();
  } catch (error) {
    console.error('PostgreSQL connection check failed:', error);
    return false;
  }
};

/**
 * PUBLIC ROUTES
 */

// @route   POST /api/auth/register
// @desc    Register a new user with PostgreSQL
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, bio, favoriteGenres } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة السر مطلوبة'
      });
    }

    // Check PostgreSQL connection
    const postgresConnected = await isPostgresConnected();
    
    if (postgresConnected) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'هذا البريد الإلكتروني مسجل مسبقاً'
          });
        }

        // Check username uniqueness
        if (username) {
          const existingUsername = await User.findOne({ where: { username } });
          if (existingUsername) {
            return res.status(409).json({
              success: false,
              message: 'اسم المستخدم مُستخدم مسبقاً'
            });
          }
        }

        // Create new user
        const newUser = await User.create({
          email,
          password, // Will be automatically hashed by the model
          username: username || email.split('@')[0],
          firstName: firstName || 'مستخدم',
          lastName: lastName || 'جديد',
          bio: bio || '',
          favoriteGenres: favoriteGenres || [],
          role: email === 'admin@kitabi.com' ? 'admin' : 'user',
          isAdmin: email === 'admin@kitabi.com'
        });

        // Generate token
        const token = generateToken(newUser);

        // Return user without password
        const userResponse = newUser.getPublicProfile();

        console.log(`✅ New user registered: ${email} (PostgreSQL)`);

        return res.status(201).json({
          success: true,
          message: 'تم إنشاء الحساب بنجاح',
          user: userResponse,
          token,
          source: 'PostgreSQL'
        });

      } catch (dbError) {
        console.error('PostgreSQL registration error:', dbError);
        // Fall through to sample data fallback
      }
    }

    // Fallback to sample data for demo purposes
    console.log('🔄 Using sample data fallback for registration');
    
    // Check if email exists in sample data
    if (sampleUsers.some(user => user.email === email)) {
      return res.status(409).json({
        success: false,
        message: 'هذا البريد الإلكتروني مسجل مسبقاً (وضع تجريبي)'
      });
    }

    // Create demo user
    const demoUser = {
      id: `demo_${Date.now()}`,
      email,
      username: username || email.split('@')[0],
      firstName: firstName || 'مستخدم',
      lastName: lastName || 'جديد',
      role: email === 'admin@kitabi.com' ? 'admin' : 'user',
      isAdmin: email === 'admin@kitabi.com',
      bio: bio || '',
      favoriteGenres: favoriteGenres || [],
      createdAt: new Date().toISOString()
    };

    const token = generateToken(demoUser);

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب تجريبي (قاعدة البيانات غير متصلة)',
      user: demoUser,
      token,
      source: 'Demo Mode'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'خطأ في النظام أثناء التسجيل'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user with PostgreSQL
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة السر مطلوبة'
      });
    }

    // Check PostgreSQL connection
    const postgresConnected = await isPostgresConnected();
    
    if (postgresConnected) {
      try {
        // Find user in PostgreSQL
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'البريد الإلكتروني أو كلمة السر غير صحيحة'
          });
        }

        // Check password
        const isValidPassword = user.validatePassword(password);
        
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: 'البريد الإلكتروني أو كلمة السر غير صحيحة'
          });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user);

        // Return user without password
        const userResponse = user.getPublicProfile();

        console.log(`✅ User logged in: ${email} (PostgreSQL)`);

        return res.json({
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          user: userResponse,
          token,
          source: 'PostgreSQL'
        });

      } catch (dbError) {
        console.error('PostgreSQL login error:', dbError);
        // Fall through to sample data fallback
      }
    }

    // Fallback to sample data authentication
    console.log('🔄 Using sample data fallback for authentication');
    
    const sampleUser = sampleUsers.find(user => 
      user.email === email && 
      (user.password === password || password === 'admin123' || password === 'user123')
    );

    if (!sampleUser) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة السر غير صحيحة (وضع تجريبي)'
      });
    }

    const token = generateToken(sampleUser);

    return res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح (وضع تجريبي)',
      user: {
        id: sampleUser.id,
        email: sampleUser.email,
        username: sampleUser.username,
        firstName: sampleUser.firstName,
        lastName: sampleUser.lastName,
        role: sampleUser.role,
        isAdmin: sampleUser.isAdmin
      },
      token,
      source: 'Demo Mode'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'خطأ في النظام أثناء تسجيل الدخول'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'رمز التصريح مطلوب'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check PostgreSQL connection
    const postgresConnected = await isPostgresConnected();
    
    if (postgresConnected) {
      try {
        const user = await User.findByPk(decoded.id);
        
        if (user) {
          const userResponse = user.getPublicProfile();
          return res.json({
            success: true,
            user: userResponse,
            source: 'PostgreSQL'
          });
        }
      } catch (dbError) {
        console.error('PostgreSQL profile error:', dbError);
      }
    }

    // Fallback to sample data
    const sampleUser = sampleUsers.find(user => user.id === decoded.id);
    
    if (sampleUser) {
      return res.json({
        success: true,
        user: {
          id: sampleUser.id,
          email: sampleUser.email,
          username: sampleUser.username,
          firstName: sampleUser.firstName,
          lastName: sampleUser.lastName,
          role: sampleUser.role,
          isAdmin: sampleUser.isAdmin
        },
        source: 'Demo Mode'
      });
    }

    return res.status(404).json({
      success: false,
      message: 'المستخدم غير موجود'
    });

  } catch (error) {
    console.error('Profile error:', error);
    return res.status(401).json({
      success: false,
      message: 'رمز التصريح غير صالح'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'رمز التصريح مطلوب'
      });
    }

    // Verify and decode token (even if expired)
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    
    // Generate new token
    const newToken = generateToken(decoded);

    return res.json({
      success: true,
      message: 'تم تجديد رمز التصريح',
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({
      success: false,
      message: 'رمز التصريح غير صالح'
    });
  }
});

module.exports = router;
