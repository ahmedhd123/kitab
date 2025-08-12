/**
 * Notification Service
 * Business logic for notification management
 */

const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(data) {
    try {
      const notification = await Notification.createNotification(data);
      
      // Populate related data for immediate use
      const populatedNotification = await Notification
        .findById(notification._id)
        .populate('relatedUser', 'username avatar')
        .populate('relatedBook', 'title author');
      
      return populatedNotification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        unreadOnly = false,
        type = null
      } = options;

      const filter = { userId };
      
      if (unreadOnly) {
        filter.read = false;
      }
      
      if (type) {
        filter.type = type;
      }

      const notifications = await Notification
        .find(filter)
        .populate('relatedUser', 'username avatar')
        .populate('relatedBook', 'title author')
        .populate('relatedReview', 'title rating')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(filter);

      return {
        notifications: notifications.map(notification => ({
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          read: notification.read,
          priority: notification.priority,
          timeAgo: notification.timeAgo,
          createdAt: notification.createdAt,
          actionUrl: notification.actionUrl,
          actionData: notification.actionData,
          relatedBook: notification.relatedBook,
          relatedUser: notification.relatedUser,
          relatedReview: notification.relatedReview
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId: userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.markAsRead();
      return notification;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId: userId, read: false },
        { read: true }
      );

      return {
        modifiedCount: result.modifiedCount,
        success: true
      };
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      const result = await Notification.deleteOne({
        _id: notificationId,
        userId: userId
      });

      if (result.deletedCount === 0) {
        throw new Error('Notification not found');
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId) {
    try {
      const stats = await Notification.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: {
              $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
            },
            byType: {
              $push: {
                type: '$type',
                read: '$read'
              }
            }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          total: 0,
          unread: 0,
          byType: {}
        };
      }

      const typeStats = {};
      stats[0].byType.forEach(item => {
        if (!typeStats[item.type]) {
          typeStats[item.type] = { total: 0, unread: 0 };
        }
        typeStats[item.type].total++;
        if (!item.read) {
          typeStats[item.type].unread++;
        }
      });

      return {
        total: stats[0].total,
        unread: stats[0].unread,
        byType: typeStats
      };
    } catch (error) {
      throw new Error(`Failed to get notification stats: ${error.message}`);
    }
  }

  /**
   * Helper methods for creating specific notification types
   */

  // Review notification
  async createReviewNotification(reviewData) {
    const { bookId, reviewerId, bookTitle, reviewerName } = reviewData;
    
    // Get book owner/admin to notify
    const bookOwners = await User.find({ role: 'admin' });
    
    for (const owner of bookOwners) {
      await this.createNotification({
        userId: owner._id,
        type: 'review',
        title: 'مراجعة جديدة',
        message: `${reviewerName} كتب مراجعة لكتاب "${bookTitle}"`,
        relatedBook: bookId,
        relatedUser: reviewerId,
        actionUrl: `/book/${bookId}`,
        priority: 'medium'
      });
    }
  }

  // Follow notification
  async createFollowNotification(followData) {
    const { followerId, followedId, followerName } = followData;
    
    await this.createNotification({
      userId: followedId,
      type: 'follow',
      title: 'متابع جديد',
      message: `${followerName} بدأ في متابعتك`,
      relatedUser: followerId,
      actionUrl: `/profile/${followerId}`,
      priority: 'medium'
    });
  }

  // Book recommendation notification
  async createRecommendationNotification(recData) {
    const { userId, bookId, bookTitle, reason } = recData;
    
    await this.createNotification({
      userId: userId,
      type: 'recommendation',
      title: 'توصية كتاب جديدة',
      message: `نقترح عليك كتاب "${bookTitle}" - ${reason}`,
      relatedBook: bookId,
      actionUrl: `/book/${bookId}`,
      priority: 'low'
    });
  }
}

module.exports = new NotificationService();
