const mongoose = require('mongoose');

/**
 * Database Utility Functions
 */
class DatabaseUtils {
  /**
   * Connect to MongoDB
   * @returns {Promise<void>} Connection promise
   */
  static async connectDB() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kitabi';
      
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });

      console.log(`✅ MongoDB Connected: ${mongoUri}`);
      
      // Setup connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
      });

      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Connect to MongoDB (alias for Vercel compatibility)
   * @returns {Promise<void>} Connection promise
   */
  static async connect() {
    return this.connectDB();
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>} Disconnection promise
   */
  static async disconnectDB() {
    try {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ MongoDB disconnection error:', error.message);
      throw error;
    }
  }

  /**
   * Check if MongoDB is connected
   * @returns {boolean} Connection status
   */
  static isConnected() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get connection status string
   * @returns {string} Connection status
   */
  static getConnectionStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    return states[mongoose.connection.readyState] || 'unknown';
  }

  /**
   * Validate MongoDB ObjectId
   * @param {string} id - ID to validate
   * @returns {boolean} True if valid ObjectId
   */
  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  /**
   * Convert string to ObjectId
   * @param {string} id - ID string
   * @returns {mongoose.Types.ObjectId} ObjectId
   */
  static toObjectId(id) {
    if (!this.isValidObjectId(id)) {
      throw new Error('Invalid ObjectId format');
    }
    return new mongoose.Types.ObjectId(id);
  }

  /**
   * Sanitize query object
   * @param {Object} query - Query object
   * @returns {Object} Sanitized query
   */
  static sanitizeQuery(query) {
    const sanitized = {};
    
    Object.keys(query).forEach(key => {
      const value = query[key];
      
      // Skip empty values
      if (value === undefined || value === null || value === '') {
        return;
      }
      
      // Convert ObjectId strings
      if (key.endsWith('Id') && typeof value === 'string' && this.isValidObjectId(value)) {
        sanitized[key] = this.toObjectId(value);
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  }

  /**
   * Build pagination query
   * @param {Object} options - Pagination options
   * @returns {Object} Pagination query
   */
  static buildPaginationQuery(options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return {
      skip,
      limit: limitNum,
      sort,
      page: parseInt(page),
      pageSize: limitNum
    };
  }

  /**
   * Build search query with text search
   * @param {string} searchTerm - Search term
   * @param {Array} fields - Fields to search in
   * @returns {Object} Search query
   */
  static buildSearchQuery(searchTerm, fields = []) {
    if (!searchTerm || !searchTerm.trim()) {
      return {};
    }

    const term = searchTerm.trim();
    
    // If no specific fields provided, use text search
    if (fields.length === 0) {
      return { $text: { $search: term } };
    }

    // Build regex search for specific fields
    const searchConditions = fields.map(field => ({
      [field]: { $regex: term, $options: 'i' }
    }));

    return { $or: searchConditions };
  }

  /**
   * Build filter query
   * @param {Object} filters - Filter object
   * @param {Array} allowedFields - Allowed filter fields
   * @returns {Object} Filter query
   */
  static buildFilterQuery(filters = {}, allowedFields = []) {
    const query = {};

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      // Skip if field not allowed or value is empty
      if (!allowedFields.includes(key) || !value || value === 'all') {
        return;
      }

      // Handle array values (multiple selections)
      if (Array.isArray(value)) {
        query[key] = { $in: value };
      } else if (typeof value === 'string') {
        // Handle string values
        query[key] = value;
      } else {
        query[key] = value;
      }
    });

    return query;
  }

  /**
   * Execute aggregation with error handling
   * @param {mongoose.Model} model - Mongoose model
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} Aggregation result
   */
  static async executeAggregation(model, pipeline) {
    try {
      return await model.aggregate(pipeline).exec();
    } catch (error) {
      throw new Error(`Aggregation failed: ${error.message}`);
    }
  }

  /**
   * Execute transaction
   * @param {Function} operations - Operations to execute in transaction
   * @returns {Promise<any>} Transaction result
   */
  static async executeTransaction(operations) {
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      const result = await operations(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get collection statistics
   * @param {mongoose.Model} model - Mongoose model
   * @returns {Promise<Object>} Collection stats
   */
  static async getCollectionStats(model) {
    try {
      const stats = await model.collection.stats();
      return {
        documentCount: stats.count || 0,
        storageSize: stats.storageSize || 0,
        indexCount: stats.nindexes || 0,
        avgDocSize: stats.avgObjSize || 0
      };
    } catch (error) {
      return {
        documentCount: 0,
        storageSize: 0,
        indexCount: 0,
        avgDocSize: 0
      };
    }
  }

  /**
   * Create database indexes
   * @param {mongoose.Model} model - Mongoose model
   * @param {Array} indexes - Index definitions
   */
  static async createIndexes(model, indexes) {
    try {
      for (const index of indexes) {
        await model.createIndex(index.fields, index.options || {});
      }
    } catch (error) {
      console.warn(`Index creation failed for ${model.modelName}:`, error.message);
    }
  }

  /**
   * Perform health check on database
   * @returns {Promise<Object>} Health check result
   */
  static async healthCheck() {
    try {
      const isConnected = this.isConnected();
      const status = this.getConnectionStatus();
      
      if (!isConnected) {
        return {
          status: 'unhealthy',
          message: 'Database not connected',
          connectionState: status
        };
      }

      // Test a simple operation
      await mongoose.connection.db.admin().ping();
      
      return {
        status: 'healthy',
        message: 'Database connection is working',
        connectionState: status,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        connectionState: this.getConnectionStatus()
      };
    }
  }
}

module.exports = DatabaseUtils;
