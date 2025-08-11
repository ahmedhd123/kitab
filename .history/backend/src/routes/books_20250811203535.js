/**
 * Book Routes
 * Routes for book management and operations
 */

const express = require('express');
const router = express.Router();

// Controllers
const bookController = require('../controllers/bookController');

// Middleware
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validators
const {
  createBookSchema,
  updateBookSchema,
  bookQuerySchema,
  searchBooksSchema,
  updateStatusSchema,
  toggleFeaturedSchema,
  bulkCreateBooksSchema,
  bulkUpdateBooksSchema,
  bulkDeleteBooksSchema,
  updateRatingSchema,
  popularBooksSchema,
  categoryAuthorBooksSchema
} = require('../validators/bookValidators');

// Public Routes
router.get('/featured', validate(popularBooksSchema, 'query'), bookController.getFeaturedBooks);
router.get('/popular', validate(popularBooksSchema, 'query'), bookController.getPopularBooks);
router.get('/recent', validate(popularBooksSchema, 'query'), bookController.getRecentBooks);
router.get('/search', validate(searchBooksSchema, 'query'), bookController.searchBooks);
router.get('/category/:categoryId', validate(categoryAuthorBooksSchema, 'query'), bookController.getBooksByCategory);
router.get('/author/:authorId', validate(categoryAuthorBooksSchema, 'query'), bookController.getBooksByAuthor);
router.get('/slug/:slug', bookController.getBookBySlug);
router.get('/', validate(bookQuerySchema, 'query'), bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected Routes
router.use(authenticate);

// User Routes (Authenticated)
router.get('/:id/download', bookController.downloadBook);
router.get('/recommendations', bookController.getBooksForRecommendation);
router.get('/user/stats', bookController.getUserReadingStats);
router.get('/:id/progress', bookController.getReadingProgress);
router.put('/:id/progress', bookController.updateReadingProgress);
router.post('/:id/favorite', bookController.addToFavorites);
router.delete('/:id/favorite', bookController.removeFromFavorites);
router.get('/favorites', bookController.getFavoriteBooks);

// Content Creator Routes (Authenticated users can create books)
router.post('/', validate(createBookSchema), bookController.createBook);
router.put('/:id', validate(updateBookSchema), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.post('/upload', bookController.uploadBook);

// Admin/Moderator Routes
router.get('/admin/stats', authorize(['admin', 'moderator']), bookController.getBookStats);
router.patch('/:id/featured', authorize(['admin']), validate(toggleFeaturedSchema), bookController.toggleFeatured);
router.patch('/:id/status', authorize(['admin', 'moderator']), validate(updateStatusSchema), bookController.updateBookStatus);
router.patch('/:id/rating', authorize(['admin']), validate(updateRatingSchema), bookController.updateBookRating);

// Bulk Operations (Admin only)
router.post('/bulk', authorize(['admin']), validate(bulkCreateBooksSchema), bookController.bulkCreateBooks);
router.put('/bulk', authorize(['admin']), validate(bulkUpdateBooksSchema), bookController.bulkUpdateBooks);
router.delete('/bulk', authorize(['admin']), validate(bulkDeleteBooksSchema), bookController.bulkDeleteBooks);

module.exports = router;
  try {
    const { page = 1, limit = 12, genre, author, search } = req.query;
    const query = { status: 'approved', isPublic: true };
    
    // Add filters
    if (genre) query.genres = { $in: [genre] };
    if (author) query['authors.name'] = { $regex: author, $options: 'i' };
    if (search) {
      query.$text = { $search: search };
    }
    
    const books = await Book.find(query)
      .select('-digitalFiles.epub.url -digitalFiles.mobi.url -digitalFiles.pdf.url -digitalFiles.audiobook.url') // Hide file URLs in list view
      .populate('addedBy', 'name')
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Book.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        books,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الكتب',
      error: error.message
    });
  }
});

// Get single book with digital files info
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    // Hide actual file URLs, show only availability and metadata
    const bookData = book.toObject();
    if (bookData.digitalFiles) {
      Object.keys(bookData.digitalFiles).forEach(format => {
        if (bookData.digitalFiles[format] && bookData.digitalFiles[format].url) {
          bookData.digitalFiles[format] = {
            available: true,
            fileSize: bookData.digitalFiles[format].fileSize,
            uploadDate: bookData.digitalFiles[format].uploadDate,
            downloadCount: bookData.digitalFiles[format].downloadCount
          };
        }
      });
    }
    
    // Increment view count
    book.stats.views = (book.stats.views || 0) + 1;
    await book.save();
    
    res.json({
      success: true,
      data: bookData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب تفاصيل الكتاب',
      error: error.message
    });
  }
});

// Upload digital file to existing book (temporarily disabled)
/*
router.post('/:id/upload', auth, (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'خطأ في رفع الملف',
        error: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      // Delete uploaded file if book not found
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    // Check permission (only book uploader or admin can upload files)
    if (book.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      if (req.file) deleteFile(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لرفع ملفات لهذا الكتاب'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم رفع أي ملف'
      });
    }
    
    const format = getFileFormat(req.file.filename);
    const fileSize = getFileSize(req.file.path);
    
    // Validate file
    try {
      await validateFile(req.file.path, format);
    } catch (validationError) {
      deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: validationError.message
      });
    }
    
    // Delete old file if exists
    if (book.digitalFiles[format] && book.digitalFiles[format].url) {
      const oldFilePath = path.join(booksDir, path.basename(book.digitalFiles[format].url));
      deleteFile(oldFilePath);
    }
    
    // Add file to book
    const fileData = {
      url: `/uploads/books/${req.file.filename}`,
      fileSize: fileSize,
      downloadCount: 0
    };
    
    if (format === 'audiobook' && req.body.duration) {
      fileData.duration = parseInt(req.body.duration);
    }
    
    await book.addDigitalFile(format, fileData);
    
    res.json({
      success: true,
      message: 'تم رفع الملف بنجاح',
      data: {
        format,
        fileSize: book.getFormattedFileSize(format),
        availableFormats: book.getAvailableFormats()
      }
    });
    
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) deleteFile(req.file.path);
    
    res.status(500).json({
      success: false,
      message: 'خطأ في رفع الملف',
      error: error.message
    });
  }
});
*/

// Read book content in app (streaming)
router.get('/:id/read/:format', auth, async (req, res) => {
  try {
    const { id, format } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    // Check reading permission
    if (!book.canRead(req.user.id, format)) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لقراءة هذا الملف'
      });
    }
    
    const digitalFile = book.digitalFiles[format];
    if (!digitalFile || !digitalFile.url) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير متوفر بهذه الصيغة'
      });
    }
    
    const filePath = path.join(booksDir, path.basename(digitalFile.url));
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود على الخادم'
      });
    }
    
    // Get file stats for range requests
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    // Set headers for inline viewing
    res.setHeader('Content-Type', getContentType(format));
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Support range requests for streaming
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunksize,
      });
      
      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
    
    // Track reading session
    await book.trackReading(format, 1); // Track 1 minute session start
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في قراءة الملف',
      error: error.message
    });
  }
});

// Get book metadata for reading
router.get('/:id/metadata/:format', auth, async (req, res) => {
  try {
    const { id, format } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    if (!book.canRead(req.user.id, format)) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لقراءة هذا الملف'
      });
    }
    
    const digitalFile = book.digitalFiles[format];
    if (!digitalFile || !digitalFile.url) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير متوفر بهذه الصيغة'
      });
    }
    
    res.json({
      success: true,
      data: {
        title: book.title,
        author: book.author,
        description: book.description,
        format: format,
        size: digitalFile.fileSize,
        language: book.language,
        readingFeatures: book.readingFeatures,
        drm: book.drm.isProtected ? {
          isProtected: true,
          expirationDate: book.drm.expirationDate
        } : { isProtected: false },
        stats: book.getReadingStats(format)
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب معلومات الملف',
      error: error.message
    });
  }
});

// Track reading progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { format, sessionTime, progress, currentPage } = req.body;
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    await book.trackReading(format, sessionTime || 1);
    
    // Here you could also save user's reading progress to user model
    // await User.findByIdAndUpdate(req.user.id, {
    //   $set: { 
    //     [`readingProgress.${id}.${format}.progress`]: progress,
    //     [`readingProgress.${id}.${format}.currentPage`]: currentPage,
    //     [`readingProgress.${id}.${format}.lastRead`]: new Date()
    //   }
    // });
    
    res.json({
      success: true,
      message: 'تم حفظ التقدم بنجاح',
      data: {
        stats: book.getReadingStats(format),
        progress: progress
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حفظ التقدم',
      error: error.message
    });
  }
});

// Delete digital file
router.delete('/:id/files/:format', auth, async (req, res) => {
  try {
    const { id, format } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    // Check permission
    if (book.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف ملفات هذا الكتاب'
      });
    }
    
    const digitalFile = book.digitalFiles[format];
    if (!digitalFile || !digitalFile.url) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود'
      });
    }
    
    // Delete file from disk
    const filePath = path.join(booksDir, path.basename(digitalFile.url));
    deleteFile(filePath);
    
    // Remove from database
    book.digitalFiles[format] = undefined;
    await book.save();
    
    res.json({
      success: true,
      message: 'تم حذف الملف بنجاح',
      data: {
        availableFormats: book.getAvailableFormats()
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الملف',
      error: error.message
    });
  }
});

// Helper function to get content type
function getContentType(format) {
  switch (format) {
    case 'epub':
      return 'application/epub+zip';
    case 'mobi':
      return 'application/x-mobipocket-ebook';
    case 'pdf':
      return 'application/pdf';
    case 'audiobook':
      return 'audio/mpeg';
    default:
      return 'application/octet-stream';
  }
}

module.exports = router;
