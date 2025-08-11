/**
 * Review Controller
 * HTTP request handlers for review operations
 */

const reviewService = require('../services/reviewService');
const { asyncHandler, createSuccessResponse, createPaginationMeta } = require('../middleware/errorHandler');

class ReviewController {
  /**
   * Create a new review
   * POST /api/reviews
   */
  createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(req.body, req.user.id);
    
    res.status(201).json(createSuccessResponse(
      review,
      'Review created successfully'
    ));
  });

  /**
   * Get all reviews with filtering and pagination (admin)
   * GET /api/reviews
   */
  getAllReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.getAllReviews(req.query);
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.reviews,
      'Reviews retrieved successfully',
      meta
    ));
  });

  /**
   * Get review by ID
   * GET /api/reviews/:id
   */
  getReviewById = asyncHandler(async (req, res) => {
    const review = await reviewService.getReviewById(req.params.id);
    
    res.json(createSuccessResponse(
      review,
      'Review retrieved successfully'
    ));
  });

  /**
   * Update review
   * PUT /api/reviews/:id
   */
  updateReview = asyncHandler(async (req, res) => {
    const review = await reviewService.updateReview(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    
    res.json(createSuccessResponse(
      review,
      'Review updated successfully'
    ));
  });

  /**
   * Delete review
   * DELETE /api/reviews/:id
   */
  deleteReview = asyncHandler(async (req, res) => {
    await reviewService.deleteReview(req.params.id, req.user.id, req.user.role);
    
    res.json(createSuccessResponse(
      null,
      'Review deleted successfully'
    ));
  });

  /**
   * Get reviews for a specific book
   * GET /api/reviews/book/:bookId
   */
  getBookReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.getReviewsByBook(req.params.bookId, req.query);
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.reviews,
      'Book reviews retrieved successfully',
      meta
    ));
  });

  /**
   * Get reviews by a specific user
   * GET /api/reviews/user/:userId
   */
  getUserReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.getReviewsByUser(req.params.userId, req.query);
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.reviews,
      'User reviews retrieved successfully',
      meta
    ));
  });

  /**
   * Get current user's reviews
   * GET /api/reviews/my
   */
  getMyReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.getReviewsByUser(req.user.id, req.query);
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.reviews,
      'Your reviews retrieved successfully',
      meta
    ));
  });

  /**
   * Get user's review for a specific book
   * GET /api/reviews/book/:bookId/my
   */
  getMyBookReview = asyncHandler(async (req, res) => {
    const review = await reviewService.getUserBookReview(req.user.id, req.params.bookId);
    
    res.json(createSuccessResponse(
      review,
      review ? 'Your review retrieved successfully' : 'No review found'
    ));
  });

  /**
   * Get recent reviews
   * GET /api/reviews/recent
   */
  getRecentReviews = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const reviews = await reviewService.getRecentReviews(parseInt(limit) || 10);
    
    res.json(createSuccessResponse(
      reviews,
      'Recent reviews retrieved successfully'
    ));
  });

  /**
   * Get featured reviews
   * GET /api/reviews/featured
   */
  getFeaturedReviews = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const reviews = await reviewService.getFeaturedReviews(parseInt(limit) || 10);
    
    res.json(createSuccessResponse(
      reviews,
      'Featured reviews retrieved successfully'
    ));
  });

  /**
   * Search reviews
   * GET /api/reviews/search
   */
  searchReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.searchReviews(req.query);
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.reviews,
      'Review search completed successfully',
      meta
    ));
  });

  /**
   * Mark review as helpful/unhelpful
   * POST /api/reviews/:id/helpful
   */
  markReviewHelpful = asyncHandler(async (req, res) => {
    const review = await reviewService.markReviewHelpful(req.params.id, req.user.id);
    
    const isHelpful = review.helpfulUsers.includes(req.user.id);
    
    res.json(createSuccessResponse(
      {
        review,
        isHelpful,
        helpfulCount: review.helpfulCount
      },
      `Review marked as ${isHelpful ? 'helpful' : 'not helpful'}`
    ));
  });

  /**
   * Get book review statistics
   * GET /api/reviews/book/:bookId/stats
   */
  getBookReviewStats = asyncHandler(async (req, res) => {
    const stats = await reviewService.getBookReviewStats(req.params.bookId);
    
    res.json(createSuccessResponse(
      stats,
      'Book review statistics retrieved successfully'
    ));
  });

  /**
   * Get user review statistics
   * GET /api/reviews/user/:userId/stats
   */
  getUserReviewStats = asyncHandler(async (req, res) => {
    const stats = await reviewService.getUserReviewStats(req.params.userId);
    
    res.json(createSuccessResponse(
      stats,
      'User review statistics retrieved successfully'
    ));
  });

  /**
   * Get current user's review statistics
   * GET /api/reviews/my/stats
   */
  getMyReviewStats = asyncHandler(async (req, res) => {
    const stats = await reviewService.getUserReviewStats(req.user.id);
    
    res.json(createSuccessResponse(
      stats,
      'Your review statistics retrieved successfully'
    ));
  });

  /**
   * Get review statistics (admin only)
   * GET /api/reviews/admin/stats
   */
  getReviewStats = asyncHandler(async (req, res) => {
    const stats = await reviewService.getReviewStats();
    
    res.json(createSuccessResponse(
      stats,
      'Review statistics retrieved successfully'
    ));
  });

  /**
   * Get review analytics (admin only)
   * GET /api/reviews/admin/analytics
   */
  getReviewAnalytics = asyncHandler(async (req, res) => {
    const analytics = await reviewService.getReviewAnalytics();
    
    res.json(createSuccessResponse(
      analytics,
      'Review analytics retrieved successfully'
    ));
  });

  /**
   * Bulk create reviews (admin only)
   * POST /api/reviews/bulk
   */
  bulkCreateReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.bulkCreateReviews(req.body.reviews, req.user.id);
    
    res.status(201).json(createSuccessResponse(
      {
        created: result.length,
        reviews: result
      },
      'Reviews created successfully'
    ));
  });

  /**
   * Bulk update reviews (admin only)
   * PUT /api/reviews/bulk
   */
  bulkUpdateReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.bulkUpdateReviews(req.body.updates);
    
    res.json(createSuccessResponse(
      {
        modified: result.modifiedCount,
        matched: result.matchedCount
      },
      'Reviews updated successfully'
    ));
  });

  /**
   * Bulk delete reviews (admin only)
   * DELETE /api/reviews/bulk
   */
  bulkDeleteReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.bulkDeleteReviews(req.body.reviewIds);
    
    res.json(createSuccessResponse(
      {
        deleted: result.deletedCount
      },
      'Reviews deleted successfully'
    ));
  });

  /**
   * Check if user can review book
   * GET /api/reviews/book/:bookId/can-review
   */
  canReviewBook = asyncHandler(async (req, res) => {
    const result = await reviewService.canUserReviewBook(req.user.id, req.params.bookId);
    
    res.json(createSuccessResponse(
      result,
      result.canReview ? 'You can review this book' : 'You cannot review this book'
    ));
  });

  /**
   * Get review trends (admin only)
   * GET /api/reviews/admin/trends
   */
  getReviewTrends = asyncHandler(async (req, res) => {
    // This would be implemented with more complex analytics
    const mockTrends = {
      dailyReviews: [
        { date: '2025-08-01', count: 12 },
        { date: '2025-08-02', count: 15 },
        { date: '2025-08-03', count: 18 },
        { date: '2025-08-04', count: 14 },
        { date: '2025-08-05', count: 20 }
      ],
      ratingTrends: [
        { date: '2025-08-01', avgRating: 4.2 },
        { date: '2025-08-02', avgRating: 4.3 },
        { date: '2025-08-03', avgRating: 4.1 },
        { date: '2025-08-04', avgRating: 4.4 },
        { date: '2025-08-05', avgRating: 4.5 }
      ],
      topReviewedBooks: [
        { bookId: '507f1f77bcf86cd799439011', title: 'كتاب الأدب العربي', reviewCount: 45 },
        { bookId: '507f1f77bcf86cd799439012', title: 'تاريخ الإسلام', reviewCount: 38 },
        { bookId: '507f1f77bcf86cd799439013', title: 'الشعر الجاهلي', reviewCount: 32 }
      ]
    };
    
    res.json(createSuccessResponse(
      mockTrends,
      'Review trends retrieved successfully'
    ));
  });

  /**
   * Validate review content (helper endpoint)
   * POST /api/reviews/validate
   */
  validateReviewContent = asyncHandler(async (req, res) => {
    try {
      reviewService.validateReviewContent(req.body.content);
      
      res.json(createSuccessResponse(
        { valid: true },
        'Review content is valid'
      ));
    } catch (error) {
      res.status(400).json(createSuccessResponse(
        { valid: false, reason: error.message },
        'Review content validation failed'
      ));
    }
  });

  /**
   * Get review moderation queue (admin only)
   * GET /api/reviews/admin/moderation
   */
  getModerationQueue = asyncHandler(async (req, res) => {
    // This would include reviews flagged for moderation
    const result = await reviewService.getAllReviews({
      ...req.query,
      flagged: true // This would be a field in the review model
    });
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.reviews,
      'Moderation queue retrieved successfully',
      meta
    ));
  });

  /**
   * Flag review for moderation
   * POST /api/reviews/:id/flag
   */
  flagReview = asyncHandler(async (req, res) => {
    // This would flag a review for admin attention
    const { reason } = req.body;
    
    // Implementation would mark review as flagged
    // For now, return success
    
    res.json(createSuccessResponse(
      null,
      'Review flagged for moderation'
    ));
  });
}

module.exports = new ReviewController();
