/**
 * Notification Controller
 * HTTP request handlers for notification operations
 */

const notificationService = require('../services/notificationService');
const { asyncHandler, createSuccessResponse } = require('../middleware/errorHandler');

class NotificationController {
  /**
   * Get user notifications
   * GET /api/notifications
   */
  getUserNotifications = asyncHandler(async (req, res) => {
    const result = await notificationService.getUserNotifications(
      req.user.userId,
      req.query
    );
    
    res.json(createSuccessResponse(
      result.notifications,
      'Notifications retrieved successfully',
      result.pagination
    ));
  });

  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   */
  markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.userId
    );
    
    res.json(createSuccessResponse(
      notification,
      'Notification marked as read'
    ));
  });

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  markAllAsRead = asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user.userId);
    
    res.json(createSuccessResponse(
      result,
      'All notifications marked as read'
    ));
  });

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  deleteNotification = asyncHandler(async (req, res) => {
    const result = await notificationService.deleteNotification(
      req.params.id,
      req.user.userId
    );
    
    res.json(createSuccessResponse(
      result,
      'Notification deleted successfully'
    ));
  });

  /**
   * Get notification statistics
   * GET /api/notifications/stats
   */
  getNotificationStats = asyncHandler(async (req, res) => {
    const stats = await notificationService.getNotificationStats(req.user.userId);
    
    res.json(createSuccessResponse(
      stats,
      'Notification statistics retrieved successfully'
    ));
  });

  /**
   * Create test notification (for development)
   * POST /api/notifications/test
   */
  createTestNotification = asyncHandler(async (req, res) => {
    const notification = await notificationService.createNotification({
      userId: req.user.userId,
      type: req.body.type || 'system',
      title: req.body.title || 'إشعار تجريبي',
      message: req.body.message || 'هذا إشعار تجريبي من النظام',
      priority: req.body.priority || 'medium'
    });
    
    res.status(201).json(createSuccessResponse(
      notification,
      'Test notification created successfully'
    ));
  });
}

module.exports = new NotificationController();
