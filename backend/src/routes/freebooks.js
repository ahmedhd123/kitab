const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { auth } = require('../middleware/auth');
const axios = require('axios');

// Search free books from external sources
router.get('/search', async (req, res) => {
  try {
    const { query, source = 'all', limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'مطلوب كلمة بحث'
      });
    }

    // Call AI service for book search
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    try {
      const response = await axios.get(`${aiServiceUrl}/search-books`, {
        params: { query, source, limit },
        timeout: 30000
      });

      const searchResults = response.data.books || [];

      res.json({
        success: true,
        data: {
          query,
          source,
          total: searchResults.length,
          books: searchResults
        },
        message: `تم العثور على ${searchResults.length} كتاب`
      });

    } catch (aiError) {
      console.log('AI service not available, returning mock data');
      
      // Fallback to mock data if AI service is not available
      const mockBooks = generateMockBooks(query, source, parseInt(limit));
      
      res.json({
        success: true,
        data: {
          query,
          source,
          total: mockBooks.length,
          books: mockBooks
        },
        message: `تم العثور على ${mockBooks.length} كتاب (بيانات تجريبية)`
      });
    }

  } catch (error) {
    console.error('Error searching free books:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في البحث عن الكتب',
      error: error.message
    });
  }
});

// Import a free book to the database
router.post('/import', auth, async (req, res) => {
  try {
    const { bookData, downloadFiles = true } = req.body;

    // Validate user permission (admin only)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لاستيراد الكتب'
      });
    }

    if (!bookData || !bookData.title || !bookData.author) {
      return res.status(400).json({
        success: false,
        message: 'بيانات الكتاب غير مكتملة'
      });
    }

    // Check if book already exists
    const existingBook = await Book.findOne({
      $or: [
        { title: bookData.title, author: bookData.author },
        { sourceId: bookData.id, source: bookData.source }
      ]
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'الكتاب موجود بالفعل في المكتبة'
      });
    }

    // Prepare book data for database
    const bookRecord = {
      title: bookData.title,
      author: bookData.author,
      description: bookData.description || '',
      language: bookData.language || 'en',
      source: bookData.source,
      sourceId: bookData.id,
      genres: bookData.metadata?.subjects || [],
      publicationDate: bookData.metadata?.publication_date,
      rights: bookData.metadata?.rights || 'Unknown',
      isPublic: true,
      status: 'approved',
      addedBy: req.user.id,
      digitalFiles: {},
      importedAt: new Date(),
      cover: bookData.cover || '/images/default-book-cover.jpg',
      ratings: {
        average: 0,
        count: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      },
      stats: {
        views: 0,
        downloads: 0,
        favorites: 0
      }
    };

    // Add digital files info (without downloading for now)
    if (bookData.formats) {
      Object.keys(bookData.formats).forEach(format => {
        if (['epub', 'pdf', 'mobi', 'txt'].includes(format)) {
          bookRecord.digitalFiles[format] = {
            url: bookData.formats[format],
            fileSize: 1024000, // Mock size
            uploadDate: new Date(),
            viewCount: 0,
            readingTime: 0,
            isExternal: true // Mark as external URL
          };
        }
      });
    }

    // Create book record
    const newBook = new Book(bookRecord);
    await newBook.save();

    res.status(201).json({
      success: true,
      data: newBook,
      message: `تم استيراد كتاب "${bookData.title}" بنجاح`
    });

  } catch (error) {
    console.error('Error importing book:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في استيراد الكتاب',
      error: error.message
    });
  }
});

// Get featured free books
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Try to get from AI service first
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.get(`${aiServiceUrl}/featured-books`, {
        params: { limit },
        timeout: 10000
      });

      const featuredBooks = response.data.books || [];

      res.json({
        success: true,
        data: featuredBooks,
        message: `${featuredBooks.length} كتاب مميز`
      });

    } catch (aiError) {
      // Fallback to books already in database
      const featuredBooks = await Book.find({
        isPublic: true,
        status: 'approved',
        source: { $exists: true }
      })
      .select('-digitalFiles.epub.url -digitalFiles.mobi.url -digitalFiles.pdf.url')
      .populate('addedBy', 'name')
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .limit(parseInt(limit));

      res.json({
        success: true,
        data: featuredBooks,
        message: `${featuredBooks.length} كتاب مميز من المكتبة`
      });
    }

  } catch (error) {
    console.error('Error getting featured books:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الكتب المميزة',
      error: error.message
    });
  }
});

// Get import history (admin only)
router.get('/imports', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لعرض سجل الاستيراد'
      });
    }

    const { page = 1, limit = 20 } = req.query;

    const importedBooks = await Book.find({
      source: { $exists: true },
      importedAt: { $exists: true }
    })
    .populate('addedBy', 'name email')
    .sort({ importedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Book.countDocuments({
      source: { $exists: true },
      importedAt: { $exists: true }
    });

    res.json({
      success: true,
      data: {
        books: importedBooks,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting import history:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب سجل الاستيراد',
      error: error.message
    });
  }
});

// Generate mock books for fallback
function generateMockBooks(query, source, limit) {
  const sources = {
    gutenberg: 'Project Gutenberg',
    standard_ebooks: 'Standard Ebooks',
    hindawi: 'مؤسسة هنداوي',
    noor: 'مكتبة نور',
    archive_org: 'Internet Archive'
  };

  const mockBooks = [];
  const sourcesToUse = source === 'all' ? Object.keys(sources) : [source];

  sourcesToUse.forEach((src, srcIndex) => {
    for (let i = 0; i < Math.ceil(limit / sourcesToUse.length) && mockBooks.length < limit; i++) {
      const isArabic = src === 'hindawi' || src === 'noor';
      
      mockBooks.push({
        source: src,
        id: `${src}_${i}`,
        title: isArabic ? `كتاب عربي ${i + 1} - ${query}` : `Sample Book ${i + 1} - ${query}`,
        author: isArabic ? 'مؤلف عربي' : 'Sample Author',
        description: isArabic 
          ? `كتاب تجريبي من ${sources[src]} حول موضوع ${query}` 
          : `A sample book from ${sources[src]} about ${query}`,
        language: isArabic ? 'ar' : 'en',
        cover: '/images/default-book-cover.jpg',
        formats: {
          epub: `https://example.com/${src}/book_${i}.epub`,
          ...(src !== 'standard_ebooks' && { pdf: `https://example.com/${src}/book_${i}.pdf` }),
          ...(src === 'gutenberg' && { txt: `https://example.com/${src}/book_${i}.txt` })
        },
        metadata: {
          publication_date: '2024-01-01',
          subjects: isArabic ? ['أدب عربي', 'ثقافة'] : ['Fiction', 'Literature'],
          rights: 'Public Domain'
        }
      });
    }
  });

  return mockBooks;
}

module.exports = router;
