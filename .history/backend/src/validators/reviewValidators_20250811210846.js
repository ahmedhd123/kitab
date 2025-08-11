/**
 * Review Validation Schemas
 * Input validation for review-related operations
 */

const Joi = require('joi');

/**
 * Create Review Validation
 */
const createReviewSchema = Joi.object({
  bookId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid book ID',
      'any.required': 'Book ID is required'
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be a whole number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),

  title: Joi.string()
    .max(100)
    .messages({
      'string.max': 'Review title cannot exceed 100 characters'
    }),

  content: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Review content must be at least 10 characters long',
      'string.max': 'Review content cannot exceed 2000 characters',
      'any.required': 'Review content is required'
    })
});

/**
 * Update Review Validation
 */
const updateReviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be a whole number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5'
    }),

  title: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'Review title cannot exceed 100 characters'
    }),

  content: Joi.string()
    .min(10)
    .max(2000)
    .messages({
      'string.min': 'Review content must be at least 10 characters long',
      'string.max': 'Review content cannot exceed 2000 characters'
    })
});

/**
 * Review Query Parameters Validation
 */
const reviewQuerySchema = Joi.object({
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
    .valid('createdAt', 'updatedAt', 'rating', 'helpfulCount')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: createdAt, updatedAt, rating, helpfulCount'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating filter must be a number',
      'number.integer': 'Rating filter must be a whole number',
      'number.min': 'Rating filter must be at least 1',
      'number.max': 'Rating filter cannot exceed 5'
    }),

  search: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'Search query cannot exceed 100 characters'
    }),

  bookId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid book ID'
    }),

  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid user ID'
    })
});

/**
 * Book Reviews Query Validation
 */
const bookReviewsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),

  sortBy: Joi.string()
    .valid('createdAt', 'rating', 'helpfulCount')
    .default('createdAt'),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc'),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating filter must be a number',
      'number.integer': 'Rating filter must be a whole number',
      'number.min': 'Rating filter must be at least 1',
      'number.max': 'Rating filter cannot exceed 5'
    })
});

/**
 * User Reviews Query Validation
 */
const userReviewsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),

  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'rating')
    .default('createdAt'),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
});

/**
 * Search Reviews Validation
 */
const searchReviewsSchema = Joi.object({
  query: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Search query is required',
      'string.max': 'Search query cannot exceed 100 characters',
      'any.required': 'Search query is required'
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating filter must be a number',
      'number.integer': 'Rating filter must be a whole number',
      'number.min': 'Rating filter must be at least 1',
      'number.max': 'Rating filter cannot exceed 5'
    }),

  bookId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid book ID'
    }),

  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid user ID'
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'rating', 'helpfulCount', 'relevance')
    .default('relevance'),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
});

/**
 * Mark Helpful Validation
 */
const markHelpfulSchema = Joi.object({
  helpful: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Helpful must be true or false',
      'any.required': 'Helpful value is required'
    })
});

/**
 * Bulk Operations Validation
 */
const bulkCreateReviewsSchema = Joi.object({
  reviews: Joi.array()
    .items(createReviewSchema)
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one review is required',
      'array.max': 'Cannot create more than 50 reviews at once',
      'any.required': 'Reviews array is required'
    })
});

const bulkUpdateReviewsSchema = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        id: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid review ID'
          }),
        data: updateReviewSchema.required(),
        bookId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .messages({
            'string.pattern.base': 'Invalid book ID'
          })
      })
    )
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one update is required',
      'array.max': 'Cannot update more than 50 reviews at once',
      'any.required': 'Updates array is required'
    })
});

const bulkDeleteReviewsSchema = Joi.object({
  reviewIds: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one review ID is required',
      'array.max': 'Cannot delete more than 50 reviews at once',
      'any.required': 'Review IDs array is required'
    })
});

/**
 * Recent/Featured Reviews Query Validation
 */
const recentFeaturedSchema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    })
});

/**
 * Review Stats Query Validation
 */
const reviewStatsSchema = Joi.object({
  bookId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid book ID'
    }),

  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid user ID'
    }),

  period: Joi.string()
    .valid('day', 'week', 'month', 'year', 'all')
    .default('all')
    .messages({
      'any.only': 'Period must be one of: day, week, month, year, all'
    })
});

/**
 * Review Content Validation (Advanced)
 */
const validateReviewContent = Joi.object({
  content: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .custom((value, helpers) => {
      // Check for minimum word count
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 5) {
        return helpers.error('any.invalid', { 
          message: 'Review must contain at least 5 words' 
        });
      }

      // Check for repeated characters (potential spam)
      if (/(.)\1{4,}/.test(value)) {
        return helpers.error('any.invalid', { 
          message: 'Review contains too many repeated characters' 
        });
      }

      // Check for all caps (potential spam)
      const capsRatio = (value.match(/[A-Z]/g) || []).length / value.length;
      if (capsRatio > 0.7 && value.length > 20) {
        return helpers.error('any.invalid', { 
          message: 'Review contains too many capital letters' 
        });
      }

      return value;
    })
    .messages({
      'string.min': 'Review content must be at least 10 characters long',
      'string.max': 'Review content cannot exceed 2000 characters',
      'any.required': 'Review content is required',
      'any.invalid': '{{#message}}'
    })
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
  bookReviewsQuerySchema,
  userReviewsQuerySchema,
  searchReviewsSchema,
  markHelpfulSchema,
  bulkCreateReviewsSchema,
  bulkUpdateReviewsSchema,
  bulkDeleteReviewsSchema,
  recentFeaturedSchema,
  reviewStatsSchema,
  validateReviewContent
};
