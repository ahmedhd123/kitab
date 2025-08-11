const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile Information
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    avatar: { type: String },
    location: { type: String, trim: true },
    website: { type: String, trim: true },
    dateOfBirth: { type: Date },
    favoriteGenres: [{ type: String }],
    readingGoal: {
      yearly: { type: Number, default: 12 },
      current: { type: Number, default: 0 }
    }
  },

  // Reading Statistics
  stats: {
    booksRead: { type: Number, default: 0 },
    pagesRead: { type: Number, default: 0 },
    reviewsWritten: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now }
  },

  // Social Features
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Privacy Settings
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    showReadingActivity: { type: Boolean, default: true },
    allowRecommendations: { type: Boolean, default: true }
  },

  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  
  // Admin and Role Management
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  isAdmin: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'], 
    default: 'active' 
  },
  name: { type: String, trim: true }, // For admin display
  
  // AI Preferences
  aiPreferences: {
    enableRecommendations: { type: Boolean, default: true },
    moodAnalysis: { type: Boolean, default: true },
    autoSummaries: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'profile.favoriteGenres': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  return userObject;
};

// Get reading statistics
userSchema.methods.getReadingStats = function() {
  return {
    booksRead: this.stats.booksRead,
    pagesRead: this.stats.pagesRead,
    reviewsWritten: this.stats.reviewsWritten,
    averageRating: this.stats.averageRating,
    yearlyGoal: this.profile.readingGoal.yearly,
    currentProgress: this.profile.readingGoal.current
  };
};

module.exports = mongoose.model('User', userSchema);
