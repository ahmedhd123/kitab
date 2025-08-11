const Joi = require('joi');

/**
 * Authentication Validation Schemas
 */

// Register validation schema
const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'any.required': 'Password is required'
    }),
  
  firstName: Joi.string()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  bio: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),
  
  favoriteGenres: Joi.array()
    .items(Joi.string())
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot select more than 10 favorite genres'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),
  
  rememberMe: Joi.boolean()
    .optional()
});

// Change password validation schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.max': 'New password cannot exceed 128 characters',
      'any.required': 'New password is required'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Password confirmation must match new password',
      'any.required': 'Password confirmation is required'
    })
});

// Reset password validation schema
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.max': 'New password cannot exceed 128 characters',
      'any.required': 'New password is required'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Password confirmation must match new password',
      'any.required': 'Password confirmation is required'
    })
});

// Forgot password validation schema
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

// Update profile validation schema
const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  bio: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),
  
  favoriteGenres: Joi.array()
    .items(Joi.string())
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot select more than 10 favorite genres'
    }),
  
  preferences: Joi.object({
    language: Joi.string().valid('ar', 'en').optional(),
    theme: Joi.string().valid('light', 'dark').optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      push: Joi.boolean().optional(),
      sms: Joi.boolean().optional()
    }).optional()
  }).optional()
});

// Validation middleware factory
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

// Custom validation functions
const validateObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password cannot exceed 128 characters' };
  }
  
  return { isValid: true };
};

module.exports = {
  // Schemas
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  updateProfileSchema,
  
  // Middleware
  validateRequest,
  
  // Validation functions
  validateObjectId,
  validateEmail,
  validatePassword
};
