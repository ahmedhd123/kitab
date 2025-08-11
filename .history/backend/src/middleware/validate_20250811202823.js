/**
 * Validation Middleware
 * Middleware for validating request data using Joi schemas
 */

const { handleValidationError } = require('./errorHandler');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Include all errors
      allowUnknown: false, // Don't allow unknown fields
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      error.isJoi = true;
      return next(handleValidationError(error));
    }

    // Replace the original data with validated/sanitized data
    req[property] = value;
    next();
  };
};

/**
 * Validate multiple properties
 * @param {Object} schemas - Object with schemas for different properties
 */
const validateMultiple = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    Object.keys(schemas).forEach(property => {
      const { error, value } = schemas[property].validate(req[property], {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        errors.push(...error.details.map(detail => ({
          ...detail,
          property
        })));
      } else {
        req[property] = value;
      }
    });

    if (errors.length > 0) {
      const validationError = {
        isJoi: true,
        details: errors
      };
      return next(handleValidationError(validationError));
    }

    next();
  };
};

/**
 * Sanitize request data
 * Remove dangerous characters and normalize data
 */
const sanitize = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Sanitize object recursively
 * @param {*} obj - Object to sanitize
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeValue(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  Object.keys(obj).forEach(key => {
    sanitized[key] = sanitizeObject(obj[key]);
  });

  return sanitized;
};

/**
 * Sanitize individual value
 * @param {*} value - Value to sanitize
 */
const sanitizeValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim(); // Remove leading/trailing whitespace
};

/**
 * Common validation patterns
 */
const patterns = {
  objectId: /^[0-9a-fA-F]{24}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_]{3,30}$/,
  slug: /^[a-z0-9-]+$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  url: /^https?:\/\/.+/
};

/**
 * Quick validation helpers
 */
const isValidObjectId = (id) => patterns.objectId.test(id);
const isValidEmail = (email) => patterns.email.test(email);
const isValidUsername = (username) => patterns.username.test(username);

module.exports = {
  validate,
  validateMultiple,
  sanitize,
  patterns,
  isValidObjectId,
  isValidEmail,
  isValidUsername
};
