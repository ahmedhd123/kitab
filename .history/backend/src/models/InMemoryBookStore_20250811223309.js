/**
 * In-Memory Book Store
 * Temporary storage for books when database is not available
 */

class InMemoryBookStore {
  constructor() {
    this.books = new Map();
    // تم حذف البيانات الوهمية - النظام الآن يعتمد فقط على الكتب المضافة من Admin
  }

  /**
   * Add a book to the store
   */
  addBook(book) {
    this.books.set(book._id, {
      ...book,
      createdAt: book.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return this.books.get(book._id);
  }

  /**
   * Get a book by ID
   */
  getBook(id) {
    return this.books.get(id) || null;
  }

  /**
   * Get all books
   */
  getAllBooks(filters = {}) {
    let books = Array.from(this.books.values());
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.genre) {
      books = books.filter(book => book.genre === filters.genre);
    }
    
    if (filters.language) {
      books = books.filter(book => book.language === filters.language);
    }
    
    if (filters.status) {
      books = books.filter(book => book.status === filters.status);
    }
    
    if (filters.isFree !== undefined) {
      books = books.filter(book => book.isFree === (filters.isFree === 'true'));
    }
    
    // Apply sorting
    if (filters.sortBy) {
      books.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    
    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = books.slice(startIndex, endIndex);
    
    return {
      books: paginatedBooks,
      total: books.length,
      page,
      limit,
      totalPages: Math.ceil(books.length / limit)
    };
  }

  /**
   * Update a book
   */
  updateBook(id, updates) {
    const book = this.books.get(id);
    if (!book) {
      return null;
    }
    
    const updatedBook = {
      ...book,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  /**
   * Delete a book
   */
  deleteBook(id) {
    return this.books.delete(id);
  }

  /**
   * Search books
   */
  searchBooks(query, filters = {}) {
    return this.getAllBooks({
      ...filters,
      search: query
    });
  }

  /**
   * Get featured books
   */
  getFeaturedBooks(limit = 5) {
    const books = Array.from(this.books.values())
      .filter(book => book.status === 'published')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
    
    return books;
  }

  /**
   * Get popular books
   */
  getPopularBooks(limit = 5) {
    const books = Array.from(this.books.values())
      .filter(book => book.status === 'published')
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, limit);
    
    return books;
  }

  /**
   * Get recent books
   */
  getRecentBooks(limit = 5) {
    const books = Array.from(this.books.values())
      .filter(book => book.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    
    return books;
  }

  /**
   * Get stats
   */
  getStats() {
    const books = Array.from(this.books.values());
    
    return {
      totalBooks: books.length,
      publishedBooks: books.filter(b => b.status === 'published').length,
      draftBooks: books.filter(b => b.status === 'draft').length,
      freeBooks: books.filter(b => b.isFree).length,
      totalDownloads: books.reduce((sum, b) => sum + (b.downloadCount || 0), 0),
      averageRating: books.reduce((sum, b) => sum + (b.rating || 0), 0) / books.length
    };
  }
}

// Create singleton instance
const bookStore = new InMemoryBookStore();

module.exports = bookStore;
