const User = require('../models/User');
const jwtUtils = require('../utils/jwt');
const encryptionUtils = require('../utils/encryption');
const databaseUtils = require('../utils/database');
const fs = require('fs');
const path = require('path');

/**
 * Authentication Service - MongoDB Atlas Integration
 * Enhanced authentication service with MongoDB Atlas priority
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
        console.log(`📚 Loaded ${users.length} sample users for authentication fallback`);
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
      // Always try MongoDB Atlas first
      if (databaseUtils.isConnected()) {
        console.log('📊 Registering user in MongoDB Atlas:', email);
        
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email: email.toLowerCase().trim() }, { username }]
        });

        if (existingUser) {
          throw new Error(existingUser.email === email.toLowerCase().trim() 
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
          }
        });

        const savedUser = await user.save();
        console.log('✅ User registered successfully in MongoDB Atlas:', savedUser.email);

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
          isDatabaseMode: true
        };
      } else {
        console.log('⚠️ MongoDB not connected, using demo mode for registration');
        
        // Fallback: Create demo user (no database persistence)
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
            reviewsWritten: 0,
            averageRating: 0,
            joinDate: new Date()
          },
          isAdmin: false,
          role: 'user',
          status: 'active',
          favoriteGenres: favoriteGenres || []
        };

        // Generate token
        const token = jwtUtils.generateUserToken(demoUser);

        return {
          success: true,
          message: 'تم إنشاء حساب تجريبي (قاعدة البيانات غير متصلة)',
          user: demoUser,
          token,
          isDatabaseMode: false
        };
      }
    } catch (error) {
      throw new Error(`فشل في إنشاء الحساب: ${error.message}`);
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
      // Always try MongoDB Atlas first
      if (databaseUtils.isConnected()) {
        console.log('📊 Authenticating user via MongoDB Atlas:', email);
        
        // Find user in database
        const user = await User.findOne({ 
          email: email.toLowerCase().trim() 
        }).select('+password');

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
        console.log('✅ User authenticated successfully via MongoDB Atlas:', user.email);

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
          isDatabaseMode: true
        };
      } else {
        console.log('⚠️ MongoDB not connected, using demo authentication');
        
        // Fallback: Demo authentication for testing
        const demoCredentials = {
          'admin@kitabi.com': {
            password: 'admin123',
            user: {
              _id: 'demo_admin',
              username: 'admin',
              email: 'admin@kitabi.com',
              profile: {
                firstName: 'مدير',
                lastName: 'الموقع',
                bio: 'مدير منصة كتابي',
                avatar: ''
              },
              role: 'admin',
              isAdmin: true,
              status: 'active'
            }
          },
          'test@kitabi.com': {
            password: 'test123',
            user: {
              _id: 'demo_user',
              username: 'testuser',
              email: 'test@kitabi.com',
              profile: {
                firstName: 'مستخدم',
                lastName: 'تجريبي',
                bio: 'حساب تجريبي للاختبار',
                avatar: ''
              },
              role: 'user',
              isAdmin: false,
              status: 'active'
            }
          }
        };

        const demoAuth = demoCredentials[email.toLowerCase().trim()];
        
        if (!demoAuth || demoAuth.password !== password) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة (وضع تجريبي)');
        }

        // Generate token for demo user
        const token = jwtUtils.generateUserToken(demoAuth.user);

        return {
          success: true,
          message: 'تم تسجيل الدخول بنجاح (وضع تجريبي)',
          user: demoAuth.user,
          token,
          isDatabaseMode: false
        };
      }
    } catch (error) {
      throw new Error(`فشل في تسجيل الدخول: ${error.message}`);
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
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('المستخدم غير موجود');
        }

        const userData = user.toObject();
        delete userData.password;
        return userData;
      } else {
        throw new Error('قاعدة البيانات غير متصلة');
      }
    } catch (error) {
      throw new Error(`فشل في استرجاع الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userId, updateData) {
    try {
      if (databaseUtils.isConnected()) {
        const user = await User.findByIdAndUpdate(
          userId,
          { 
            $set: updateData,
            updatedAt: new Date()
          },
          { new: true, runValidators: true }
        );

        if (!user) {
          throw new Error('المستخدم غير موجود');
        }

        const userData = user.toObject();
        delete userData.password;
        return userData;
      } else {
        throw new Error('قاعدة البيانات غير متصلة');
      }
    } catch (error) {
      throw new Error(`فشل في تحديث الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * Get system health status
   * @returns {Object} Health status
   */
  getHealthStatus() {
    return {
      databaseConnected: databaseUtils.isConnected(),
      sampleUsersLoaded: this.sampleUsers.length > 0,
      authenticationMode: databaseUtils.isConnected() ? 'database' : 'demo'
    };
  }
}

module.exports = new AuthService();
