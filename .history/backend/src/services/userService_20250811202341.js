/**
 * User Service
 * Business logic layer for user operations
 */

const userRepository = require('../repositories/userRepository');
const { AppError } = require('../middleware/errorHandler');
const { hashPassword, comparePassword } = require('../utils/encryption');
const { generateToken, verifyToken } = require('../utils/jwt');

class UserService {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const { email, username, password, name, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await userRepository.findByEmailOrUsername(email);
      if (existingUser) {
        const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
        throw new AppError(`User with this ${field} already exists`, 400, 'USER_EXISTS');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const newUser = await userRepository.create({
        name,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        role,
        status: 'active'
      });

      // Generate token
      const token = generateToken(newUser._id, newUser.role);

      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(identifier, password) {
    try {
      // Find user by email or username
      const user = await userRepository.findByEmailOrUsername(identifier);
      if (!user) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new AppError('Account is not active', 401, 'ACCOUNT_INACTIVE');
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      // Update last login
      await userRepository.updateLastLogin(user._id);

      // Generate token
      const token = generateToken(user._id, user.role);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    try {
      // Validate update data
      const allowedFields = ['name', 'bio', 'avatar', 'preferences'];
      const filteredData = {};
      
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });

      const user = await userRepository.updateById(userId, filteredData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId, oldPassword, newPassword) {
    try {
      // Get user with password
      const user = await userRepository.findByEmail(
        (await userRepository.findById(userId)).email
      );

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      // Verify old password
      const isOldPasswordValid = await comparePassword(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      const updatedUser = await userRepository.updatePassword(userId, hashedNewPassword);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(options) {
    try {
      const result = await userRepository.findAll(options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user (admin only)
   */
  async updateUser(userId, updateData) {
    try {
      const user = await userRepository.updateById(userId, updateData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId, role) {
    try {
      const user = await userRepository.updateRole(userId, role);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId) {
    try {
      const user = await userRepository.deleteById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user statistics (admin only)
   */
  async getUserStats() {
    try {
      const stats = await userRepository.getStats();
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify user token
   */
  async verifyUserToken(token) {
    try {
      const decoded = verifyToken(token);
      const user = await userRepository.findById(decoded.userId);
      
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      if (user.status !== 'active') {
        throw new AppError('Account is not active', 401, 'ACCOUNT_INACTIVE');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk user operations (admin only)
   */
  async bulkCreateUsers(users) {
    try {
      // Hash passwords for all users
      const usersWithHashedPasswords = await Promise.all(
        users.map(async (user) => ({
          ...user,
          email: user.email.toLowerCase(),
          username: user.username.toLowerCase(),
          password: await hashPassword(user.password),
          status: user.status || 'active'
        }))
      );

      const result = await userRepository.bulkCreate(usersWithHashedPasswords);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdateUsers(updates) {
    try {
      const result = await userRepository.bulkUpdate(updates);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkDeleteUsers(userIds) {
    try {
      const result = await userRepository.bulkDelete(userIds);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search users
   */
  async searchUsers(query, options = {}) {
    try {
      const searchOptions = {
        ...options,
        search: query
      };

      const result = await userRepository.findAll(searchOptions);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user activity summary
   */
  async getUserActivity(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      // TODO: Implement activity tracking
      // This would include reading history, reviews, favorites, etc.
      return {
        user,
        activity: {
          booksRead: 0,
          reviewsWritten: 0,
          favoriteBooks: 0,
          readingTime: 0
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId, preferences) {
    try {
      const user = await userRepository.updateById(userId, { preferences });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate user account
   */
  async deactivateAccount(userId) {
    try {
      const user = await userRepository.updateById(userId, { status: 'inactive' });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reactivate user account (admin only)
   */
  async reactivateAccount(userId) {
    try {
      const user = await userRepository.updateById(userId, { status: 'active' });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
