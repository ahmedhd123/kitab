/**
 * Error Handling Middleware
 * Centralized error handling for the entire application
 */

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Error Handler Wrapper
 * Wraps async functions to catch errors automatically
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Development Error Handler
 * Provides detailed error information for development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      details: err.details,
      stack: err.stack
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Production Error Handler
 * Provides user-friendly error messages for production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Handle Cast Errors (Invalid MongoDB ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

/**
 * Handle Duplicate Field Errors
 */
const handleDuplicateFieldsDB = (err) => {
  const duplicateFields = Object.keys(err.keyValue).join(', ');
  const message = `Duplicate field value(s): ${duplicateFields}. Please use another value!`;
  return new AppError(message, 400, 'DUPLICATE_FIELD');
};

/**
 * Handle Validation Errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR', errors);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => 
  new AppError('Invalid token. Please log in again!', 401, 'INVALID_TOKEN');

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401, 'EXPIRED_TOKEN');

/**
 * Handle Multer Errors (File Upload)
 */
const handleMulterError = (err) => {
  let message = 'File upload error';
  let errorCode = 'FILE_UPLOAD_ERROR';

  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      message = 'File too large. Maximum size allowed is 50MB.';
      errorCode = 'FILE_TOO_LARGE';
      break;
    case 'LIMIT_FILE_COUNT':
      message = 'Too many files. Maximum 10 files allowed.';
      errorCode = 'TOO_MANY_FILES';
      break;
    case 'LIMIT_UNEXPECTED_FILE':
      message = 'Unexpected file field. Please check your form.';
      errorCode = 'UNEXPECTED_FILE';
      break;
    default:
      message = err.message || 'File upload failed';
  }

  return new AppError(message, 400, errorCode);
};

/**
 * Handle Rate Limit Errors
 */
const handleRateLimitError = () =>
  new AppError('Too many requests from this IP, please try again later.', 429, 'RATE_LIMIT_EXCEEDED');

/**
 * Main Error Handling Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('🚨 Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }

  // JWT invalid signature
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    error = handleMulterError(error);
  }

  // Rate limit errors
  if (err.status === 429) {
    error = handleRateLimitError();
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server!`;
  const error = new AppError(message, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

/**
 * Validation Error Handler
 * For handling Joi validation errors
 */
const handleValidationError = (error) => {
  if (error.isJoi) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      type: detail.type
    }));

    return new AppError('Validation failed', 400, 'VALIDATION_ERROR', details);
  }
  return error;
};

/**
 * Database Connection Error Handler
 */
const handleDatabaseError = (error) => {
  if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    return new AppError('Database connection failed', 503, 'DATABASE_ERROR');
  }
  return error;
};

/**
 * Create standardized error response
 */
const createErrorResponse = (message, statusCode = 500, errorCode = null, details = null) => {
  return {
    success: false,
    message,
    errorCode,
    details,
    timestamp: new Date().toISOString()
  };
};

/**
 * Success Response Helper
 */
const createSuccessResponse = (data = null, message = 'Success', meta = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

/**
 * Pagination Meta Helper
 */
const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

module.exports = {
  AppError,
  asyncHandler,
  globalErrorHandler,
  notFoundHandler,
  handleValidationError,
  handleDatabaseError,
  createErrorResponse,
  createSuccessResponse,
  createPaginationMeta
};
