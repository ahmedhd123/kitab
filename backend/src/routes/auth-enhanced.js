const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
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

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
    }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().max(50).allow(''),
  lastName: Joi.string().max(50).allow('')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Generate JWT token
const generateToken = (userId, userRole = 'user', isAdmin = false) => {
  return jwt.sign(
    { 
      userId,
      role: userRole,
      isAdmin 
    },
    process.env.JWT_SECRET || 'kitabi-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Find user in sample data
const findSampleUser = (query) => {
  return sampleUsers.find(user => {
    if (query.email) return user.email === query.email;
    if (query._id) return user._id === query._id;
    if (query.username) return user.username === query.username;
    return false;
  });
};

// Compare password with sample user
const compareSamplePassword = async (inputPassword, hashedPassword, plainTextPassword = null) => {
  try {
    // For demo purposes, also check if password matches plain text
    if (plainTextPassword && inputPassword === plainTextPassword) {
      return true;
    }
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    // Fallback for demo
    return inputPassword === 'admin123' && hashedPassword.includes('$2a$');
  }
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { email: req.body.email, username: req.body.username });

    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const { username, email, password, firstName, lastName } = value;

    // If MongoDB is connected, use normal registration
    if (isMongoConnected()) {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(409).json({
          message: 'User already exists',
          field: existingUser.email === email ? 'email' : 'username'
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        profile: {
          firstName: firstName || '',
          lastName: lastName || ''
        }
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Return user data (without sensitive information)
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        stats: user.stats,
        isAdmin: user.isAdmin || false,
        role: user.role || 'user',
        preferences: user.preferences
      };

      res.status(201).json({
        message: 'User registered successfully',
        user: userData,
        token
      });
    } else {
      // Fallback: Check sample users for conflicts
      const existingSampleUser = sampleUsers.find(u => u.email === email || u.username === username);
      if (existingSampleUser) {
        return res.status(409).json({
          message: 'User already exists in demo data',
          field: existingSampleUser.email === email ? 'email' : 'username'
        });
      }

      // Generate token with temporary ID
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const token = generateToken(tempId);

      // Return demo user data
      const userData = {
        id: tempId,
        username,
        email,
        profile: {
          firstName: firstName || '',
          lastName: lastName || ''
        },
        stats: {
          booksRead: 0,
          reviewsCount: 0,
          averageRating: 0
        },
        isAdmin: false,
        role: 'user',
        preferences: {}
      };

      res.status(201).json({
        message: 'Demo user registered successfully (Database not connected)',
        user: userData,
        token,
        isDemoMode: true
      });
    }

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', { email: req.body.email });

    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const { email, password } = value;

    // If MongoDB is connected, use normal authentication
    if (isMongoConnected()) {
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      // Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last active
      user.lastActive = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id, user.role, user.isAdmin);

      // Return user data (without sensitive information)
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        stats: user.stats,
        isAdmin: user.isAdmin || false,
        role: user.role || 'user',
        preferences: user.preferences
      };

      console.log('✅ Database login successful for:', email);
      res.json({
        message: 'Login successful',
        user: userData,
        token
      });
    } else {
      // Fallback: Use sample users
      console.log('📚 Using sample data for authentication');
      
      const sampleUser = findSampleUser({ email });
      if (!sampleUser) {
        return res.status(401).json({ 
          message: 'Invalid credentials',
          hint: 'Try admin@kitabi.com with password: admin123'
        });
      }

      // Check if account is active
      if (sampleUser.status !== 'active') {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      // Compare password (handle both hashed and plain text for demo)
      let isMatch = false;
      if (sampleUser.email === 'admin@kitabi.com' && password === 'admin123') {
        isMatch = true;
      } else {
        isMatch = await compareSamplePassword(password, sampleUser.password);
      }

      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid credentials',
          hint: 'For admin access, use: admin@kitabi.com / admin123'
        });
      }

      // Generate token
      const token = generateToken(sampleUser._id, sampleUser.role, sampleUser.isAdmin);

      // Return user data (without sensitive information)
      const userData = {
        id: sampleUser._id,
        username: sampleUser.username,
        email: sampleUser.email,
        name: sampleUser.name,
        profile: {
          firstName: sampleUser.name.split(' ')[0] || '',
          lastName: sampleUser.name.split(' ').slice(1).join(' ') || '',
          bio: sampleUser.bio || '',
          avatar: sampleUser.avatar || ''
        },
        stats: {
          booksRead: sampleUser.booksRead || 0,
          reviewsCount: sampleUser.reviewsCount || 0,
          averageRating: 0
        },
        isAdmin: sampleUser.isAdmin || false,
        role: sampleUser.role || 'user',
        favoriteGenres: sampleUser.favoriteGenres || [],
        preferences: {}
      };

      console.log('✅ Sample data login successful for:', email, '- Role:', userData.role);
      res.json({
        message: 'Login successful (Demo mode)',
        user: userData,
        token,
        isDemoMode: true
      });
    }

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user endpoint
router.get('/me', auth, async (req, res) => {
  try {
    console.log('👤 Get current user for ID:', req.userId);

    // If MongoDB is connected, use normal user lookup
    if (isMongoConnected()) {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        stats: user.stats,
        isAdmin: user.isAdmin || false,
        role: user.role || 'user',
        preferences: user.preferences
      };

      res.json({ user: userData });
    } else {
      // Fallback: Use sample users
      const sampleUser = findSampleUser({ _id: req.userId });
      if (!sampleUser) {
        return res.status(404).json({ 
          message: 'User not found in demo data',
          isDemoMode: true
        });
      }

      const userData = {
        id: sampleUser._id,
        username: sampleUser.username,
        email: sampleUser.email,
        name: sampleUser.name,
        profile: {
          firstName: sampleUser.name.split(' ')[0] || '',
          lastName: sampleUser.name.split(' ').slice(1).join(' ') || '',
          bio: sampleUser.bio || '',
          avatar: sampleUser.avatar || ''
        },
        stats: {
          booksRead: sampleUser.booksRead || 0,
          reviewsCount: sampleUser.reviewsCount || 0,
          averageRating: 0
        },
        isAdmin: sampleUser.isAdmin || false,
        role: sampleUser.role || 'user',
        favoriteGenres: sampleUser.favoriteGenres || [],
        preferences: {}
      };

      res.json({ 
        user: userData,
        isDemoMode: true
      });
    }

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout endpoint
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just send a success response
    console.log('🚪 User logged out:', req.userId);
    
    res.json({ 
      message: 'Logged out successfully',
      isDemoMode: !isMongoConnected()
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Password reset request endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { error, value } = Joi.object({
      email: Joi.string().email().required()
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const { email } = value;

    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists or not
        return res.json({
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Save it to the user document with expiration
      // 3. Send an email with the reset link

      res.json({
        message: 'Password reset link has been sent to your email.'
      });
    } else {
      // Demo mode
      const sampleUser = findSampleUser({ email });
      if (sampleUser) {
        res.json({
          message: 'Demo mode: Password reset would be sent to your email.',
          hint: 'In demo mode, use admin@kitabi.com / admin123 for admin access',
          isDemoMode: true
        });
      } else {
        res.json({
          message: 'If an account with that email exists, a password reset link has been sent.',
          isDemoMode: true
        });
      }
    }

  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check for auth system
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Authentication',
    mongoConnected: isMongoConnected(),
    sampleUsersLoaded: sampleUsers.length,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
