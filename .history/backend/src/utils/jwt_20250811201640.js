const jwt = require('jsonwebtoken');

/**
 * JWT Utility Functions
 */
class JWTUtils {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'kitabi-secret-key';
    this.expiresIn = process.env.JWT_EXPIRE || '7d';
  }

  /**
   * Generate JWT token
   * @param {Object} payload - Token payload
   * @returns {string} JWT token
   */
  generateToken(payload) {
    try {
      return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    } catch (error) {
      throw new Error('Token generation failed: ' + error.message);
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Token verification failed: ' + error.message);
    }
  }

  /**
   * Decode JWT token without verification
   * @param {string} token - JWT token
   * @returns {Object} Decoded payload
   */
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error('Token decode failed: ' + error.message);
    }
  }

  /**
   * Generate token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateUserToken(user) {
    const payload = {
      userId: user._id || user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin || false,
      role: user.role || 'user'
    };

    return this.generateToken(payload);
  }

  /**
   * Extract token from request header
   * @param {Object} req - Express request object
   * @returns {string|null} Token or null
   */
  extractTokenFromHeader(req) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return null;

    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return authHeader;
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} True if expired
   */
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Refresh token (generate new token with same payload)
   * @param {string} token - Existing JWT token
   * @returns {string} New JWT token
   */
  refreshToken(token) {
    try {
      const decoded = this.verifyToken(token);
      delete decoded.iat;
      delete decoded.exp;
      return this.generateToken(decoded);
    } catch (error) {
      throw new Error('Token refresh failed: ' + error.message);
    }
  }
}

module.exports = new JWTUtils();
