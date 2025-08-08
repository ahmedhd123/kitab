const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support multiple MongoDB connection options
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Try multiple connection strings in order of preference
    const connectionStrings = [
      process.env.MONGODB_URI, // Environment variable (highest priority)
      'mongodb://127.0.0.1:27017/kitabi', // Local IPv4
      'mongodb://localhost:27017/kitabi', // Local hostname
      'mongodb://0.0.0.0:27017/kitabi', // All interfaces
    ].filter(Boolean); // Remove undefined values

    let conn = null;
    let lastError = null;

    for (const uri of connectionStrings) {
      try {
        console.log(`🔄 Attempting to connect to MongoDB: ${uri.replace(/\/\/.*@/, '//***@')}`);
        conn = await mongoose.connect(uri, mongoOptions);
        console.log(`📊 MongoDB Connected successfully: ${conn.connection.host}:${conn.connection.port}`);
        break;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️  Failed to connect to ${uri.replace(/\/\/.*@/, '//***@')}: ${error.message}`);
        continue;
      }
    }

    if (!conn) {
      throw lastError || new Error('All MongoDB connection attempts failed');
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful close on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
