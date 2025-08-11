const bcrypt = require('bcryptjs');

/**
 * Encryption Utility Functions
 */
class EncryptionUtils {
  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  }

  /**
   * Hash password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error('Password hashing failed: ' + error.message);
    }
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if passwords match
   */
  async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Password comparison failed: ' + error.message);
    }
  }

  /**
   * Generate random string
   * @param {number} length - Length of string
   * @returns {string} Random string
   */
  generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate secure random token
   * @param {number} length - Length of token
   * @returns {string} Random token
   */
  generateSecureToken(length = 64) {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  validatePasswordStrength(password) {
    const result = {
      isValid: true,
      errors: [],
      score: 0
    };

    // Minimum length
    if (password.length < 6) {
      result.errors.push('Password must be at least 6 characters long');
      result.isValid = false;
    } else {
      result.score += 1;
    }

    // Contains uppercase
    if (/[A-Z]/.test(password)) {
      result.score += 1;
    }

    // Contains lowercase
    if (/[a-z]/.test(password)) {
      result.score += 1;
    }

    // Contains numbers
    if (/\d/.test(password)) {
      result.score += 1;
    }

    // Contains special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.score += 1;
    }

    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      result.errors.push('Password is too common');
      result.isValid = false;
      result.score = 0;
    }

    return result;
  }

  /**
   * Sanitize string input
   * @param {string} input - Input string
   * @returns {string} Sanitized string
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove basic HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .substring(0, 1000); // Limit length
  }

  /**
   * Generate hash for email verification
   * @param {string} email - User email
   * @returns {string} Verification hash
   */
  generateEmailVerificationHash(email) {
    const crypto = require('crypto');
    const timestamp = Date.now().toString();
    return crypto
      .createHash('sha256')
      .update(email + timestamp + this.generateRandomString())
      .digest('hex');
  }

  /**
   * Generate password reset token
   * @param {string} userId - User ID
   * @returns {Object} Reset token and expiry
   */
  generatePasswordResetToken(userId) {
    const token = this.generateSecureToken(32);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    return {
      token,
      expires,
      hash: require('crypto')
        .createHash('sha256')
        .update(userId + token)
        .digest('hex')
    };
  }
}

module.exports = new EncryptionUtils();
