const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Notification content
  type: {
    type: String,
    enum: ['review', 'follow', 'like', 'comment', 'recommendation', 'book_added', 'system'],
    required: true
  },
  
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Related entities
  relatedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  relatedReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  
  // Status
  read: {
    type: Boolean,
    default: false
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Action data (for clickable notifications)
  actionUrl: {
    type: String
  },
  
  actionData: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// Virtual for relative time
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${days} يوم`;
});

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  return await this.create({
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    relatedBook: data.relatedBook,
    relatedUser: data.relatedUser,
    relatedReview: data.relatedReview,
    priority: data.priority || 'medium',
    actionUrl: data.actionUrl,
    actionData: data.actionData
  });
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  return await this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
