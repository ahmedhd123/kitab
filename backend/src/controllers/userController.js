/**
 * User Controller
 * HTTP request handlers for user operations
 */

const userService = require('../services/userService');
const { asyncHandler, createSuccessResponse, createPaginationMeta } = require('../middleware/errorHandler');

class UserController {
  /**
   * @desc    Get current user profile
   * @route   GET /api/users/profile
   * @access  Private
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user.id);
    
    res.status(200).json(
      createSuccessResponse(user, 'Profile retrieved successfully')
    );
  });

  /**
   * @desc    Update current user profile
   * @route   PUT /api/users/profile
   * @access  Private
   */
  updateProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    
    res.status(200).json(
      createSuccessResponse(user, 'Profile updated successfully')
    );
  });

  /**
   * @desc    Change user password
   * @route   PUT /api/users/change-password
   * @access  Private
   */
  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    
    const user = await userService.changePassword(req.user.id, oldPassword, newPassword);
    
    res.status(200).json(
      createSuccessResponse(user, 'Password changed successfully')
    );
  });

  /**
   * @desc    Get user activity summary
   * @route   GET /api/users/activity
   * @access  Private
   */
  getUserActivity = asyncHandler(async (req, res) => {
    const activity = await userService.getUserActivity(req.user.id);
    
    res.status(200).json(
      createSuccessResponse(activity, 'User activity retrieved successfully')
    );
  });

  /**
   * @desc    Update user preferences
   * @route   PUT /api/users/preferences
   * @access  Private
   */
  updatePreferences = asyncHandler(async (req, res) => {
    const user = await userService.updatePreferences(req.user.id, req.body);
    
    res.status(200).json(
      createSuccessResponse(user, 'Preferences updated successfully')
    );
  });

  /**
   * @desc    Deactivate user account
   * @route   PUT /api/users/deactivate
   * @access  Private
   */
  deactivateAccount = asyncHandler(async (req, res) => {
    const user = await userService.deactivateAccount(req.user.id);
    
    res.status(200).json(
      createSuccessResponse(user, 'Account deactivated successfully')
    );
  });

  // Admin-only methods

  /**
   * @desc    Get all users
   * @route   GET /api/users
   * @access  Private/Admin
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      role = null,
      status = null
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
      search,
      role,
      status
    };

    const result = await userService.getAllUsers(options);
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.status(200).json(
      createSuccessResponse(result.users, 'Users retrieved successfully', meta)
    );
  });

  /**
   * @desc    Get user by ID
   * @route   GET /api/users/:id
   * @access  Private/Admin
   */
  getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    
    res.status(200).json(
      createSuccessResponse(user, 'User retrieved successfully')
    );
  });

  /**
   * @desc    Update user
   * @route   PUT /api/users/:id
   * @access  Private/Admin
   */
  updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    
    res.status(200).json(
      createSuccessResponse(user, 'User updated successfully')
    );
  });

  /**
   * @desc    Update user role
   * @route   PUT /api/users/:id/role
   * @access  Private/Admin
   */
  updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await userService.updateUserRole(req.params.id, role);
    
    res.status(200).json(
      createSuccessResponse(user, 'User role updated successfully')
    );
  });

  /**
   * @desc    Delete user
   * @route   DELETE /api/users/:id
   * @access  Private/Admin
   */
  deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    
    res.status(200).json(
      createSuccessResponse(null, 'User deleted successfully')
    );
  });

  /**
   * @desc    Get user statistics
   * @route   GET /api/users/stats
   * @access  Private/Admin
   */
  getUserStats = asyncHandler(async (req, res) => {
    const stats = await userService.getUserStats();
    
    res.status(200).json(
      createSuccessResponse(stats, 'User statistics retrieved successfully')
    );
  });

  /**
   * @desc    Search users
   * @route   GET /api/users/search
   * @access  Private/Admin
   */
  searchUsers = asyncHandler(async (req, res) => {
    const { q: query, page = 1, limit = 10 } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await userService.searchUsers(query, options);
    const meta = createPaginationMeta(result.page, result.limit, result.total);
    
    res.status(200).json(
      createSuccessResponse(result.users, 'Users search completed', meta)
    );
  });

  /**
   * @desc    Reactivate user account
   * @route   PUT /api/users/:id/reactivate
   * @access  Private/Admin
   */
  reactivateAccount = asyncHandler(async (req, res) => {
    const user = await userService.reactivateAccount(req.params.id);
    
    res.status(200).json(
      createSuccessResponse(user, 'Account reactivated successfully')
    );
  });

  /**
   * @desc    Bulk create users
   * @route   POST /api/users/bulk
   * @access  Private/Admin
   */
  bulkCreateUsers = asyncHandler(async (req, res) => {
    const { users } = req.body;
    const result = await userService.bulkCreateUsers(users);
    
    res.status(201).json(
      createSuccessResponse(result, `${result.length} users created successfully`)
    );
  });

  /**
   * @desc    Bulk update users
   * @route   PUT /api/users/bulk
   * @access  Private/Admin
   */
  bulkUpdateUsers = asyncHandler(async (req, res) => {
    const { updates } = req.body;
    const result = await userService.bulkUpdateUsers(updates);
    
    res.status(200).json(
      createSuccessResponse(result, `${result.modifiedCount} users updated successfully`)
    );
  });

  /**
   * @desc    Bulk delete users
   * @route   DELETE /api/users/bulk
   * @access  Private/Admin
   */
  bulkDeleteUsers = asyncHandler(async (req, res) => {
    const { userIds } = req.body;
    const result = await userService.bulkDeleteUsers(userIds);
    
    res.status(200).json(
      createSuccessResponse(result, `${result.deletedCount} users deleted successfully`)
    );
  });
}

module.exports = new UserController();
