/**
 * User Repository
 * Data access layer for user operations
 */

const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

class UserRepository {
  /**
   * Create a new user
   */
  async create(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new AppError(`User with this ${field} already exists`, 400, 'DUPLICATE_USER');
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    try {
      const user = await User.findById(id).select('-password');
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid user ID', 400, 'INVALID_USER_ID');
      }
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by username
   */
  async findByUsername(username) {
    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email or username
   */
  async findByEmailOrUsername(identifier) {
    try {
      const user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() }
        ]
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user by ID
   */
  async updateById(id, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated directly
      const { password, role, ...safeUpdateData } = updateData;
      
      const user = await User.findByIdAndUpdate(
        id,
        safeUpdateData,
        { 
          new: true, 
          runValidators: true 
        }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid user ID', 400, 'INVALID_USER_ID');
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new AppError(`User with this ${field} already exists`, 400, 'DUPLICATE_USER');
      }
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(id, newPasswordHash) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { password: newPasswordHash },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid user ID', 400, 'INVALID_USER_ID');
      }
      throw error;
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateRole(id, role) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid user ID', 400, 'INVALID_USER_ID');
      }
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  async deleteById(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid user ID', 400, 'INVALID_USER_ID');
      }
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        role = null,
        status = null
      } = options;

      // Build query
      const query = {};

      // Search by name, email, or username
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by role
      if (role) {
        query.role = role;
      }

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

      return {
        users,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getStats() {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ status: 'active' });
      const recentUsers = await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });

      return {
        total: totalUsers,
        active: activeUsers,
        recent: recentUsers,
        byRole: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user last login
   */
  async updateLastLogin(id) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { lastLogin: new Date() },
        { new: true }
      ).select('-password');

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user exists
   */
  async exists(query) {
    try {
      const user = await User.findOne(query);
      return !!user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk operations
   */
  async bulkCreate(users) {
    try {
      const result = await User.insertMany(users, { ordered: false });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdate(updates) {
    try {
      const operations = updates.map(update => ({
        updateOne: {
          filter: { _id: update.id },
          update: update.data
        }
      }));

      const result = await User.bulkWrite(operations);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      const result = await User.deleteMany({ _id: { $in: ids } });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
