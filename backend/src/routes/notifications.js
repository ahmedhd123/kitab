/**
 * Notification Routes
 * Routes for notification management and operations
 */

const express = require('express');
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * Protected Routes (require authentication)
 */

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, notificationController.getUserNotifications);

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private
router.get('/stats', auth, notificationController.getNotificationStats);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, notificationController.markAllAsRead);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, notificationController.markAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, notificationController.deleteNotification);

// @route   POST /api/notifications/test
// @desc    Create test notification (development only)
// @access  Private
router.post('/test', auth, notificationController.createTestNotification);

/**
 * Utility Routes
 */

// @route   GET /api/notifications/health
// @desc    Notifications service health check
// @access  Public
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Notifications',
    status: 'operational',
    features: {
      realTimeNotifications: true,
      pushNotifications: false, // Not implemented yet
      emailNotifications: false, // Not implemented yet
      inAppNotifications: true
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
