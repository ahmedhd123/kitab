/**
 * Review Repository
 * Data access layer for review operations
 */

const Review = require('../models/Review');
const { AppError } = require('../middleware/errorHandler');

class ReviewRepository {
  /**
   * Create a new review
   */
  async create(reviewData) {
    try {
      const review = new Review(reviewData);
      await review.save();
      return await this.findById(review._id); // Return populated review
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('You have already reviewed this book', 400, 'DUPLICATE_REVIEW');
      }
      throw error;
    }
  }

  /**
   * Find review by ID
   */
  async findById(id) {
    try {
      const review = await Review.findById(id)
        .populate('user', 'name username avatar')
        .populate('book', 'title slug author coverUrl');
      return review;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid review ID', 400, 'INVALID_REVIEW_ID');
      }
      throw error;
    }
  }

  /**
   * Update review by ID
   */
  async updateById(id, updateData) {
    try {
      const review = await Review.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { 
          new: true, 
          runValidators: true 
        }
      )
      .populate('user', 'name username avatar')
      .populate('book', 'title slug author coverUrl');

      if (!review) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      return review;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid review ID', 400, 'INVALID_REVIEW_ID');
      }
      throw error;
    }
  }

  /**
   * Delete review by ID
   */
  async deleteById(id) {
    try {
      const review = await Review.findByIdAndDelete(id);
      
      if (!review) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      return review;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid review ID', 400, 'INVALID_REVIEW_ID');
      }
      throw error;
    }
  }

  /**
   * Get reviews by book ID
   */
  async findByBook(bookId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        rating = null
      } = options;

      // Build query
      const query = { book: bookId };

      // Filter by rating
      if (rating) {
        query.rating = rating;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate('user', 'name username avatar')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Review.countDocuments(query)
      ]);

      return {
        reviews,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reviews by user ID
   */
  async findByUser(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const [reviews, total] = await Promise.all([
        Review.find({ user: userId })
          .populate('book', 'title slug author coverUrl')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Review.countDocuments({ user: userId })
      ]);

      return {
        reviews,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user's review for a specific book
   */
  async findUserBookReview(userId, bookId) {
    try {
      const review = await Review.findOne({ user: userId, book: bookId })
        .populate('user', 'name username avatar')
        .populate('book', 'title slug author coverUrl');
      return review;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all reviews with pagination and filtering
   */
  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        rating = null,
        bookId = null,
        userId = null,
        search = ''
      } = options;

      // Build query
      const query = {};

      // Filter by rating
      if (rating) {
        query.rating = rating;
      }

      // Filter by book
      if (bookId) {
        query.book = bookId;
      }

      // Filter by user
      if (userId) {
        query.user = userId;
      }

      // Search in review content
      if (search) {
        query.$or = [
          { content: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate('user', 'name username avatar')
          .populate('book', 'title slug author coverUrl')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Review.countDocuments(query)
      ]);

      return {
        reviews,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get review statistics for a book
   */
  async getBookReviewStats(bookId) {
    try {
      const stats = await Review.aggregate([
        { $match: { book: bookId } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalReviews = await Review.countDocuments({ book: bookId });
      const averageRating = await Review.aggregate([
        { $match: { book: bookId } },
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' }
          }
        }
      ]);

      // Calculate rating distribution
      const ratingDistribution = {};
      for (let i = 1; i <= 5; i++) {
        ratingDistribution[i] = 0;
      }
      
      stats.forEach(stat => {
        ratingDistribution[stat._id] = stat.count;
      });

      return {
        totalReviews,
        averageRating: averageRating[0]?.average || 0,
        ratingDistribution
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user review statistics
   */
  async getUserReviewStats(userId) {
    try {
      const totalReviews = await Review.countDocuments({ user: userId });
      const averageRating = await Review.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' }
          }
        }
      ]);

      const ratingDistribution = await Review.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ]);

      const distribution = {};
      for (let i = 1; i <= 5; i++) {
        distribution[i] = 0;
      }
      
      ratingDistribution.forEach(stat => {
        distribution[stat._id] = stat.count;
      });

      return {
        totalReviews,
        averageRating: averageRating[0]?.average || 0,
        ratingDistribution: distribution
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent reviews
   */
  async getRecent(limit = 10) {
    try {
      const reviews = await Review.find({})
        .populate('user', 'name username avatar')
        .populate('book', 'title slug author coverUrl')
        .sort({ createdAt: -1 })
        .limit(limit);

      return reviews;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get featured reviews (highly rated or popular)
   */
  async getFeatured(limit = 10) {
    try {
      const reviews = await Review.find({ rating: { $gte: 4 } })
        .populate('user', 'name username avatar')
        .populate('book', 'title slug author coverUrl')
        .sort({ helpfulCount: -1, createdAt: -1 })
        .limit(limit);

      return reviews;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId, userId) {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      // Check if user already marked as helpful
      if (review.helpfulUsers.includes(userId)) {
        // Remove helpful mark
        review.helpfulUsers.pull(userId);
        review.helpfulCount = Math.max(0, review.helpfulCount - 1);
      } else {
        // Add helpful mark
        review.helpfulUsers.push(userId);
        review.helpfulCount += 1;
      }

      await review.save();
      return await this.findById(reviewId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk operations
   */
  async bulkCreate(reviews) {
    try {
      const result = await Review.insertMany(reviews, { ordered: false });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdate(updates) {
    try {
      const operations = updates.map(update => ({
        updateOne: {
          filter: { _id: update.id },
          update: { ...update.data, updatedAt: new Date() }
        }
      }));

      const result = await Review.bulkWrite(operations);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      const result = await Review.deleteMany({ _id: { $in: ids } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get review statistics (admin)
   */
  async getStats() {
    try {
      const totalReviews = await Review.countDocuments();
      const recentReviews = await Review.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });

      // Rating distribution
      const ratingStats = await Review.aggregate([
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ]);

      // Average rating across all reviews
      const overallAverage = await Review.aggregate([
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' }
          }
        }
      ]);

      // Most active reviewers
      const topReviewers = await Review.aggregate([
        {
          $group: {
            _id: '$user',
            reviewCount: { $sum: 1 }
          }
        },
        { $sort: { reviewCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
            pipeline: [{ $project: { name: 1, username: 1 } }]
          }
        },
        { $unwind: '$user' }
      ]);

      return {
        total: totalReviews,
        recent: recentReviews,
        averageRating: overallAverage[0]?.average || 0,
        ratingDistribution: ratingStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        topReviewers
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if review exists
   */
  async exists(query) {
    try {
      const review = await Review.findOne(query);
      return !!review;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ReviewRepository();
