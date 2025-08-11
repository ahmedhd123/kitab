/**
 * User Routes
 * Routes for user management and profile operations
 */

const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController');

// Middleware
const { authenticate, authorize } = require('../middleware/auth');
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
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);
router.get('/activity', authenticate, userController.getUserActivity);
router.put('/preferences', authenticate, validate(updatePreferencesSchema), userController.updatePreferences);
router.put('/deactivate', authenticate, userController.deactivateAccount);

// Admin Routes
router.get('/stats', authenticate, authorize(['admin']), userController.getUserStats);
router.get('/search', authenticate, authorize(['admin', 'moderator']), validate(searchUsersSchema, 'query'), userController.searchUsers);
router.get('/', authenticate, authorize(['admin', 'moderator']), validate(userQuerySchema, 'query'), userController.getAllUsers);

// Bulk Operations (Admin only)
router.post('/bulk', authenticate, authorize(['admin']), validate(bulkCreateUsersSchema), userController.bulkCreateUsers);
router.put('/bulk', authenticate, authorize(['admin']), validate(bulkUpdateUsersSchema), userController.bulkUpdateUsers);
router.delete('/bulk', authenticate, authorize(['admin']), validate(bulkDeleteUsersSchema), userController.bulkDeleteUsers);

// Individual User Management (Admin/Moderator)
router.get('/:id', authenticate, authorize(['admin', 'moderator']), userController.getUserById);
router.put('/:id', authenticate, authorize(['admin']), validate(updateUserSchema), userController.updateUser);
router.put('/:id/role', authenticate, authorize(['admin']), validate(updateRoleSchema), userController.updateUserRole);
router.put('/:id/reactivate', authenticate, authorize(['admin']), userController.reactivateAccount);
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

module.exports = router;
