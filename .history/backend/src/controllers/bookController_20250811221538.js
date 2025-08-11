/**
 * Book Controller
 * HTTP request handlers for book operations
 */

const bookService = require('../services/bookService');
const bookStore = require('../models/InMemoryBookStore');
const { asyncHandler, createSuccessResponse, createPaginationMeta } = require('../middleware/errorHandler');

class BookController {
  /**
   * Create a new book
   * POST /api/books
   */
  createBook = asyncHandler(async (req, res) => {
    console.log('📚 Creating new book...');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    try {
      // Extract form data
      const {
        title,
        author,
        description,
        genre,
        language = 'arabic',
        publishYear,
        isbn,
        pages,
        publisher,
        tags,
        status = 'draft',
        isFree = 'true',
        price = '0'
      } = req.body;

      // Parse tags if it's a string
      let parsedTags = [];
      if (tags) {
        try {
          parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        } catch (e) {
          parsedTags = Array.isArray(tags) ? tags : [tags];
        }
      }

      // Create book data
      const bookData = {
        title,
        author,
        description,
        genre,
        language,
        publishYear: publishYear ? parseInt(publishYear) : undefined,
        isbn,
        pages: pages ? parseInt(pages) : undefined,
        publisher,
        tags: parsedTags,
        status,
        isFree: isFree === 'true' || isFree === true,
        price: isFree === 'true' ? 0 : parseFloat(price || 0),
        uploadedBy: req.user.id,
        createdAt: new Date()
      };

      // Handle uploaded files
      if (req.files && req.files.length > 0) {
        bookData.files = {};
        req.files.forEach(file => {
          const format = this.getFileFormat(file.originalname);
          bookData.files[format] = {
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
          };
        });
      }

      console.log('📚 Final book data:', bookData);
      
      // Save to in-memory store (for development/demo)
      const book = bookStore.addBook({
        _id: `book_${Date.now()}`,
        ...bookData
      });

      res.status(201).json({
        success: true,
        message: 'تم إنشاء الكتاب بنجاح',
        data: book
      });
      
    } catch (error) {
      console.error('❌ Create book error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إنشاء الكتاب',
        error: error.message
      });
    }
  });

  /**
   * Helper method to get file format from filename
   */
  getFileFormat(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'epub': return 'epub';
      case 'mobi': return 'mobi';
      case 'pdf': return 'pdf';
      case 'mp3':
      case 'm4a':
      case 'wav': return 'audiobook';
      default: return 'other';
    }
  }

  /**
   * Get all books with filtering and pagination
   * GET /api/books
   */
  getAllBooks = asyncHandler(async (req, res) => {
    const result = await bookService.getAllBooks(req.query);
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.books,
      'Books retrieved successfully',
      meta
    ));
  });

  /**
   * Get book by ID
   * GET /api/books/:id
   */
  getBookById = asyncHandler(async (req, res) => {
    const bookId = req.params.id;
    
    // Try in-memory store first (for development)
    const book = bookStore.getBook(bookId);
    
    if (book) {
      return res.json(createSuccessResponse(
        book,
        'Book retrieved successfully'
      ));
    }
    
    // If not in memory, try database
    try {
      const dbBook = await bookService.getBookById(bookId);
      res.json(createSuccessResponse(
        dbBook,
        'Book retrieved successfully'
      ));
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
  });

  /**
   * Get book by slug
   * GET /api/books/slug/:slug
   */
  getBookBySlug = asyncHandler(async (req, res) => {
    const book = await bookService.getBookBySlug(req.params.slug);
    
    res.json(createSuccessResponse(
      book,
      'Book retrieved successfully'
    ));
  });

  /**
   * Update book
   * PUT /api/books/:id
   */
  updateBook = asyncHandler(async (req, res) => {
    const book = await bookService.updateBook(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    
    res.json(createSuccessResponse(
      book,
      'Book updated successfully'
    ));
  });

  /**
   * Delete book
   * DELETE /api/books/:id
   */
  deleteBook = asyncHandler(async (req, res) => {
    await bookService.deleteBook(req.params.id, req.user.id, req.user.role);
    
    res.json(createSuccessResponse(
      null,
      'Book deleted successfully'
    ));
  });

  /**
   * Get featured books
   * GET /api/books/featured
   */
  getFeaturedBooks = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const books = await bookService.getFeaturedBooks(parseInt(limit) || 10);
    
    res.json(createSuccessResponse(
      books,
      'Featured books retrieved successfully'
    ));
  });

  /**
   * Get popular books
   * GET /api/books/popular
   */
  getPopularBooks = asyncHandler(async (req, res) => {
    const { limit, timeframe } = req.query;
    const books = await bookService.getPopularBooks(
      parseInt(limit) || 10,
      timeframe || 'all'
    );
    
    res.json(createSuccessResponse(
      books,
      'Popular books retrieved successfully'
    ));
  });

  /**
   * Get recent books
   * GET /api/books/recent
   */
  getRecentBooks = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const books = await bookService.getRecentBooks(parseInt(limit) || 10);
    
    res.json(createSuccessResponse(
      books,
      'Recent books retrieved successfully'
    ));
  });

  /**
   * Get books by category
   * GET /api/books/category/:categoryId
   */
  getBooksByCategory = asyncHandler(async (req, res) => {
    const result = await bookService.getBooksByCategory(
      req.params.categoryId,
      req.query
    );
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.books,
      'Books by category retrieved successfully',
      meta
    ));
  });

  /**
   * Get books by author
   * GET /api/books/author/:authorId
   */
  getBooksByAuthor = asyncHandler(async (req, res) => {
    const result = await bookService.getBooksByAuthor(
      req.params.authorId,
      req.query
    );
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.books,
      'Books by author retrieved successfully',
      meta
    ));
  });

  /**
   * Search books
   * GET /api/books/search
   */
  searchBooks = asyncHandler(async (req, res) => {
    const result = await bookService.searchBooks(req.query);
    
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.json(createSuccessResponse(
      result.books,
      'Book search completed successfully',
      meta
    ));
  });

  /**
   * Download book
   * GET /api/books/:id/download
   */
  downloadBook = asyncHandler(async (req, res) => {
    const downloadInfo = await bookService.downloadBook(req.params.id, req.user.id);
    
    res.json(createSuccessResponse(
      downloadInfo,
      'Download link generated successfully'
    ));
  });

  /**
   * Toggle book featured status (admin only)
   * PATCH /api/books/:id/featured
   */
  toggleFeatured = asyncHandler(async (req, res) => {
    const book = await bookService.toggleFeatured(req.params.id);
    
    res.json(createSuccessResponse(
      book,
      `Book ${book.featured ? 'featured' : 'unfeatured'} successfully`
    ));
  });

  /**
   * Update book status (admin only)
   * PATCH /api/books/:id/status
   */
  updateBookStatus = asyncHandler(async (req, res) => {
    const book = await bookService.updateBookStatus(req.params.id, req.body.status);
    
    res.json(createSuccessResponse(
      book,
      'Book status updated successfully'
    ));
  });

  /**
   * Get book statistics (admin only)
   * GET /api/books/admin/stats
   */
  getBookStats = asyncHandler(async (req, res) => {
    const stats = await bookService.getBookStats();
    
    res.json(createSuccessResponse(
      stats,
      'Book statistics retrieved successfully'
    ));
  });

  /**
   * Bulk create books (admin only)
   * POST /api/books/bulk
   */
  bulkCreateBooks = asyncHandler(async (req, res) => {
    const result = await bookService.bulkCreateBooks(req.body.books, req.user.id);
    
    res.status(201).json(createSuccessResponse(
      {
        created: result.length,
        books: result
      },
      'Books created successfully'
    ));
  });

  /**
   * Bulk update books (admin only)
   * PUT /api/books/bulk
   */
  bulkUpdateBooks = asyncHandler(async (req, res) => {
    const result = await bookService.bulkUpdateBooks(req.body.updates);
    
    res.json(createSuccessResponse(
      {
        modified: result.modifiedCount,
        matched: result.matchedCount
      },
      'Books updated successfully'
    ));
  });

  /**
   * Bulk delete books (admin only)
   * DELETE /api/books/bulk
   */
  bulkDeleteBooks = asyncHandler(async (req, res) => {
    const result = await bookService.bulkDeleteBooks(req.body.bookIds);
    
    res.json(createSuccessResponse(
      {
        deleted: result.deletedCount
      },
      'Books deleted successfully'
    ));
  });

  /**
   * Update book rating (internal use)
   * PATCH /api/books/:id/rating
   */
  updateBookRating = asyncHandler(async (req, res) => {
    const book = await bookService.updateBookRating(
      req.params.id,
      req.body.rating,
      req.body.reviewCount
    );
    
    res.json(createSuccessResponse(
      book,
      'Book rating updated successfully'
    ));
  });

  /**
   * Get books for recommendation
   * GET /api/books/recommendations
   */
  getBooksForRecommendation = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const books = await bookService.getBooksForRecommendation(
      req.user.id,
      parseInt(limit) || 20
    );
    
    res.json(createSuccessResponse(
      books,
      'Recommended books retrieved successfully'
    ));
  });

  /**
   * Get user reading statistics
   * GET /api/books/user/stats
   */
  getUserReadingStats = asyncHandler(async (req, res) => {
    const stats = await bookService.getUserReadingStats(req.user.id);
    
    res.json(createSuccessResponse(
      stats,
      'User reading statistics retrieved successfully'
    ));
  });

  /**
   * Upload book file
   * POST /api/books/upload
   */
  uploadBook = asyncHandler(async (req, res) => {
    if (!req.files || !req.files.bookFile) {
      return res.status(400).json(createErrorResponse('Book file is required'));
    }

    const bookFile = req.files.bookFile;
    const coverFile = req.files.coverFile;

    // Validate files
    bookService.validateBookFile(bookFile);
    if (coverFile) {
      bookService.validateCoverImage(coverFile);
    }

    // TODO: Implement file upload logic
    // For now, return mock URLs
    const fileUrl = `/uploads/books/${Date.now()}-${bookFile.name}`;
    const coverUrl = coverFile ? `/uploads/covers/${Date.now()}-${coverFile.name}` : null;

    res.json(createSuccessResponse(
      {
        fileUrl,
        coverUrl,
        fileSize: bookFile.size,
        format: bookFile.name.split('.').pop().toLowerCase()
      },
      'Files uploaded successfully'
    ));
  });

  /**
   * Get book reading progress (if implemented)
   * GET /api/books/:id/progress
   */
  getReadingProgress = asyncHandler(async (req, res) => {
    // TODO: Implement reading progress tracking
    res.json(createSuccessResponse(
      {
        bookId: req.params.id,
        userId: req.user.id,
        currentPage: 0,
        totalPages: 0,
        percentage: 0,
        lastRead: null
      },
      'Reading progress retrieved successfully'
    ));
  });

  /**
   * Update book reading progress
   * PUT /api/books/:id/progress
   */
  updateReadingProgress = asyncHandler(async (req, res) => {
    // TODO: Implement reading progress tracking
    const { currentPage, totalPages } = req.body;
    const percentage = Math.round((currentPage / totalPages) * 100);

    res.json(createSuccessResponse(
      {
        bookId: req.params.id,
        userId: req.user.id,
        currentPage,
        totalPages,
        percentage,
        lastRead: new Date()
      },
      'Reading progress updated successfully'
    ));
  });

  /**
   * Add book to favorites
   * POST /api/books/:id/favorite
   */
  addToFavorites = asyncHandler(async (req, res) => {
    // TODO: Implement favorites system
    res.json(createSuccessResponse(
      null,
      'Book added to favorites successfully'
    ));
  });

  /**
   * Remove book from favorites
   * DELETE /api/books/:id/favorite
   */
  removeFromFavorites = asyncHandler(async (req, res) => {
    // TODO: Implement favorites system
    res.json(createSuccessResponse(
      null,
      'Book removed from favorites successfully'
    ));
  });

  /**
   * Get user's favorite books
   * GET /api/books/favorites
   */
  getFavoriteBooks = asyncHandler(async (req, res) => {
    // TODO: Implement favorites system
    res.json(createSuccessResponse(
      [],
      'Favorite books retrieved successfully'
    ));
  });
}

const bookController = new BookController();

module.exports = bookController;
