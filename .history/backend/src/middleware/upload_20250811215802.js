const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
const booksDir = path.join(uploadDir, 'books');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, booksDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${baseName}_${uniqueSuffix}${ext}`);
  }
});

// File filter for allowed book formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/epub+zip',  // EPUB
    'application/x-mobipocket-ebook',  // MOBI
    'application/pdf',  // PDF
    'audio/mpeg',  // MP3 audiobook
    'audio/mp4',   // M4A audiobook
    'audio/wav'    // WAV audiobook
  ];
  
  const allowedExtensions = ['.epub', '.mobi', '.pdf', '.mp3', '.m4a', '.wav'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم. الصيغ المدعومة: EPUB, MOBI, PDF, MP3, M4A, WAV'), false);
  }
};

// Size limits for different file types
const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB general limit
};

// Create multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

// Middleware for single file upload
const uploadSingle = upload.single('bookFile');

// Middleware for multiple files upload (any field names)
const uploadMultiple = upload.any(); // Accept any fields with files

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'عدد الملفات كبير جداً. الحد الأقصى 5 ملفات'
      });
    }
  }
  
  return res.status(400).json({
    success: false,
    message: error.message || 'خطأ في رفع الملف'
  });
};

// Helper function to get file format from extension
const getFileFormat = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  
  switch (ext) {
    case '.epub':
      return 'epub';
    case '.mobi':
      return 'mobi';
    case '.pdf':
      return 'pdf';
    case '.mp3':
    case '.m4a':
    case '.wav':
      return 'audiobook';
    default:
      return 'unknown';
  }
};

// Helper function to get file size
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to validate file integrity
const validateFile = async (filePath, format) => {
  try {
    const stats = fs.statSync(filePath);
    
    // Basic file size validation
    if (stats.size === 0) {
      throw new Error('الملف فارغ');
    }
    
    // Format-specific validation can be added here
    switch (format) {
      case 'epub':
        // EPUB files should start with PK (ZIP signature)
        const epubBuffer = fs.readFileSync(filePath, { start: 0, end: 1 });
        if (epubBuffer[0] !== 0x50 || epubBuffer[1] !== 0x4B) {
          throw new Error('ملف EPUB غير صحيح');
        }
        break;
      
      case 'pdf':
        // PDF files should start with %PDF
        const pdfBuffer = fs.readFileSync(filePath, { start: 0, end: 3 });
        if (pdfBuffer.toString() !== '%PDF') {
          throw new Error('ملف PDF غير صحيح');
        }
        break;
      
      // Add more format validations as needed
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  getFileFormat,
  getFileSize,
  deleteFile,
  validateFile,
  booksDir
};
