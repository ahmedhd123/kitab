/**
 * User Routes
 * Routes for user management and profile operations
 */

const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController');

// Middleware
const { auth, adminAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Validators
const {
  updateProfileSchema,
  changePasswordSchema,
  updateUserSchema,
  updateRoleSchema,
  userQuerySchema,
  searchUsersSchema,
  bulkCreateUsersSchema,
  bulkUpdateUsersSchema,
  bulkDeleteUsersSchema,
  updatePreferencesSchema
} = require('../validators/userValidators');

// User Profile Routes (Protected)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);
router.get('/activity', auth, userController.getUserActivity);
router.put('/preferences', auth, userController.updatePreferences);
router.put('/deactivate', auth, userController.deactivateAccount);

// Admin Routes
router.get('/stats', adminAuth, userController.getUserStats);
router.get('/search', adminAuth, userController.searchUsers);
router.get('/', adminAuth, userController.getAllUsers);

// Bulk Operations (Admin only)
router.post('/bulk', adminAuth, userController.bulkCreateUsers);
router.put('/bulk', adminAuth, userController.bulkUpdateUsers);
router.delete('/bulk', adminAuth, userController.bulkDeleteUsers);

// Individual User Management (Admin/Moderator)
router.get('/:id', adminAuth, userController.getUserById);
router.put('/:id', adminAuth, userController.updateUser);
router.put('/:id/role', adminAuth, userController.updateUserRole);
router.put('/:id/reactivate', adminAuth, userController.reactivateAccount);
router.delete('/:id', adminAuth, userController.deleteUser);

module.exports = router;
