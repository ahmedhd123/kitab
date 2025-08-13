/**
 * Kitabi Backend Server
 * Main application server with clean architecture
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const os = require('os');
require('dotenv').config();

// Import utilities and middleware
const DatabaseUtils = require('./utils/database');
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { sanitize } = require('./middleware/validate');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const freebooksRoutes = require('./routes/freebooks');
const aiRoutes = require('./routes/ai');
const epubRoutes = require('./routes/epub');
const notificationRoutes = require('./routes/notifications');

// Create Express app
const app = express();

/**
 * Network Configuration
 */
const getLocalNetworkIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = ['localhost', '127.0.0.1'];
  
  Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((interface) => {
      if (interface.family === 'IPv4' && !interface.internal) {
        ips.push(interface.address);
      }
    });
  });
  
  return ips;
};

const localIPs = getLocalNetworkIPs();

/**
 * Security Middleware
 */
// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow file downloads
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'"],
      childSrc: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// CORS configuration - Enhanced for production and development
const createAllowedOrigins = () => {
  const allowedOrigins = [];
  
  // Production origins
  if (process.env.NODE_ENV === 'production') {
    const prodOrigins = [
      'https://kitabi.vercel.app',
      'https://kitabi-app.vercel.app',
      'https://www.kitabi.app',
      'https://kitabi.app',
      'https://kitab-123fpnqxz-ahmedhd123s-projects.vercel.app'
    ];
    
    // Add environment variable origins
    if (process.env.ALLOWED_ORIGINS) {
      const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
      prodOrigins.push(...envOrigins);
    }
    
    allowedOrigins.push(...prodOrigins);
    console.log('🌐 Production CORS origins:', prodOrigins);
  } else {
    // Development origins
    const ports = [3000, 3001, 3002, 3003, 8080, 8081];
    
    localIPs.forEach(ip => {
      ports.forEach(port => {
        allowedOrigins.push(`http://${ip}:${port}`);
        allowedOrigins.push(`https://${ip}:${port}`);
      });
    });
    
    // Add environment-specific origins
    if (process.env.CLIENT_URL) {
      allowedOrigins.push(process.env.CLIENT_URL);
    }
    
    // Add Vercel deployments for development testing
    allowedOrigins.push('https://kitab-123fpnqxz-ahmedhd123s-projects.vercel.app');
    
    console.log('🔧 Development CORS origins:', allowedOrigins.slice(0, 5), '...');
  }

  return allowedOrigins;
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = createAllowedOrigins();

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`� CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  }
});

app.use('/api/', limiter);

/**
 * Application Middleware
 */
// Compression
app.use(compression());

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('common'));
}

// Body parsing
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        success: false,
        message: 'Invalid JSON format',
        errorCode: 'INVALID_JSON'
      });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Request sanitization
app.use(sanitize);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

/**
 * Health Check Routes
 */
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';

  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    database: {
      status: dbStatusText,
      connected: dbStatus === 1
    },
    cors: {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',').length || 0,
      clientUrl: process.env.CLIENT_URL || 'not-set'
    }
  });
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  const dbConnected = dbStatus === 1;

  res.status(200).json({
    success: true,
    message: 'API is healthy',
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      server: 'running',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      authentication: 'available',
      cors: 'configured'
    },
    config: {
      useDatabase: process.env.USE_DATABASE === 'true',
      nodeEnv: process.env.NODE_ENV,
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
      clientUrl: process.env.CLIENT_URL
    },
    timestamp: new Date().toISOString()
  });
});

// Test route for authentication debugging
app.post('/api/test-auth', async (req, res) => {
  try {
    const authService = require('./services/authService');
    const { email, password } = req.body;
    
    console.log('🧪 Test auth request:', { email, origin: req.get('Origin') });
    
    const result = await authService.login({ email, password });
    
    res.json({
      success: true,
      message: 'Test authentication successful',
      result: {
        authenticated: result.success,
        isDatabaseMode: result.isDatabaseMode,
        userRole: result.user?.role,
        hasToken: !!result.token
      }
    });
  } catch (error) {
    console.error('🧪 Test auth error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Test authentication failed',
      error: error.message
    });
  }
});

/**
 * Database Connection (non-blocking)
 */
async function initializeDatabase() {
  try {
    // Check if we should use database
    const useDatabase = process.env.USE_DATABASE === 'true';
    
    if (useDatabase) {
      console.log('🔄 Connecting to MongoDB...');
      await DatabaseUtils.connectDB();
      console.log('✅ Connected to MongoDB successfully!');
      console.log('📚 Using MongoDB database for persistent storage');
    } else {
      console.log('📚 Using sample data mode - database connection optional');
    }
  } catch (err) {
    console.log('📚 Continuing without database connection - sample data will still work');
    console.log('🔧 Database error:', err.message);
  }
}

initializeDatabase();

/**
 * API Routes
 */
const API_PREFIX = '/api';

// Authentication routes
app.use(`${API_PREFIX}/auth`, authRoutes);

// User routes
app.use(`${API_PREFIX}/users`, userRoutes);

// Book routes
app.use(`${API_PREFIX}/books`, bookRoutes);

// Free books routes
app.use(`${API_PREFIX}/freebooks`, freebooksRoutes);

// Review routes
app.use(`${API_PREFIX}/reviews`, reviewRoutes);

// AI routes
app.use(`${API_PREFIX}/ai`, aiRoutes);

// EPUB routes
app.use(`${API_PREFIX}/epub`, epubRoutes);

// Notification routes
app.use(`${API_PREFIX}/notifications`, notificationRoutes);

// Admin routes
app.use(`${API_PREFIX}/admin`, adminRoutes);

// API documentation route
app.get(`${API_PREFIX}`, (req, res) => {
  res.json({
    success: true,
    message: 'Kitabi API v1.0',
    documentation: {
      auth: `${API_PREFIX}/auth`,
      users: `${API_PREFIX}/users`,
      books: `${API_PREFIX}/books`,
      freebooks: `${API_PREFIX}/freebooks`,
      reviews: `${API_PREFIX}/reviews`,
      ai: `${API_PREFIX}/ai`,
      admin: `${API_PREFIX}/admin`
    },
    features: [
      'Authentication with JWT',
      'User management',
      'Book catalog',
      'Free books library',
      'Review system',
      'AI recommendations',
      'Admin panel',
      'File uploads',
      'Search functionality',
      'Rate limiting',
      'Input validation',
      'Error handling'
    ],
    network: {
      accessibleFrom: localIPs.map(ip => `http://${ip}:${process.env.PORT || 5000}`)
    },
    status: 'operational',
    version: '1.0.0'
  });
});

/**
 * Error Handling Middleware
 */
// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

/**
 * Server Startup
 */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    console.log('🌐 Allowing connections from IPs:', localIPs);

    // Start server on all network interfaces
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
🚀 Kitabi Backend Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Environment: ${NODE_ENV}
🔧 Port: ${PORT}
🌍 Server accessible from:
${localIPs.map(ip => `   - http://${ip}:${PORT}`).join('\n')}

🩺 Health: http://localhost:${PORT}/health
📚 API: http://localhost:${PORT}/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Available Routes:
   • ${API_PREFIX}/auth          - Authentication
   • ${API_PREFIX}/users         - User management  
   • ${API_PREFIX}/books         - Book catalog
   • ${API_PREFIX}/freebooks     - Free books library
   • ${API_PREFIX}/reviews       - Review system
   • ${API_PREFIX}/ai            - AI recommendations
   • ${API_PREFIX}/admin         - Admin panel

🔧 Features Enabled:
   ✅ Clean Architecture
   ✅ JWT Authentication
   ✅ Role-based Access Control
   ✅ Input Validation
   ✅ Error Handling
   ✅ Rate Limiting
   ✅ CORS Security
   ✅ Request Sanitization
   ✅ File Upload Support
   ✅ Database Integration
   ✅ Sample Data Fallback

🛡️ Security:
   ✅ Helmet.js Protection
   ✅ CORS Configuration
   ✅ Rate Limiting
   ✅ Input Sanitization
   ✅ SQL Injection Protection
   ✅ XSS Protection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Kitabi - AI-Powered Arabic Book Platform
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  console.error('Stack trace:', err.stack);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('� SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
