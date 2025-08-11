const jwtUtils = require('../utils/jwt');

/**
 * Enhanced Authentication Middleware
 */

/**
 * Basic authentication middleware
 * Verifies JWT token and adds user to request
 */
const auth = async (req, res, next) => {
  try {
    const token = jwtUtils.extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Check if token is expired
    if (jwtUtils.isTokenExpired(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    // Verify token
    const decoded = jwtUtils.verifyToken(token);
    
    // Add user info to request
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Admin authentication middleware
 * Requires user to be authenticated and have admin privileges
 */
const requireAdmin = async (req, res, next) => {
  try {
    const token = jwtUtils.extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded;

    // Check admin privileges
    if (!req.user.isAdmin && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('❌ Admin auth middleware error:', error.message);
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Optional authentication middleware
 * Adds user to request if token is present and valid, but doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = jwtUtils.extractTokenFromHeader(req);

    if (token && !jwtUtils.isTokenExpired(token)) {
      try {
        const decoded = jwtUtils.verifyToken(token);
        req.user = decoded;
        req.token = token;
        req.isAuthenticated = true;
      } catch (error) {
        // Token is invalid, but we continue without auth
        req.isAuthenticated = false;
      }
    } else {
      req.isAuthenticated = false;
    }

    next();
  } catch (error) {
    // Continue without authentication
    req.isAuthenticated = false;
    next();
  }
};

/**
 * Role-based authentication middleware factory
 * @param {Array|string} allowedRoles - Array of allowed roles or single role
 */
const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return async (req, res, next) => {
    try {
      const token = jwtUtils.extractTokenFromHeader(req);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      const decoded = jwtUtils.verifyToken(token);
      req.user = decoded;

      // Check role
      if (!roles.includes(req.user.role) && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${roles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('❌ Role auth middleware error:', error.message);
      
      res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  };
};

/**
 * Owner or admin middleware
 * Allows access if user is the owner of the resource or is an admin
 * @param {string} userIdField - Field name containing the user ID (default: 'userId')
 */
const requireOwnerOrAdmin = (userIdField = 'userId') => {
  return async (req, res, next) => {
    try {
      const token = jwtUtils.extractTokenFromHeader(req);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      const decoded = jwtUtils.verifyToken(token);
      req.user = decoded;

      // Check if user is admin
      if (req.user.isAdmin || req.user.role === 'admin') {
        return next();
      }

      // Check if user is the owner
      const resourceUserId = req.params[userIdField] || req.body[userIdField];
      if (req.user.userId === resourceUserId) {
        return next();
      }

      res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    } catch (error) {
      console.error('❌ Owner auth middleware error:', error.message);
      
      res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  };
};

module.exports = {
  auth,
  requireAdmin,
  optionalAuth,
  requireRole,
  requireOwnerOrAdmin
};
