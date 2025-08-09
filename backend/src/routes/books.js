const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');
const { auth } = require('../middleware/auth');
const { 
  uploadSingle, 
  uploadMultiple, 
  handleUploadError,
  getFileFormat,
  getFileSize,
  deleteFile,
  validateFile,
  booksDir 
} = require('../middleware/upload');

// Import sample data
const { sampleBooks } = require(path.join(__dirname, '../../scripts/create-sample-data'));

// Get sample books (for testing without database)
router.get('/sample', async (req, res) => {
  try {
    const { page = 1, limit = 12, genre, author, search } = req.query;
    let books = [...sampleBooks];
    
    // Apply filters
    if (genre) {
      books = books.filter(book => 
        book.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
      );
    }
    
    if (author) {
      books = books.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase()) ||
        book.authorArabic.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    if (search) {
      books = books.filter(book => 
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.titleArabic.toLowerCase().includes(search.toLowerCase()) ||
        book.description.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBooks = books.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        books: paginatedBooks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(books.length / limit),
          totalBooks: books.length,
          hasNext: endIndex < books.length,
          hasPrev: startIndex > 0
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

// Get sample book by ID (for testing without database)
router.get('/sample/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = sampleBooks.find(book => book.id === id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الكتاب',
      error: error.message
    });
  }
});

// Get sample book metadata for reading (public endpoint)
router.get('/sample/:id/metadata/:format', async (req, res) => {
  try {
    const { id, format } = req.params;
    const book = sampleBooks.find(book => book.id === id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    const digitalFile = book.digitalFiles?.[format];
    if (!digitalFile) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير متوفر بهذه الصيغة'
      });
    }
    
    res.json({
      success: true,
      data: {
        title: book.title,
        titleArabic: book.titleArabic,
        author: book.author,
        authorArabic: book.authorArabic,
        description: book.description,
        format: format,
        url: digitalFile.url,
        size: digitalFile.size,
        language: book.language || 'en',
        readingFeatures: {
          hasAudio: false,
          hasBookmarks: true,
          hasNotes: true,
          hasSearch: true
        },
        drm: { isProtected: false }
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

// Get sample book content (for demo Arabic books)
router.get('/sample/:id/content/:format', async (req, res) => {
  try {
    const { id, format } = req.params;
    const book = sampleBooks.find(book => book.id === id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    // Generate sample Arabic content for demo books
    if (book.language === 'ar') {
      let content = '';
      
      if (format === 'txt') {
        content = generateArabicTextContent(book);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(content);
      } else if (format === 'epub') {
        content = generateEpubContent(book);
        res.setHeader('Content-Type', 'application/epub+zip');
        res.json({ content, chapters: generateChapters(book) });
      } else if (format === 'pdf') {
        res.json({
          success: false,
          message: 'عذراً، نحن نركز على صيغ الكتب الإلكترونية القياسية (EPUB, MOBI, TXT) لتوفير تجربة قراءة أفضل'
        });
      } else {
        content = generateMobiContent(book);
        res.json({ content, chapters: generateChapters(book) });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'المحتوى غير متوفر'
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المحتوى',
      error: error.message
    });
  }
});

function generateArabicTextContent(book) {
  return `
${book.titleArabic}
بقلم: ${book.authorArabic}

${book.description}

الفصل الأول: المقدمة

في عالم مليء بالكلمات والحكايات، تبرز هذه القصة كواحدة من أجمل ما كُتب في الأدب العربي. إنها حكاية عن الحب والحياة، عن الأمل والألم، عن كل ما يجعل الإنسان إنساناً.

تأخذنا هذه الرواية في رحلة عبر الزمن والمكان، حيث نتعرف على شخصيات حية نابضة بالحياة، كل منها تحمل في طياتها حكاية خاصة وتجربة فريدة.

الفصل الثاني: البداية

كانت البداية صعبة، كما هو الحال مع كل الأشياء الجميلة في الحياة. لم يكن الطريق مفروشاً بالورود، بل كان مليئاً بالتحديات والصعوبات التي جعلت كل خطوة إلى الأمام إنجازاً يستحق الاحتفال.

في هذا الفصل، نتعرف على الشخصيات الرئيسية وندخل في عمق عالمها الداخلي، نفهم دوافعها ومخاوفها، آمالها وأحلامها.

الفصل الثالث: التطور

مع تقدم الأحداث، تبدأ الشخصيات في التطور والنمو. نراها تواجه تحديات جديدة وتتخذ قرارات مصيرية تغير مجرى حياتها إلى الأبد.

هذا الفصل مليء بالتشويق والإثارة، حيث تتسارع الأحداث وتتعقد الأمور بطريقة تجعل القارئ متشوقاً لمعرفة ما سيحدث بعد ذلك.

الفصل الرابع: الذروة

هنا تصل الأحداث إلى ذروتها، حيث تتداخل خيوط القصة وتتشابك بطريقة محكمة. نشهد لحظات من التوتر والإثارة تحبس الأنفاس وتجعل القلب ينبض بقوة.

الشخصيات تواجه أكبر تحدياتها، وعليها أن تتخذ أصعب القرارات في حياتها. إنه فصل مليء بالعواطف القوية والمشاعر الصادقة.

الفصل الخامس: الحل

بعد كل ما مر به الأبطال، يأتي وقت الحل والنهاية. لكن هذه النهاية ليست مجرد إنهاء للأحداث، بل هي بداية جديدة لفهم أعمق للحياة والإنسان.

في هذا الفصل، نجد الإجابات على كثير من الأسئلة التي طرحناها في بداية الرحلة، ونكتشف حقائق جديدة عن أنفسنا وعن العالم من حولنا.

الخاتمة

في النهاية، تبقى هذه القصة في قلوبنا وعقولنا، تذكرنا بقوة الكلمة وجمال الأدب. إنها دعوة للتأمل والتفكير، دعوة لأن نكون أفضل مما نحن عليه.

هذا الكتاب ليس مجرد حكاية، بل هو مرآة نرى فيها أنفسنا، ونافذة نطل منها على عوالم جديدة مليئة بالإمكانيات والأحلام.
`;
}

function generateEpubContent(book) {
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="rtl" lang="ar">
<head>
    <meta charset="utf-8"/>
    <title>${book.titleArabic}</title>
    <style>
        body {
            font-family: 'Amiri', 'Noto Sans Arabic', 'Cairo', serif;
            line-height: 1.8;
            margin: 2em;
            text-align: justify;
            direction: rtl;
        }
        h1, h2, h3 {
            text-align: center;
            color: #2c3e50;
        }
        .chapter {
            margin: 3em 0;
            page-break-before: always;
        }
        .quote {
            font-style: italic;
            margin: 2em;
            padding: 1em;
            border-right: 4px solid #3498db;
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="chapter">
        <h1>${book.titleArabic}</h1>
        <h2>بقلم: ${book.authorArabic}</h2>
        <p>${book.description}</p>
    </div>
    
    <div class="chapter">
        <h2>الفصل الأول: المقدمة</h2>
        <p>في عالم مليء بالكلمات والحكايات، تبرز هذه القصة كواحدة من أجمل ما كُتب في الأدب العربي...</p>
    </div>
    
    <div class="chapter">
        <h2>الفصل الثاني: البداية</h2>
        <p>كانت البداية صعبة، كما هو الحال مع كل الأشياء الجميلة في الحياة...</p>
    </div>
</body>
</html>
`;
}

function generateMobiContent(book) {
  return generateEpubContent(book); // Similar format for demo
}

function generateChapters(book) {
  return [
    { id: '1', title: 'المقدمة', href: '#chapter-1', level: 1 },
    { id: '2', title: 'الفصل الأول: البداية', href: '#chapter-2', level: 1 },
    { id: '3', title: 'الفصل الثاني: التطور', href: '#chapter-3', level: 1 },
    { id: '4', title: 'الفصل الثالث: الذروة', href: '#chapter-4', level: 1 },
    { id: '5', title: 'الفصل الرابع: الحل', href: '#chapter-5', level: 1 },
    { id: '6', title: 'الخاتمة', href: '#chapter-6', level: 1 }
  ];
}

// Get all books
router.get('/', async (req, res) => {
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
