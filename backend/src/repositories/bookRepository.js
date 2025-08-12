/**
 * Book Repository
 * Data access layer for book operations
 */

const Book = require('../models/Book');
const { AppError } = require('../middleware/errorHandler');

class BookRepository {
  /**
   * Create a new book
   */
  async create(bookData) {
    try {
      const book = new Book(bookData);
      await book.save();
      return book;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new AppError(`Book with this ${field} already exists`, 400, 'DUPLICATE_BOOK');
      }
      throw error;
    }
  }

  /**
   * Find book by ID
   */
  async findById(id) {
    try {
      const book = await Book.findById(id)
        .populate('addedBy', 'name username');
      return book;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid book ID', 400, 'INVALID_BOOK_ID');
      }
      throw error;
    }
  }

  /**
   * Find book by slug
   */
  async findBySlug(slug) {
    try {
      const book = await Book.findOne({ slug })
        .populate('addedBy', 'name username');
      return book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update book by ID
   */
  async updateById(id, updateData) {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { 
          new: true, 
          runValidators: true 
        }
      )
      .populate('addedBy', 'name username');

      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      return book;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid book ID', 400, 'INVALID_BOOK_ID');
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new AppError(`Book with this ${field} already exists`, 400, 'DUPLICATE_BOOK');
      }
      throw error;
    }
  }

  /**
   * Delete book by ID
   */
  async deleteById(id) {
    try {
      const book = await Book.findByIdAndDelete(id);
      
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      return book;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid book ID', 400, 'INVALID_BOOK_ID');
      }
      throw error;
    }
  }

  /**
   * Get all books with pagination and filtering
   */
  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        category = null,
        author = null,
        language = null,
        status = 'published',
        featured = null,
        minRating = null,
        maxRating = null
      } = options;

      // Build query
      const query = {};

      // Search by title, description, or author name
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'author.name': { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by category
      if (category) {
        query.categories = category;
      }

      // Filter by author
      if (author) {
        query.author = author;
      }

      // Filter by language
      if (language) {
        query.language = language;
      }

      // Filter by status
      if (status) {
        // Map 'published' to both 'published' and 'approved' for backward compatibility
        if (status === 'published') {
          query.status = { $in: ['published', 'approved'] };
        } else {
          query.status = status;
        }
      }

      // Filter by featured
      if (featured !== null) {
        query.featured = featured;
      }

      // Filter by rating range
      if (minRating !== null || maxRating !== null) {
        query.rating = {};
        if (minRating !== null) query.rating.$gte = minRating;
        if (maxRating !== null) query.rating.$lte = maxRating;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const [books, total] = await Promise.all([
        Book.find(query)
          .populate('addedBy', 'name username')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Book.countDocuments(query)
      ]);

      return {
        books,
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
   * Get featured books
   */
  async getFeatured(limit = 10) {
    try {
      const books = await Book.find({ featured: true, status: 'published' })
        .populate('author', 'name bio')
        .populate('categories', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit);

      return books;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get popular books (by views/downloads)
   */
  async getPopular(limit = 10, timeframe = 'all') {
    try {
      let query = { status: 'published' };
      
      // Add timeframe filter if needed
      if (timeframe !== 'all') {
        const timeframes = {
          'day': 1,
          'week': 7,
          'month': 30,
          'year': 365
        };
        
        if (timeframes[timeframe]) {
          const date = new Date();
          date.setDate(date.getDate() - timeframes[timeframe]);
          query.createdAt = { $gte: date };
        }
      }

      const books = await Book.find(query)
        .populate('author', 'name bio')
        .populate('categories', 'name slug')
        .sort({ views: -1, downloads: -1 })
        .limit(limit);

      return books;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent books
   */
  async getRecent(limit = 10) {
    try {
      const books = await Book.find({ status: 'published' })
        .populate('author', 'name bio')
        .populate('categories', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit);

      return books;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get books by category
   */
  async findByCategory(categoryId, options = {}) {
    try {
      const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const skip = (page - 1) * limit;
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [books, total] = await Promise.all([
        Book.find({ categories: categoryId, status: 'published' })
          .populate('author', 'name bio')
          .populate('categories', 'name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Book.countDocuments({ categories: categoryId, status: 'published' })
      ]);

      return {
        books,
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
   * Get books by author
   */
  async findByAuthor(authorId, options = {}) {
    try {
      const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const skip = (page - 1) * limit;
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [books, total] = await Promise.all([
        Book.find({ author: authorId, status: 'published' })
          .populate('author', 'name bio')
          .populate('categories', 'name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Book.countDocuments({ author: authorId, status: 'published' })
      ]);

      return {
        books,
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
   * Update book views
   */
  async incrementViews(id) {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
      return book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update book downloads
   */
  async incrementDownloads(id) {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { $inc: { downloads: 1 } },
        { new: true }
      );
      return book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update book rating
   */
  async updateRating(id, rating, reviewCount) {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { 
          rating: rating,
          reviewCount: reviewCount
        },
        { new: true }
      )
      .populate('author', 'name bio')
      .populate('categories', 'name slug');

      return book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get book statistics
   */
  async getStats() {
    try {
      const stats = await Book.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalBooks = await Book.countDocuments();
      const publishedBooks = await Book.countDocuments({ status: 'published' });
      const featuredBooks = await Book.countDocuments({ featured: true });
      const recentBooks = await Book.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });

      // Language statistics
      const languageStats = await Book.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: '$language',
            count: { $sum: 1 }
          }
        }
      ]);

      // Category statistics
      const categoryStats = await Book.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$categories' },
        {
          $group: {
            _id: '$categories',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      return {
        total: totalBooks,
        published: publishedBooks,
        featured: featuredBooks,
        recent: recentBooks,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byLanguage: languageStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        topCategories: categoryStats
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk operations
   */
  async bulkCreate(books) {
    try {
      const result = await Book.insertMany(books, { ordered: false });
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

      const result = await Book.bulkWrite(operations);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      const result = await Book.deleteMany({ _id: { $in: ids } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search books with advanced filters
   */
  async search(searchOptions) {
    try {
      const {
        query = '',
        categories = [],
        authors = [],
        languages = [],
        minRating = null,
        maxRating = null,
        featured = null,
        page = 1,
        limit = 12,
        sortBy = 'relevance'
      } = searchOptions;

      // Build search query
      const searchQuery = { status: 'published' };

      // Text search
      if (query) {
        searchQuery.$text = { $search: query };
      }

      // Category filter
      if (categories.length > 0) {
        searchQuery.categories = { $in: categories };
      }

      // Author filter
      if (authors.length > 0) {
        searchQuery.author = { $in: authors };
      }

      // Language filter
      if (languages.length > 0) {
        searchQuery.language = { $in: languages };
      }

      // Rating filter
      if (minRating !== null || maxRating !== null) {
        searchQuery.rating = {};
        if (minRating !== null) searchQuery.rating.$gte = minRating;
        if (maxRating !== null) searchQuery.rating.$lte = maxRating;
      }

      // Featured filter
      if (featured !== null) {
        searchQuery.featured = featured;
      }

      // Build sort
      let sort = {};
      switch (sortBy) {
        case 'relevance':
          sort = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'rating':
          sort = { rating: -1, reviewCount: -1 };
          break;
        case 'popular':
          sort = { views: -1, downloads: -1 };
          break;
        case 'title':
          sort = { title: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute search
      let aggregation = [
        { $match: searchQuery }
      ];

      // Add text score for relevance sorting
      if (query && sortBy === 'relevance') {
        aggregation.push({ $addFields: { score: { $meta: 'textScore' } } });
      }

      // Add population and sorting
      aggregation = aggregation.concat([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'authors',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
            pipeline: [{ $project: { name: 1, bio: 1 } }]
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories',
            pipeline: [{ $project: { name: 1, slug: 1 } }]
          }
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } }
      ]);

      const [books, total] = await Promise.all([
        Book.aggregate(aggregation),
        Book.countDocuments(searchQuery)
      ]);

      return {
        books,
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
   * Check if book exists
   */
  async exists(query) {
    try {
      const book = await Book.findOne(query);
      return !!book;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookRepository();
