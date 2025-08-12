/**
 * Review Service
 * Business logic layer for review operations
 */

const reviewRepository = require('../repositories/reviewRepository');
const bookRepository = require('../repositories/bookRepository');
const userRepository = require('../repositories/userRepository');
const { AppError } = require('../middleware/errorHandler');

class ReviewService {
  /**
   * Create a new review
   */
  async createReview(reviewData, userId) {
    try {
      const { book: bookId, rating, title, content, readingStatus } = reviewData;

      // Verify book exists
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      // Check if user already reviewed this book
      const existingReview = await reviewRepository.findUserBookReview(userId, bookId);
      if (existingReview) {
        throw new AppError('You have already reviewed this book', 400, 'DUPLICATE_REVIEW');
      }

      // Create review
      const newReviewData = {
        user: userId,
        book: bookId,
        rating,
        title: title || `Review for ${book.title}`,
        content,
        helpfulCount: 0,
        helpfulUsers: []
      };

      const review = await reviewRepository.create(newReviewData);

      // Update book rating and review count
      await this.updateBookRating(bookId);

      return review;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId) {
    try {
      const review = await reviewRepository.findById(reviewId);
      if (!review) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      return review;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update review
   */
  async updateReview(reviewId, updateData, userId, userRole) {
    try {
      const review = await reviewRepository.findById(reviewId);
      if (!review) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      // Check permissions
      if (userRole !== 'admin' && review.user._id.toString() !== userId) {
        throw new AppError('Not authorized to update this review', 403, 'UNAUTHORIZED');
      }

      const updatedReview = await reviewRepository.updateById(reviewId, updateData);

      // Update book rating if rating changed
      if (updateData.rating && updateData.rating !== review.rating) {
        await this.updateBookRating(review.book._id);
      }

      return updatedReview;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId, userId, userRole) {
    try {
      const review = await reviewRepository.findById(reviewId);
      if (!review) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      // Check permissions
      if (userRole !== 'admin' && review.user._id.toString() !== userId) {
        throw new AppError('Not authorized to delete this review', 403, 'UNAUTHORIZED');
      }

      const deletedReview = await reviewRepository.deleteById(reviewId);

      // Update book rating after deletion
      await this.updateBookRating(review.book._id);

      return deletedReview;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reviews by book
   */
  async getReviewsByBook(bookId, options) {
    try {
      // Verify book exists
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      const result = await reviewRepository.findByBook(bookId, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reviews by user
   */
  async getReviewsByUser(userId, options) {
    try {
      // Verify user exists
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      const result = await reviewRepository.findByUser(userId, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's review for a specific book
   */
  async getUserBookReview(userId, bookId) {
    try {
      const review = await reviewRepository.findUserBookReview(userId, bookId);
      return review;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all reviews (admin)
   */
  async getAllReviews(options) {
    try {
      const result = await reviewRepository.findAll(options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent reviews
   */
  async getRecentReviews(limit = 10) {
    try {
      const reviews = await reviewRepository.getRecent(limit);
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get featured reviews
   */
  async getFeaturedReviews(limit = 10) {
    try {
      const reviews = await reviewRepository.getFeatured(limit);
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(reviewId, userId) {
    try {
      const review = await reviewRepository.markHelpful(reviewId, userId);
      return review;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get book review statistics
   */
  async getBookReviewStats(bookId) {
    try {
      // Verify book exists
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      const stats = await reviewRepository.getBookReviewStats(bookId);
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user review statistics
   */
  async getUserReviewStats(userId) {
    try {
      // Verify user exists
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      const stats = await reviewRepository.getUserReviewStats(userId);
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get review statistics (admin)
   */
  async getReviewStats() {
    try {
      const stats = await reviewRepository.getStats();
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk operations (admin only)
   */
  async bulkCreateReviews(reviews, userId) {
    try {
      const reviewsWithMetadata = reviews.map(review => ({
        ...review,
        user: userId,
        helpfulCount: 0,
        helpfulUsers: []
      }));

      const result = await reviewRepository.bulkCreate(reviewsWithMetadata);
      
      // Update book ratings for affected books
      const bookIds = [...new Set(reviews.map(r => r.book))];
      await Promise.all(bookIds.map(bookId => this.updateBookRating(bookId)));

      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdateReviews(updates) {
    try {
      const result = await reviewRepository.bulkUpdate(updates);
      
      // Update book ratings for affected books if rating changed
      const booksToUpdate = updates.filter(update => update.data.rating);
      if (booksToUpdate.length > 0) {
        const bookIds = [...new Set(booksToUpdate.map(update => update.bookId))];
        await Promise.all(bookIds.map(bookId => this.updateBookRating(bookId)));
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkDeleteReviews(reviewIds) {
    try {
      // Get book IDs before deletion
      const reviews = await Promise.all(
        reviewIds.map(id => reviewRepository.findById(id))
      );
      const bookIds = [...new Set(reviews.filter(r => r).map(r => r.book._id))];

      const result = await reviewRepository.bulkDelete(reviewIds);
      
      // Update book ratings for affected books
      await Promise.all(bookIds.map(bookId => this.updateBookRating(bookId)));

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search reviews
   */
  async searchReviews(searchOptions) {
    try {
      const result = await reviewRepository.findAll(searchOptions);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get review analytics for dashboard
   */
  async getReviewAnalytics() {
    try {
      const [
        totalReviews,
        recentReviews,
        averageRating,
        ratingDistribution
      ] = await Promise.all([
        reviewRepository.findAll({ limit: 1 }).then(r => r.total),
        reviewRepository.getRecent(5),
        this.getOverallAverageRating(),
        this.getRatingDistribution()
      ]);

      return {
        totalReviews,
        recentReviews,
        averageRating,
        ratingDistribution,
        trends: {
          reviewsThisMonth: await this.getMonthlyReviewCount(),
          averageRatingTrend: await this.getAverageRatingTrend()
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Helper Methods
   */

  /**
   * Update book rating and review count
   */
  async updateBookRating(bookId) {
    try {
      const stats = await reviewRepository.getBookReviewStats(bookId);
      
      // Update book with new rating and review count
      await bookRepository.updateById(bookId, {
        rating: parseFloat(stats.averageRating.toFixed(2)),
        reviewCount: stats.totalReviews
      });
    } catch (error) {
      console.error('Error updating book rating:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  /**
   * Get overall average rating
   */
  async getOverallAverageRating() {
    try {
      const stats = await reviewRepository.getStats();
      return stats.averageRating;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get rating distribution
   */
  async getRatingDistribution() {
    try {
      const stats = await reviewRepository.getStats();
      return stats.ratingDistribution;
    } catch (error) {
      return {};
    }
  }

  /**
   * Get monthly review count
   */
  async getMonthlyReviewCount() {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const result = await reviewRepository.findAll({
        createdAt: { $gte: startOfMonth },
        limit: 1
      });
      
      return result.total;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get average rating trend (last 6 months)
   */
  async getAverageRatingTrend() {
    try {
      // This would require more complex aggregation
      // For now, return mock data
      return [
        { month: 'Jan', rating: 4.2 },
        { month: 'Feb', rating: 4.3 },
        { month: 'Mar', rating: 4.1 },
        { month: 'Apr', rating: 4.4 },
        { month: 'May', rating: 4.5 },
        { month: 'Jun', rating: 4.3 }
      ];
    } catch (error) {
      return [];
    }
  }

  /**
   * Validate review content
   */
  validateReviewContent(content) {
    if (!content || content.trim().length < 10) {
      throw new AppError('Review content must be at least 10 characters long', 400, 'INVALID_CONTENT');
    }

    if (content.length > 2000) {
      throw new AppError('Review content cannot exceed 2000 characters', 400, 'CONTENT_TOO_LONG');
    }

    // Check for inappropriate content (basic check)
    const inappropriateWords = ['spam', 'fake', 'bot'];
    const lowerContent = content.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerContent.includes(word)) {
        throw new AppError('Review content contains inappropriate language', 400, 'INAPPROPRIATE_CONTENT');
      }
    }

    return true;
  }

  /**
   * Check if user can review book
   */
  async canUserReviewBook(userId, bookId) {
    try {
      // Check if user already reviewed
      const existingReview = await reviewRepository.findUserBookReview(userId, bookId);
      if (existingReview) {
        return { canReview: false, reason: 'Already reviewed' };
      }

      // Check if book exists
      const book = await bookRepository.findById(bookId);
      if (!book) {
        return { canReview: false, reason: 'Book not found' };
      }

      // Additional checks can be added here (e.g., user must have read the book)
      
      return { canReview: true };
    } catch (error) {
      return { canReview: false, reason: 'Error checking permissions' };
    }
  }
}

module.exports = new ReviewService();
