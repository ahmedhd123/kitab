/**
 * Book Routes
 * Handles book-related endpoints
 */

const express = require('express');
const bookController = require('../controllers/bookController');
const { auth, adminAuth } = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

const router = express.Router();

/**
 * Public Routes
 */

// @route   GET /api/books
// @desc    Get all books (public listing)
// @access  Public
router.get('/', bookController.getAllBooks);

// @route   GET /api/books/featured
// @desc    Get featured books
// @access  Public
router.get('/featured', bookController.getFeaturedBooks);

// @route   GET /api/books/popular
// @desc    Get popular books
// @access  Public
router.get('/popular', bookController.getPopularBooks);

// @route   GET /api/books/recent
// @desc    Get recently added books
// @access  Public
router.get('/recent', bookController.getRecentBooks);

// @route   GET /api/books/search
// @desc    Search books
// @access  Public
router.get('/search', bookController.searchBooks);

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', bookController.getBookById);

/**
 * Protected Routes (require authentication)
 */

// @route   POST /api/books
// @desc    Create a new book
// @access  Private
router.post('/', auth, bookController.createBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private
router.put('/:id', auth, bookController.updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private
router.delete('/:id', auth, bookController.deleteBook);

// @route   GET /api/books/:id/download
// @desc    Download book file
// @access  Private
router.get('/:id/download', auth, bookController.downloadBook);

/**
 * Admin Routes (require admin privileges)
 */

// @route   GET /api/books/admin/stats
// @desc    Get book statistics (admin only)
// @access  Private/Admin
router.get('/admin/stats', adminAuth, bookController.getBookStats);

// @route   PATCH /api/books/:id/featured
// @desc    Toggle book featured status (admin only)
// @access  Private/Admin
router.patch('/:id/featured', adminAuth, bookController.toggleFeatured);

// @route   PATCH /api/books/:id/status
// @desc    Update book status (admin only)
// @access  Private/Admin
router.patch('/:id/status', adminAuth, bookController.updateBookStatus);

/**
 * Utility Routes
 */

// @route   GET /api/books/health
// @desc    Books service health check
// @access  Public
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Books',
    status: 'operational',
    features: {
      catalog: true,
      search: true,
      upload: true,
      digitalFiles: true,
      reviews: true,
      recommendations: true
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
