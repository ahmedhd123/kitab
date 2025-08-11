/**
 * Review Routes
 * Routes for review management and operations
 */

const express = require('express');
const router = express.Router();

// Controllers
const reviewController = require('../controllers/reviewController');

// Middleware
const { auth, adminAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Validators
const {
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
} = require('../validators/reviewValidators');

// Public Routes
router.get('/recent', validate(recentFeaturedSchema, 'query'), reviewController.getRecentReviews);
router.get('/featured', validate(recentFeaturedSchema, 'query'), reviewController.getFeaturedReviews);
router.get('/search', validate(searchReviewsSchema, 'query'), reviewController.searchReviews);
router.get('/book/:bookId', validate(bookReviewsQuerySchema, 'query'), reviewController.getBookReviews);
router.get('/book/:bookId/stats', reviewController.getBookReviewStats);
router.get('/user/:userId', validate(userReviewsQuerySchema, 'query'), reviewController.getUserReviews);
router.get('/user/:userId/stats', reviewController.getUserReviewStats);
router.get('/:id', reviewController.getReviewById);

// Protected Routes
router.use(authenticate);

// User Routes (Authenticated)
router.post('/', validate(createReviewSchema), reviewController.createReview);
router.put('/:id', validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.get('/my', validate(userReviewsQuerySchema, 'query'), reviewController.getMyReviews);
router.get('/my/stats', reviewController.getMyReviewStats);
router.get('/book/:bookId/my', reviewController.getMyBookReview);
router.get('/book/:bookId/can-review', reviewController.canReviewBook);
router.post('/:id/helpful', reviewController.markReviewHelpful);
router.post('/:id/flag', reviewController.flagReview);
router.post('/validate', validate(validateReviewContent), reviewController.validateReviewContent);

// Admin/Moderator Routes
router.get('/', authenticate, authorize(['admin', 'moderator']), validate(reviewQuerySchema, 'query'), reviewController.getAllReviews);
router.get('/admin/stats', authorize(['admin', 'moderator']), reviewController.getReviewStats);
router.get('/admin/analytics', authorize(['admin']), reviewController.getReviewAnalytics);
router.get('/admin/trends', authorize(['admin']), reviewController.getReviewTrends);
router.get('/admin/moderation', authorize(['admin', 'moderator']), validate(reviewQuerySchema, 'query'), reviewController.getModerationQueue);

// Bulk Operations (Admin only)
router.post('/bulk', authorize(['admin']), validate(bulkCreateReviewsSchema), reviewController.bulkCreateReviews);
router.put('/bulk', authorize(['admin']), validate(bulkUpdateReviewsSchema), reviewController.bulkUpdateReviews);
router.delete('/bulk', authorize(['admin']), validate(bulkDeleteReviewsSchema), reviewController.bulkDeleteReviews);

module.exports = router;
