/**
 * Review Routes
 * Routes for review management and operations
 */

const express = require('express');
const reviewController = require('../controllers/reviewController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * Public Routes
 */

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', reviewController.getAllReviews);

// @route   GET /api/reviews/recent
// @desc    Get recent reviews
// @access  Public
router.get('/recent', reviewController.getRecentReviews);

// @route   GET /api/reviews/featured
// @desc    Get featured reviews
// @access  Public
router.get('/featured', reviewController.getFeaturedReviews);

// @route   GET /api/reviews/book/:bookId
// @desc    Get reviews for a specific book
// @access  Public
router.get('/book/:bookId', reviewController.getBookReviews);

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews by a specific user
// @access  Public
router.get('/user/:userId', reviewController.getUserReviews);

// @route   GET /api/reviews/search
// @desc    Search reviews
// @access  Public
router.get('/search', reviewController.searchReviews);

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', reviewController.getReviewById);

/**
 * Protected Routes (require authentication)
 */

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, reviewController.createReview);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', auth, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', auth, reviewController.deleteReview);

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', auth, reviewController.markHelpful);

/**
 * Admin Routes (require admin privileges)
 */

// @route   GET /api/reviews/admin/stats
// @desc    Get review statistics (admin only)
// @access  Private/Admin
router.get('/admin/stats', adminAuth, reviewController.getReviewStats);

/**
 * Utility Routes
 */

// @route   GET /api/reviews/health
// @desc    Reviews service health check
// @access  Public
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Reviews',
    status: 'operational',
    features: {
      reviewManagement: true,
      helpfulVoting: true,
      moderation: true,
      statistics: true
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
