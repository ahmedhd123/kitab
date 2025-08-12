const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // Basic Book Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  authors: [{
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['author', 'co-author', 'editor', 'translator'], default: 'author' }
  }],
  isbn: {
    isbn10: { type: String, trim: true },
    isbn13: { type: String, trim: true }
  },
  
  // Publication Details
  publisher: { type: String, trim: true },
  publishedDate: { type: Date },
  language: { type: String, default: 'ar' },
  pages: { type: Number, min: 1 },
  
  // Book Content
  description: { type: String, maxlength: 2000 },
  genres: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true }],
  
  // Media
  covers: {
    thumbnail: { type: String },
    small: { type: String },
    medium: { type: String },
    large: { type: String }
  },
  
  // Digital Book Files
  digitalFiles: {
    epub: {
      url: { type: String },
      fileSize: { type: Number }, // in bytes
      uploadDate: { type: Date },
      viewCount: { type: Number, default: 0 }, // Changed from downloadCount
      readingTime: { type: Number, default: 0 } // Total reading time in minutes
    },
    mobi: {
      url: { type: String },
      fileSize: { type: Number },
      uploadDate: { type: Date },
      viewCount: { type: Number, default: 0 },
      readingTime: { type: Number, default: 0 }
    },
    pdf: {
      url: { type: String },
      fileSize: { type: Number },
      uploadDate: { type: Date },
      viewCount: { type: Number, default: 0 },
      readingTime: { type: Number, default: 0 }
    }
  },
  
  // Reading Features
  readingFeatures: {
    tableOfContents: [{ 
      title: String, 
      href: String, 
      level: Number 
    }],
    bookmarks: { type: Boolean, default: true },
    notes: { type: Boolean, default: true },
    search: { type: Boolean, default: true },
    fontSize: { type: Boolean, default: true },
    fontFamily: { type: Boolean, default: true },
    nightMode: { type: Boolean, default: true },
    rtlSupport: { type: Boolean, default: true }
  },
  
  // Digital Rights Management
  drm: {
    isProtected: { type: Boolean, default: false },
    licenseType: { type: String, enum: ['free', 'premium', 'subscription'], default: 'free' },
    downloadLimit: { type: Number, default: -1 }, // -1 means unlimited
    expirationDate: { type: Date },
    allowedDevices: { type: Number, default: 5 }
  },
  
  // Ratings and Reviews
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  
  // AI Generated Content
  aiGenerated: {
    summary: { type: String, maxlength: 1000 },
    moodTags: [{ type: String }],
    themes: [{ type: String }],
    readingLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    estimatedReadingTime: { type: Number }, // in minutes
    keyQuotes: [{ type: String }],
    lastAnalyzed: { type: Date }
  },
  
  // External Sources
  externalIds: {
    goodreads: { type: String },
    googleBooks: { type: String },
    openLibrary: { type: String },
    amazonASIN: { type: String }
  },
  
  // Statistics
  stats: {
    views: { type: Number, default: 0 },
    wishlistedBy: { type: Number, default: 0 },
    currentlyReading: { type: Number, default: 0 },
    timesRead: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 }
  },
  
  // Administrative
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isPublic: { type: Boolean, default: true },
  
}, {
  timestamps: true
});

// Indexes for better performance
// Text index removed temporarily due to language conflict
// bookSchema.index({ title: 'text', description: 'text' }, { default_language: 'none' });
bookSchema.index({ 'authors.name': 1 });
bookSchema.index({ genres: 1 });
bookSchema.index({ 'ratings.average': -1 });
bookSchema.index({ 'stats.views': -1 });
bookSchema.index({ publishedDate: -1 });
bookSchema.index({ 'isbn.isbn13': 1 });
bookSchema.index({ 'isbn.isbn10': 1 });

// Virtual for full author names
bookSchema.virtual('authorNames').get(function() {
  return this.authors.map(author => author.name).join(', ');
});

// Virtual for rating percentage
bookSchema.virtual('ratingPercentage').get(function() {
  return (this.ratings.average / 5) * 100;
});

// Method to update rating
bookSchema.methods.updateRating = function(newRating) {
  const oldCount = this.ratings.count;
  const oldAverage = this.ratings.average;
  
  // Update distribution
  this.ratings.distribution[newRating]++;
  this.ratings.count++;
  
  // Calculate new average
  const totalRating = (oldAverage * oldCount) + newRating;
  this.ratings.average = totalRating / this.ratings.count;
  
  return this.save();
};

// Method to get reading difficulty
bookSchema.methods.getReadingDifficulty = function() {
  const pageCount = this.pages || 0;
  const avgRating = this.ratings.average || 0;
  
  if (pageCount < 200 && avgRating >= 4) return 'easy';
  if (pageCount < 400 && avgRating >= 3.5) return 'moderate';
  return 'challenging';
};

// Method to add digital file
bookSchema.methods.addDigitalFile = function(format, fileData) {
  if (!this.digitalFiles[format]) {
    this.digitalFiles[format] = {};
  }
  
  this.digitalFiles[format] = {
    ...this.digitalFiles[format],
    ...fileData,
    uploadDate: new Date()
  };
  
  return this.save();
};

// Method to get available formats
bookSchema.methods.getAvailableFormats = function() {
  const formats = [];
  
  if (this.digitalFiles.epub && this.digitalFiles.epub.url) formats.push('epub');
  if (this.digitalFiles.mobi && this.digitalFiles.mobi.url) formats.push('mobi');
  if (this.digitalFiles.pdf && this.digitalFiles.pdf.url) formats.push('pdf');
  
  return formats;
};

// Method to track reading session
bookSchema.methods.trackReading = function(format, sessionTime) {
  if (this.digitalFiles[format]) {
    this.digitalFiles[format].viewCount = (this.digitalFiles[format].viewCount || 0) + 1;
    this.digitalFiles[format].readingTime = (this.digitalFiles[format].readingTime || 0) + sessionTime;
    return this.save();
  }
  return Promise.reject(new Error('Format not available'));
};

// Method to check reading permission
bookSchema.methods.canRead = function(userId, format) {
  const file = this.digitalFiles[format];
  if (!file || !file.url) return false;
  
  // Check DRM restrictions
  if (this.drm.isProtected) {
    if (this.drm.expirationDate && new Date() > this.drm.expirationDate) {
      return false;
    }
  }
  
  return true;
};

// Method to get reading statistics
bookSchema.methods.getReadingStats = function(format) {
  const file = this.digitalFiles[format];
  if (!file) return null;
  
  return {
    viewCount: file.viewCount || 0,
    totalReadingTime: file.readingTime || 0,
    avgReadingTime: file.viewCount > 0 ? Math.round((file.readingTime || 0) / file.viewCount) : 0
  };
};

// Method to get file size in human readable format
bookSchema.methods.getFormattedFileSize = function(format) {
  const file = this.digitalFiles[format];
  if (!file || !file.fileSize) return 'Unknown';
  
  const bytes = file.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Static method to find similar books
bookSchema.statics.findSimilar = function(bookId, limit = 5) {
  return this.aggregate([
    { $match: { _id: { $ne: bookId } } },
    { $sample: { size: limit } } // Simple random sampling for now
  ]);
};

module.exports = mongoose.model('Book', bookSchema);
