const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth'); // Back to real auth routes with MongoDB
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow file downloads
}));
// Get local network IP
const os = require('os');
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
console.log('🌐 Allowing connections from IPs:', localIPs);

// Create CORS origins for different ports
const allowedOrigins = [];
const ports = [3000, 3001, 3002, 3003, 8080, 8081];

localIPs.forEach(ip => {
  ports.forEach(port => {
    allowedOrigins.push(`http://${ip}:${port}`);
    allowedOrigins.push(`https://${ip}:${port}`);
  });
});

// Add common development origins
allowedOrigins.push('http://localhost:3000');
allowedOrigins.push('http://localhost:3001');
allowedOrigins.push('http://localhost:3002');

console.log('🔗 CORS allowed origins:', allowedOrigins.slice(0, 10), '... and more');

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files middleware for uploads (with authentication will be handled in routes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to database (non-blocking)
connectDB().catch(err => {
  console.log('📚 Continuing without database connection - sample books will still work');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/freebooks', require('./routes/freebooks'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Kitabi API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Kitabi API server is running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server accessible from:`);
  
  localIPs.forEach(ip => {
    console.log(`   - http://${ip}:${PORT}`);
  });
  
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
