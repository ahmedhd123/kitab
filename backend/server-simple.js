/**
 * Simplified Kitabi Backend Server for Cloud Deployment
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string';
const CLIENT_URL = process.env.CLIENT_URL || 'https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://localhost:3000';

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ALLOWED_ORIGINS.split(',').map(o => o.trim());
    allowedOrigins.push('https://glitch.com');
    allowedOrigins.push(undefined); // Allow requests with no origin (mobile apps, etc.)
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('🔒 CORS blocked origin:', origin);
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
};

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

// Simple Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  publishYear: { type: Number },
  genre: { type: String },
  language: { type: String, default: 'ar' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'مطلوب رمز المصادقة' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'رمز مصادقة غير صالح' });
  }
};

// Routes

// Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kitabi Backend is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kitabi API is healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    users: 'available',
    books: 'available'
  });
});

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', { email, origin: req.get('origin') });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'بيانات تسجيل الدخول غير صحيحة'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'بيانات تسجيل الدخول غير صحيحة'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب معطل'
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', { email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// Admin Books Route
app.get('/api/admin/books', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح بالوصول'
      });
    }

    const books = await Book.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      books: books,
      total: books.length
    });

  } catch (error) {
    console.error('❌ Books fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// Test Auth Route
app.get('/api/test-auth', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Books Route
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({ isActive: true }).sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      books: books,
      total: books.length
    });
  } catch (error) {
    console.error('❌ Books error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// Default Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Kitabi Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/health',
      login: '/api/auth/login',
      books: '/api/books'
    }
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  res.status(500).json({
    success: false,
    message: 'خطأ في الخادم'
  });
});

// Database Connection and Server Start
async function startServer() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@kitabi.com' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@kitabi.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Create sample books if none exist
    const booksCount = await Book.countDocuments();
    if (booksCount === 0) {
      const sampleBooks = [
        {
          title: 'الأسود يليق بك',
          author: 'أحلام مستغانمي',
          description: 'رواية عربية معاصرة',
          publishYear: 2012,
          genre: 'رواية',
          language: 'ar'
        },
        {
          title: 'مئة عام من العزلة',
          author: 'غابرييل غارسيا ماركيز',
          description: 'رواية كلاسيكية مترجمة',
          publishYear: 1967,
          genre: 'أدب',
          language: 'ar'
        }
      ];
      
      await Book.insertMany(sampleBooks);
      console.log('✅ Sample books created');
    }

    app.listen(PORT, () => {
      console.log('🚀 Kitabi Backend Server Started');
      console.log('================================');
      console.log(`🔧 Port: ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`🔗 URL: https://your-app.glitch.me`);
      console.log(`🩺 Health: https://your-app.glitch.me/health`);
      console.log(`📚 API: https://your-app.glitch.me/api`);
      console.log('✅ Server is ready for requests');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
