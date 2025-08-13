const User = require('../models/User');
const jwtUtils = require('../utils/jwt');
const encryptionUtils = require('../utils/encryption');
const databaseUtils = require('../utils/database');
const fs = require('fs');
const path = require('path');

/**
 * Authentication Service
 * Handles all authentication-related business logic
 */
class AuthService {
  constructor() {
    this.sampleUsers = this.loadSampleUsers();
  }

  /**
   * Load sample users for fallback authentication
   */
  loadSampleUsers() {
    try {
      const sampleUsersPath = path.join(__dirname, '../../data/sample-users.json');
      if (fs.existsSync(sampleUsersPath)) {
        const data = fs.readFileSync(sampleUsersPath, 'utf8');
        const users = JSON.parse(data).users || [];
        console.log(`📚 Loaded ${users.length} sample users for authentication`);
        return users;
      }
      return [];
    } catch (error) {
      console.warn('⚠️ Could not load sample users:', error.message);
      return [];
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    const { username, email, password, firstName, lastName, bio, favoriteGenres } = userData;

    try {
      // Always try MongoDB first
      if (databaseUtils.isConnected()) {
        console.log('📊 Using MongoDB Atlas for user registration');
        
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email }, { username }]
        });

        if (existingUser) {
          throw new Error(existingUser.email === email 
            ? 'البريد الإلكتروني مسجل مسبقاً' 
            : 'اسم المستخدم مستخدم بالفعل'
          );
        }

        // Hash password
        const hashedPassword = await encryptionUtils.hashPassword(password);

        // Create new user
        const user = new User({
          username: encryptionUtils.sanitizeInput(username),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          profile: {
            firstName: encryptionUtils.sanitizeInput(firstName || ''),
            lastName: encryptionUtils.sanitizeInput(lastName || ''),
            bio: encryptionUtils.sanitizeInput(bio || ''),
            avatar: ''
          },
          stats: {
            booksRead: 0,
            reviewsWritten: 0,
            averageRating: 0,
            joinDate: new Date()
          },
          isAdmin: false,
          role: 'user',
          status: 'active',
          favoriteGenres: favoriteGenres || [],
          preferences: {
            language: 'ar',
            notifications: {
              email: true,
              push: true,
              newBooks: true,
              reviews: true
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const savedUser = await user.save();
        console.log('✅ User registered in MongoDB Atlas:', savedUser.email);

        // Generate token
        const token = jwtUtils.generateUserToken(savedUser);

        // Return user data without password
        const userData = savedUser.toObject();
        delete userData.password;

        return {
          success: true,
          message: 'تم إنشاء الحساب بنجاح',
          user: userData,
          token,
          isDemoMode: false
        };
      } else {
        // Fallback: Create demo user (no database)
        const userId = Date.now().toString();
        const hashedPassword = await encryptionUtils.hashPassword(password);

        const demoUser = {
          _id: userId,
          id: userId,
          username: encryptionUtils.sanitizeInput(username),
          email: email.toLowerCase().trim(),
          profile: {
            firstName: encryptionUtils.sanitizeInput(firstName || ''),
            lastName: encryptionUtils.sanitizeInput(lastName || ''),
            bio: encryptionUtils.sanitizeInput(bio || ''),
            avatar: ''
          },
          stats: {
            booksRead: 0,
            reviewsCount: 0,
            averageRating: 0
          },
          isAdmin: false,
          role: 'user',
          status: 'active',
          favoriteGenres: favoriteGenres || [],
          preferences: {},
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Generate token
        const token = jwtUtils.generateUserToken(demoUser);

        return {
          success: true,
          message: 'Demo user registered successfully (Database not connected)',
          user: demoUser,
          token,
          isDemoMode: true
        };
      }
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Login result
   */
  async login(credentials) {
    const { email, password } = credentials;

    try {
      // Always try MongoDB first
      if (databaseUtils.isConnected()) {
        console.log('📊 Using MongoDB Atlas for user login');
        
        // Find user in database
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // Check password
        const isPasswordValid = await encryptionUtils.comparePassword(password, user.password);
        if (!isPasswordValid) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // Check user status
        if (user.status !== 'active') {
          throw new Error('الحساب غير نشط. يرجى التواصل مع الدعم الفني.');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();
        console.log('✅ User logged in via MongoDB Atlas:', user.email);

        // Generate token
        const token = jwtUtils.generateUserToken(user);

        // Return user data without password
        const userData = user.toObject();
        delete userData.password;

        return {
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          user: userData,
          token,
          isDemoMode: false
        };
      } else {
        console.log('⚠️ MongoDB not connected, using sample data');
        
        // Fallback: Check sample users
        const sampleUser = this.sampleUsers.find(u => u.email === email.toLowerCase().trim());
        
        if (!sampleUser) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // Check password (sample users have plain text passwords for demo)
        const isPasswordValid = password === sampleUser.password || 
                               await encryptionUtils.comparePassword(password, sampleUser.password);
        
        if (!isPasswordValid) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // Generate token for sample user
        const token = jwtUtils.generateUserToken(sampleUser);

        // Return sample user data without password
        const userData = { ...sampleUser };
        delete userData.password;

        return {
          success: true,
          message: 'تم تسجيل الدخول بنجاح (وضع تجريبي)',
          user: userData,
          token,
          isDemoMode: true
        };
      }
        delete userData.password;

        return {
          success: true,
          message: 'Login successful',
          user: userData,
          token,
          isDemoMode: false
        };
      } else {
        // Fallback: Check sample users
        const sampleUser = this.sampleUsers.find(user => 
          user.email.toLowerCase() === email.toLowerCase()
        );

        if (!sampleUser) {
          throw new Error('Invalid email or password');
        }

        // Check password (sample users use predefined passwords for demo)
        // For demo purposes, we'll use simple password mapping
        const demoPasswords = {
          'admin@kitabi.com': 'admin123',
          'ahmed@example.com': 'ahmed123',
          'fatima@example.com': 'fatima123',
          'mohammed@example.com': 'mohammed123'
        };
        
        const expectedPassword = demoPasswords[sampleUser.email];
        if (!expectedPassword || expectedPassword !== password) {
          throw new Error('Invalid email or password');
        }

        // Create user data object
        const userData = {
          _id: sampleUser.id,
          id: sampleUser.id,
          username: sampleUser.username,
          email: sampleUser.email,
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
          status: 'active',
          favoriteGenres: sampleUser.favoriteGenres || [],
          preferences: {},
          lastLogin: new Date()
        };

        // Generate token
        const token = jwtUtils.generateUserToken(userData);

        return {
          success: true,
          message: 'Demo login successful',
          user: userData,
          token,
          isDemoMode: true
        };
      }
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId) {
    try {
      if (databaseUtils.isConnected()) {
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
          throw new Error('User not found');
        }

        return {
          success: true,
          user: user.toObject(),
          isDemoMode: false
        };
      } else {
        // Fallback: Find in sample users
        const sampleUser = this.sampleUsers.find(user => user.id === userId);
        
        if (!sampleUser) {
          throw new Error('User not found');
        }

        const userData = {
          _id: sampleUser.id,
          id: sampleUser.id,
          username: sampleUser.username,
          email: sampleUser.email,
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

        return {
          success: true,
          user: userData,
          isDemoMode: true
        };
      }
    } catch (error) {
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Profile update data
   * @returns {Promise<Object>} Update result
   */
  async updateProfile(userId, updateData) {
    try {
      if (databaseUtils.isConnected()) {
        const user = await User.findById(userId);
        
        if (!user) {
          throw new Error('User not found');
        }

        // Update profile fields
        if (updateData.firstName !== undefined) {
          user.profile.firstName = encryptionUtils.sanitizeInput(updateData.firstName);
        }
        if (updateData.lastName !== undefined) {
          user.profile.lastName = encryptionUtils.sanitizeInput(updateData.lastName);
        }
        if (updateData.bio !== undefined) {
          user.profile.bio = encryptionUtils.sanitizeInput(updateData.bio);
        }
        if (updateData.favoriteGenres) {
          user.favoriteGenres = updateData.favoriteGenres;
        }
        if (updateData.preferences) {
          user.preferences = { ...user.preferences, ...updateData.preferences };
        }

        user.updatedAt = new Date();
        await user.save();

        const userData = user.toObject();
        delete userData.password;

        return {
          success: true,
          message: 'Profile updated successfully',
          user: userData
        };
      } else {
        // Demo mode: return success message
        return {
          success: true,
          message: 'Profile updated successfully (Demo mode)',
          isDemoMode: true
        };
      }
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {Object} passwordData - Password change data
   * @returns {Promise<Object>} Change result
   */
  async changePassword(userId, passwordData) {
    const { currentPassword, newPassword } = passwordData;

    try {
      if (databaseUtils.isConnected()) {
        const user = await User.findById(userId);
        
        if (!user) {
          throw new Error('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await encryptionUtils.comparePassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await encryptionUtils.hashPassword(newPassword);
        
        // Update password
        user.password = hashedNewPassword;
        user.updatedAt = new Date();
        await user.save();

        return {
          success: true,
          message: 'Password changed successfully'
        };
      } else {
        // Demo mode: return success message
        return {
          success: true,
          message: 'Password changed successfully (Demo mode)',
          isDemoMode: true
        };
      }
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Verification result
   */
  async verifyToken(token) {
    try {
      const decoded = jwtUtils.verifyToken(token);
      
      // Get fresh user data
      const profileResult = await this.getProfile(decoded.userId);
      
      return {
        success: true,
        user: profileResult.user,
        decoded,
        isDemoMode: profileResult.isDemoMode
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Refresh JWT token
   * @param {string} token - Current JWT token
   * @returns {Promise<Object>} Refresh result
   */
  async refreshToken(token) {
    try {
      const newToken = jwtUtils.refreshToken(token);
      
      return {
        success: true,
        message: 'Token refreshed successfully',
        token: newToken
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Get authentication health status
   * @returns {Object} Health status
   */
  getHealthStatus() {
    return {
      status: 'OK',
      service: 'Authentication',
      mongoConnected: databaseUtils.isConnected(),
      sampleUsersLoaded: this.sampleUsers.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AuthService();
