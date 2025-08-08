const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: 'Token is not valid or user is inactive' 
      });
    }

    // Add user to request object
    req.user = decoded;
    req.userDoc = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = decoded;
        req.userDoc = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (!req.userDoc || req.userDoc.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// Check if user owns resource or is admin
const ownerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    const userId = req.user.userId;
    const isOwner = userId === resourceUserId.toString();
    const isAdmin = req.userDoc && req.userDoc.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. You can only access your own resources.' 
      });
    }
    
    next();
  };
};

// Rate limiting for sensitive operations
const rateLimitByUser = (windowMs = 15 * 60 * 1000, maxRequests = 5) => {
  const userRequests = new Map();
  
  return (req, res, next) => {
    const userId = req.user.userId;
    const now = Date.now();
    
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }
    
    const requests = userRequests.get(userId);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    validRequests.push(now);
    userRequests.set(userId, validRequests);
    
    next();
  };
};

// Validate resource ownership
const validateOwnership = (Model, resourceParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceParam];
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      const userId = req.user.userId;
      const isOwner = resource.user && resource.user.toString() === userId;
      const isAdmin = req.userDoc && req.userDoc.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          message: 'Access denied. You do not own this resource.' 
        });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership validation error:', error);
      res.status(500).json({ message: 'Server error in ownership validation' });
    }
  };
};

module.exports = {
  auth,
  optionalAuth,
  adminOnly,
  ownerOrAdmin,
  rateLimitByUser,
  validateOwnership
};
