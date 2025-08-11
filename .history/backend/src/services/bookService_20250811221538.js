/**
 * Book Service
 * Business logic layer for book operations
 */

const bookRepository = require('../repositories/bookRepository');
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs').promises;
const path = require('path');

class BookService {
  /**
   * Create a new book
   */
  async createBook(bookData, userId) {
    try {
      const {
        title,
        description,
        author,
        categories,
        language = 'ar',
        isbn,
        publishedYear,
        publisher,
        pageCount,
        fileUrl,
        coverUrl,
        format = 'pdf',
        fileSize,
        featured = false
      } = bookData;

      // Generate slug from title
      const slug = this.generateSlug(title);

      // Check if book with same slug exists
      const existingBook = await bookRepository.findBySlug(slug);
      if (existingBook) {
        throw new AppError('Book with similar title already exists', 400, 'DUPLICATE_BOOK');
      }

      // Create book data
      const newBookData = {
        title,
        slug,
        description,
        author,
        categories,
        language,
        isbn,
        publishedYear,
        publisher,
        pageCount,
        fileUrl,
        coverUrl,
        format,
        fileSize,
        featured,
        uploadedBy: userId,
        status: 'published',
        views: 0,
        downloads: 0,
        rating: 0,
        reviewCount: 0
      };

      const book = await bookRepository.create(newBookData);
      return book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get book by ID
   */
  async getBookById(bookId) {
    try {
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      // Increment view count
      await bookRepository.incrementViews(bookId);

      return book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get book by slug
   */
  async getBookBySlug(slug) {
    try {
      const book = await bookRepository.findBySlug(slug);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      // Increment view count
      await bookRepository.incrementViews(book._id);

      return book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all books with filtering and pagination
   */
  async getAllBooks(options) {
    try {
      const result = await bookRepository.findAll(options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update book
   */
  async updateBook(bookId, updateData, userId, userRole) {
    try {
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      // Check permissions
      if (userRole !== 'admin' && book.uploadedBy.toString() !== userId) {
        throw new AppError('Not authorized to update this book', 403, 'UNAUTHORIZED');
      }

      // Update slug if title changed
      if (updateData.title && updateData.title !== book.title) {
        updateData.slug = this.generateSlug(updateData.title);
        
        // Check if new slug conflicts
        const existingBook = await bookRepository.findBySlug(updateData.slug);
        if (existingBook && existingBook._id.toString() !== bookId) {
          throw new AppError('Book with similar title already exists', 400, 'DUPLICATE_BOOK');
        }
      }

      const updatedBook = await bookRepository.updateById(bookId, updateData);
      return updatedBook;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete book
   */
  async deleteBook(bookId, userId, userRole) {
    try {
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      // Check permissions
      if (userRole !== 'admin' && book.uploadedBy.toString() !== userId) {
        throw new AppError('Not authorized to delete this book', 403, 'UNAUTHORIZED');
      }

      // Delete associated files if they exist
      try {
        if (book.fileUrl) {
          await this.deleteFile(book.fileUrl);
        }
        if (book.coverUrl) {
          await this.deleteFile(book.coverUrl);
        }
      } catch (fileError) {
        console.warn('Error deleting files:', fileError.message);
      }

      const deletedBook = await bookRepository.deleteById(bookId);
      return deletedBook;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get featured books
   */
  async getFeaturedBooks(limit = 10) {
    try {
      const books = await bookRepository.getFeatured(limit);
      return books;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get popular books
   */
  async getPopularBooks(limit = 10, timeframe = 'all') {
    try {
      const books = await bookRepository.getPopular(limit, timeframe);
      return books;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent books
   */
  async getRecentBooks(limit = 10) {
    try {
      const books = await bookRepository.getRecent(limit);
      return books;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get books by category
   */
  async getBooksByCategory(categoryId, options) {
    try {
      const result = await bookRepository.findByCategory(categoryId, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get books by author
   */
  async getBooksByAuthor(authorId, options) {
    try {
      const result = await bookRepository.findByAuthor(authorId, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search books
   */
  async searchBooks(searchOptions) {
    try {
      const result = await bookRepository.search(searchOptions);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download book
   */
  async downloadBook(bookId, userId) {
    try {
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      if (!book.fileUrl) {
        throw new AppError('Book file not available', 404, 'FILE_NOT_FOUND');
      }

      // Increment download count
      await bookRepository.incrementDownloads(bookId);

      // TODO: Log download activity for user analytics
      
      return {
        downloadUrl: book.fileUrl,
        filename: `${book.title}.${book.format}`,
        fileSize: book.fileSize
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle book featured status (admin only)
   */
  async toggleFeatured(bookId) {
    try {
      const book = await bookRepository.findById(bookId);
      if (!book) {
        throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND');
      }

      const updatedBook = await bookRepository.updateById(bookId, {
        featured: !book.featured
      });

      return updatedBook;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update book status (admin only)
   */
  async updateBookStatus(bookId, status) {
    try {
      const validStatuses = ['draft', 'published', 'archived', 'banned'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status', 400, 'INVALID_STATUS');
      }

      const updatedBook = await bookRepository.updateById(bookId, { status });
      return updatedBook;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get book statistics (admin only)
   */
  async getBookStats() {
    try {
      const stats = await bookRepository.getStats();
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk operations (admin only)
   */
  async bulkCreateBooks(books, userId) {
    try {
      const booksWithMetadata = books.map(book => ({
        ...book,
        slug: this.generateSlug(book.title),
        uploadedBy: userId,
        status: book.status || 'published',
        views: 0,
        downloads: 0,
        rating: 0,
        reviewCount: 0
      }));

      const result = await bookRepository.bulkCreate(booksWithMetadata);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdateBooks(updates) {
    try {
      // Update slugs for title changes
      const updatedData = updates.map(update => {
        if (update.data.title) {
          update.data.slug = this.generateSlug(update.data.title);
        }
        return update;
      });

      const result = await bookRepository.bulkUpdate(updatedData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkDeleteBooks(bookIds) {
    try {
      // TODO: Delete associated files for all books
      const result = await bookRepository.bulkDelete(bookIds);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update book rating after review
   */
  async updateBookRating(bookId, newRating, reviewCount) {
    try {
      const updatedBook = await bookRepository.updateRating(bookId, newRating, reviewCount);
      return updatedBook;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get books for recommendation engine
   */
  async getBooksForRecommendation(userId, limit = 20) {
    try {
      // TODO: Implement sophisticated recommendation algorithm
      // For now, return popular and recent books
      const popularBooks = await bookRepository.getPopular(limit / 2);
      const recentBooks = await bookRepository.getRecent(limit / 2);
      
      // Combine and deduplicate
      const allBooks = [...popularBooks, ...recentBooks];
      const uniqueBooks = allBooks.filter((book, index, self) => 
        index === self.findIndex(b => b._id.toString() === book._id.toString())
      );

      return uniqueBooks.slice(0, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reading statistics for a user
   */
  async getUserReadingStats(userId) {
    try {
      // TODO: Implement reading tracking
      // For now, return mock data
      return {
        totalBooksRead: 0,
        totalPages: 0,
        averageRating: 0,
        favoriteGenres: [],
        readingStreak: 0,
        monthlyGoal: 12,
        monthlyProgress: 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Helper Methods
   */

  /**
   * Generate URL-friendly slug from title
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Delete file from storage
   */
  async deleteFile(fileUrl) {
    try {
      // Extract filename from URL
      const filename = path.basename(fileUrl);
      const uploadsDir = path.join(__dirname, '../../uploads');
      const filePath = path.join(uploadsDir, filename);

      // Check if file exists and delete
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (error) {
      // File doesn't exist or couldn't be deleted
      throw new Error(`Could not delete file: ${error.message}`);
    }
  }

  /**
   * Validate book file
   */
  validateBookFile(file) {
    const allowedFormats = ['pdf', 'epub', 'mobi', 'txt', 'docx'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!file) {
      throw new AppError('Book file is required', 400, 'FILE_REQUIRED');
    }

    const format = path.extname(file.originalname).toLowerCase().slice(1);
    if (!allowedFormats.includes(format)) {
      throw new AppError(`Invalid file format. Allowed: ${allowedFormats.join(', ')}`, 400, 'INVALID_FORMAT');
    }

    if (file.size > maxSize) {
      throw new AppError('File size too large. Maximum 50MB allowed', 400, 'FILE_TOO_LARGE');
    }

    return true;
  }

  /**
   * Validate cover image
   */
  validateCoverImage(file) {
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
      return true; // Cover is optional
    }

    const format = path.extname(file.originalname).toLowerCase().slice(1);
    if (!allowedFormats.includes(format)) {
      throw new AppError(`Invalid image format. Allowed: ${allowedFormats.join(', ')}`, 400, 'INVALID_IMAGE_FORMAT');
    }

    if (file.size > maxSize) {
      throw new AppError('Image size too large. Maximum 5MB allowed', 400, 'IMAGE_TOO_LARGE');
    }

    return true;
  }
}

module.exports = new BookService();
