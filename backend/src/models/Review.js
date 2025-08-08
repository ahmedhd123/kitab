const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Basic Review Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  
  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000
  },
  
  // Reading Details
  readingStatus: {
    type: String,
    enum: ['want-to-read', 'currently-reading', 'read', 'did-not-finish'],
    default: 'read'
  },
  readingDates: {
    startDate: { type: Date },
    finishDate: { type: Date }
  },
  rereadCount: { type: Number, default: 0 },
  
  // AI Analysis
  aiAnalysis: {
    sentiment: {
      score: { type: Number }, // -1 to 1
      label: { type: String, enum: ['positive', 'neutral', 'negative'] }
    },
    topics: [{ type: String }],
    readingLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    helpfulnessScore: { type: Number, default: 0 }, // 0 to 1
    lastAnalyzed: { type: Date }
  },
  
  // Social Features
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  
  // Interaction Stats
  stats: {
    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    helpfulVotes: { type: Number, default: 0 },
    notHelpfulVotes: { type: Number, default: 0 }
  },
  
  // Review Metadata
  isEdited: { type: Boolean, default: false },
  editHistory: [{
    editedAt: { type: Date, default: Date.now },
    reason: { type: String }
  }],
  
  // Privacy and Moderation
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  isApproved: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  spoilerAlert: { type: Boolean, default: false },
  
  // Additional Features
  recommendedFor: [{ type: String }], // User-defined audience
  personalNotes: { type: String, maxlength: 1000 }, // Private notes
  quotedPassages: [{
    text: { type: String, required: true },
    pageNumber: { type: Number },
    note: { type: String }
  }]
  
}, {
  timestamps: true
});

// Indexes for better performance
reviewSchema.index({ user: 1, book: 1 }, { unique: true }); // One review per user per book
reviewSchema.index({ book: 1, rating: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: -1, createdAt: -1 });
reviewSchema.index({ 'aiAnalysis.helpfulnessScore': -1 });
reviewSchema.index({ 'stats.likesCount': -1 });

// Virtual for reading duration
reviewSchema.virtual('readingDuration').get(function() {
  if (this.readingDates.startDate && this.readingDates.finishDate) {
    const duration = this.readingDates.finishDate - this.readingDates.startDate;
    return Math.ceil(duration / (1000 * 60 * 60 * 24)); // days
  }
  return null;
});

// Virtual for helpfulness ratio
reviewSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.stats.helpfulVotes + this.stats.notHelpfulVotes;
  if (total === 0) return 0;
  return this.stats.helpfulVotes / total;
});

// Pre-save middleware to update stats
reviewSchema.pre('save', function(next) {
  // Update likes count
  this.stats.likesCount = this.likes.length;
  
  // Update comments count
  this.stats.commentsCount = this.comments.length;
  
  // Mark as edited if content changed (but not on first save)
  if (!this.isNew && this.isModified('content')) {
    this.isEdited = true;
    this.editHistory.push({
      editedAt: new Date(),
      reason: 'Content updated'
    });
  }
  
  next();
});

// Method to add a like
reviewSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    this.stats.likesCount++;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove a like
reviewSchema.methods.removeLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
    this.stats.likesCount--;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add a comment
reviewSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content
  });
  this.stats.commentsCount++;
  return this.save();
};

// Static method to get trending reviews
reviewSchema.statics.getTrending = function(limit = 10) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: oneDayAgo }, visibility: 'public' } },
    { $addFields: { 
        trendingScore: { 
          $add: [
            '$stats.likesCount',
            { $multiply: ['$stats.commentsCount', 2] },
            { $multiply: ['$stats.sharesCount', 3] }
          ]
        }
      }
    },
    { $sort: { trendingScore: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'book' } }
  ]);
};

// Static method to get reviews by rating
reviewSchema.statics.getByRating = function(rating, limit = 10) {
  return this.find({ rating, visibility: 'public' })
    .populate('user', 'username profile.firstName profile.lastName profile.avatar')
    .populate('book', 'title authors covers.thumbnail')
    .sort({ 'stats.likesCount': -1 })
    .limit(limit);
};

module.exports = mongoose.model('Review', reviewSchema);
