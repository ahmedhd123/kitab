/**
 * User Validation Schemas
 * Input validation for user-related operations
 */

const Joi = require('joi');

/**
 * User Registration Validation
 */
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username can only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),

  role: Joi.string()
    .valid('user', 'admin', 'moderator')
    .default('user')
    .messages({
      'any.only': 'Role must be one of: user, admin, moderator'
    })
});

/**
 * User Login Validation
 */
const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .messages({
      'any.required': 'Email or username is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * Update Profile Validation
 */
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),

  bio: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),

  avatar: Joi.string()
    .uri()
    .allow('')
    .messages({
      'string.uri': 'Avatar must be a valid URL'
    }),

  preferences: Joi.object({
    language: Joi.string()
      .valid('en', 'ar')
      .default('en'),
    
    theme: Joi.string()
      .valid('light', 'dark', 'auto')
      .default('light'),
    
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      push: Joi.boolean().default(true),
      recommendations: Joi.boolean().default(true)
    }).default({}),
    
    privacy: Joi.object({
      profileVisibility: Joi.string()
        .valid('public', 'private')
        .default('public'),
      showReadingActivity: Joi.boolean().default(true)
    }).default({})
  }).default({})
});

/**
 * Change Password Validation
 */
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password cannot exceed 128 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Password confirmation does not match new password',
      'any.required': 'Password confirmation is required'
    })
});

/**
 * Update User (Admin) Validation
 */
const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),

  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .messages({
      'string.alphanum': 'Username can only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters'
    }),

  status: Joi.string()
    .valid('active', 'inactive', 'suspended')
    .messages({
      'any.only': 'Status must be one of: active, inactive, suspended'
    }),

  bio: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),

  avatar: Joi.string()
    .uri()
    .allow('')
    .messages({
      'string.uri': 'Avatar must be a valid URL'
    })
});

/**
 * Update User Role Validation
 */
const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid('user', 'admin', 'moderator')
    .required()
    .messages({
      'any.only': 'Role must be one of: user, admin, moderator',
      'any.required': 'Role is required'
    })
});

/**
 * User Query Parameters Validation
 */
const userQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  sortBy: Joi.string()
    .valid('name', 'email', 'username', 'createdAt', 'lastLogin', 'role', 'status')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: name, email, username, createdAt, lastLogin, role, status'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    }),

  search: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'Search query cannot exceed 100 characters'
    }),

  role: Joi.string()
    .valid('user', 'admin', 'moderator')
    .messages({
      'any.only': 'Role filter must be one of: user, admin, moderator'
    }),

  status: Joi.string()
    .valid('active', 'inactive', 'suspended')
    .messages({
      'any.only': 'Status filter must be one of: active, inactive, suspended'
    })
});

/**
 * Search Users Validation
 */
const searchUsersSchema = Joi.object({
  q: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Search query must be at least 1 character long',
      'string.max': 'Search query cannot exceed 100 characters',
      'any.required': 'Search query is required'
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
});

/**
 * Bulk Operations Validation
 */
const bulkCreateUsersSchema = Joi.object({
  users: Joi.array()
    .items(registerSchema.fork(['role'], (schema) => schema.optional()))
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one user is required',
      'array.max': 'Cannot create more than 100 users at once',
      'any.required': 'Users array is required'
    })
});

const bulkUpdateUsersSchema = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        data: updateUserSchema.required()
      })
    )
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one update is required',
      'array.max': 'Cannot update more than 100 users at once',
      'any.required': 'Updates array is required'
    })
});

const bulkDeleteUsersSchema = Joi.object({
  userIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one user ID is required',
      'array.max': 'Cannot delete more than 100 users at once',
      'any.required': 'User IDs array is required'
    })
});

/**
 * Update Preferences Validation
 */
const updatePreferencesSchema = Joi.object({
  language: Joi.string()
    .valid('en', 'ar')
    .messages({
      'any.only': 'Language must be either en or ar'
    }),
  
  theme: Joi.string()
    .valid('light', 'dark', 'auto')
    .messages({
      'any.only': 'Theme must be one of: light, dark, auto'
    }),
  
  notifications: Joi.object({
    email: Joi.boolean(),
    push: Joi.boolean(),
    recommendations: Joi.boolean()
  }),
  
  privacy: Joi.object({
    profileVisibility: Joi.string()
      .valid('public', 'private')
      .messages({
        'any.only': 'Profile visibility must be either public or private'
      }),
    showReadingActivity: Joi.boolean()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateUserSchema,
  updateRoleSchema,
  userQuerySchema,
  searchUsersSchema,
  bulkCreateUsersSchema,
  bulkUpdateUsersSchema,
  bulkDeleteUsersSchema,
  updatePreferencesSchema
};
