/**
 * Book Validation Schemas
 * Input validation for book-related operations
 */

const Joi = require('joi');

/**
 * Create Book Validation
 */
const createBookSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title is required',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),

  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
      'any.required': 'Description is required'
    }),

  author: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid author ID',
      'any.required': 'Author is required'
    }),

  categories: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(5)
    .required()
    .messages({
      'array.min': 'At least one category is required',
      'array.max': 'Maximum 5 categories allowed',
      'any.required': 'Categories are required'
    }),

  language: Joi.string()
    .valid('ar', 'en', 'fr', 'es', 'de', 'other')
    .default('ar')
    .messages({
      'any.only': 'Language must be one of: ar, en, fr, es, de, other'
    }),

  isbn: Joi.string()
    .pattern(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/)
    .messages({
      'string.pattern.base': 'Invalid ISBN format'
    }),

  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .messages({
      'number.min': 'Published year must be after 1000',
      'number.max': 'Published year cannot be in the future'
    }),

  publisher: Joi.string()
    .max(100)
    .messages({
      'string.max': 'Publisher name cannot exceed 100 characters'
    }),

  pageCount: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .messages({
      'number.min': 'Page count must be at least 1',
      'number.max': 'Page count cannot exceed 10,000'
    }),

  format: Joi.string()
    .valid('pdf', 'epub', 'mobi', 'txt', 'docx')
    .default('pdf')
    .messages({
      'any.only': 'Format must be one of: pdf, epub, mobi, txt, docx'
    }),

  fileSize: Joi.number()
    .integer()
    .min(1)
    .max(50 * 1024 * 1024) // 50MB
    .messages({
      'number.min': 'File size must be at least 1 byte',
      'number.max': 'File size cannot exceed 50MB'
    }),

  featured: Joi.boolean()
    .default(false)
});

/**
 * Update Book Validation
 */
const updateBookSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot exceed 200 characters'
    }),

  description: Joi.string()
    .min(10)
    .max(2000)
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 2000 characters'
    }),

  author: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid author ID'
    }),

  categories: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(5)
    .messages({
      'array.min': 'At least one category is required',
      'array.max': 'Maximum 5 categories allowed'
    }),

  language: Joi.string()
    .valid('ar', 'en', 'fr', 'es', 'de', 'other')
    .messages({
      'any.only': 'Language must be one of: ar, en, fr, es, de, other'
    }),

  isbn: Joi.string()
    .pattern(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Invalid ISBN format'
    }),

  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .messages({
      'number.min': 'Published year must be after 1000',
      'number.max': 'Published year cannot be in the future'
    }),

  publisher: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'Publisher name cannot exceed 100 characters'
    }),

  pageCount: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .messages({
      'number.min': 'Page count must be at least 1',
      'number.max': 'Page count cannot exceed 10,000'
    }),

  format: Joi.string()
    .valid('pdf', 'epub', 'mobi', 'txt', 'docx')
    .messages({
      'any.only': 'Format must be one of: pdf, epub, mobi, txt, docx'
    }),

  featured: Joi.boolean()
});

/**
 * Book Query Parameters Validation
 */
const bookQuerySchema = Joi.object({
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
    .default(12)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  sortBy: Joi.string()
    .valid('title', 'createdAt', 'updatedAt', 'rating', 'views', 'downloads', 'publishedYear')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: title, createdAt, updatedAt, rating, views, downloads, publishedYear'
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

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid category ID'
    }),

  author: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid author ID'
    }),

  language: Joi.string()
    .valid('ar', 'en', 'fr', 'es', 'de', 'other')
    .messages({
      'any.only': 'Language must be one of: ar, en, fr, es, de, other'
    }),

  status: Joi.string()
    .valid('draft', 'published', 'archived', 'banned')
    .messages({
      'any.only': 'Status must be one of: draft, published, archived, banned'
    }),

  featured: Joi.boolean()
    .messages({
      'boolean.base': 'Featured must be true or false'
    }),

  minRating: Joi.number()
    .min(0)
    .max(5)
    .messages({
      'number.min': 'Minimum rating must be at least 0',
      'number.max': 'Minimum rating cannot exceed 5'
    }),

  maxRating: Joi.number()
    .min(0)
    .max(5)
    .messages({
      'number.min': 'Maximum rating must be at least 0',
      'number.max': 'Maximum rating cannot exceed 5'
    })
});

/**
 * Search Books Validation
 */
const searchBooksSchema = Joi.object({
  query: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Search query is required',
      'string.max': 'Search query cannot exceed 100 characters',
      'any.required': 'Search query is required'
    }),

  categories: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .max(10)
    .default([])
    .messages({
      'array.max': 'Maximum 10 categories allowed'
    }),

  authors: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .max(10)
    .default([])
    .messages({
      'array.max': 'Maximum 10 authors allowed'
    }),

  languages: Joi.array()
    .items(Joi.string().valid('ar', 'en', 'fr', 'es', 'de', 'other'))
    .max(5)
    .default([])
    .messages({
      'array.max': 'Maximum 5 languages allowed'
    }),

  minRating: Joi.number()
    .min(0)
    .max(5)
    .messages({
      'number.min': 'Minimum rating must be at least 0',
      'number.max': 'Minimum rating cannot exceed 5'
    }),

  maxRating: Joi.number()
    .min(0)
    .max(5)
    .messages({
      'number.min': 'Maximum rating must be at least 0',
      'number.max': 'Maximum rating cannot exceed 5'
    }),

  featured: Joi.boolean(),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(12),

  sortBy: Joi.string()
    .valid('relevance', 'newest', 'oldest', 'rating', 'popular', 'title')
    .default('relevance')
    .messages({
      'any.only': 'Sort by must be one of: relevance, newest, oldest, rating, popular, title'
    })
});

/**
 * Update Book Status Validation
 */
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('draft', 'published', 'archived', 'banned')
    .required()
    .messages({
      'any.only': 'Status must be one of: draft, published, archived, banned',
      'any.required': 'Status is required'
    })
});

/**
 * Toggle Featured Validation
 */
const toggleFeaturedSchema = Joi.object({
  featured: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Featured must be true or false',
      'any.required': 'Featured value is required'
    })
});

/**
 * Bulk Operations Validation
 */
const bulkCreateBooksSchema = Joi.object({
  books: Joi.array()
    .items(createBookSchema.fork(['fileSize'], (schema) => schema.optional()))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one book is required',
      'array.max': 'Cannot create more than 50 books at once',
      'any.required': 'Books array is required'
    })
});

const bulkUpdateBooksSchema = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        id: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid book ID'
          }),
        data: updateBookSchema.required()
      })
    )
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one update is required',
      'array.max': 'Cannot update more than 50 books at once',
      'any.required': 'Updates array is required'
    })
});

const bulkDeleteBooksSchema = Joi.object({
  bookIds: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one book ID is required',
      'array.max': 'Cannot delete more than 50 books at once',
      'any.required': 'Book IDs array is required'
    })
});

/**
 * Book Rating Update Validation
 */
const updateRatingSchema = Joi.object({
  rating: Joi.number()
    .min(0)
    .max(5)
    .precision(2)
    .required()
    .messages({
      'number.min': 'Rating must be at least 0',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),

  reviewCount: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.min': 'Review count must be at least 0',
      'any.required': 'Review count is required'
    })
});

/**
 * Popular Books Query Validation
 */
const popularBooksSchema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    }),

  timeframe: Joi.string()
    .valid('day', 'week', 'month', 'year', 'all')
    .default('all')
    .messages({
      'any.only': 'Timeframe must be one of: day, week, month, year, all'
    })
});

/**
 * Category/Author Books Query Validation
 */
const categoryAuthorBooksSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(12),

  sortBy: Joi.string()
    .valid('title', 'createdAt', 'rating', 'views', 'downloads')
    .default('createdAt'),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
});

module.exports = {
  createBookSchema,
  updateBookSchema,
  bookQuerySchema,
  searchBooksSchema,
  updateStatusSchema,
  toggleFeaturedSchema,
  bulkCreateBooksSchema,
  bulkUpdateBooksSchema,
  bulkDeleteBooksSchema,
  updateRatingSchema,
  popularBooksSchema,
  categoryAuthorBooksSchema
};
