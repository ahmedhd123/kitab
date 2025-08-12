const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support multiple MongoDB connection options
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // Increase timeout for Atlas
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // Atlas specific settings
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5,  // Maintain minimum 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };

    // Try multiple connection strings in order of preference
    const connectionStrings = [
      process.env.MONGODB_URI, // Environment variable (Atlas - highest priority)
      process.env.MONGODB_LOCAL_URI, // Local MongoDB
      'mongodb://127.0.0.1:27017/kitabi', // Local IPv4
      'mongodb://localhost:27017/kitabi', // Local hostname
    ].filter(Boolean); // Remove undefined values

    let conn = null;
    let lastError = null;

    for (const uri of connectionStrings) {
      try {
        const isAtlas = uri.includes('mongodb+srv://');
        const displayUri = uri.replace(/\/\/.*@/, '//***@'); // Hide credentials in logs
        
        console.log(`🔄 Attempting to connect to ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}: ${displayUri}`);
        
        conn = await mongoose.connect(uri, mongoOptions);
        
        const dbName = conn.connection.db.databaseName;
        const host = isAtlas ? 'MongoDB Atlas' : `${conn.connection.host}:${conn.connection.port}`;
        
        console.log(`📊 MongoDB Connected successfully:`);
        console.log(`   🌐 Host: ${host}`);
        console.log(`   🗄️  Database: ${dbName}`);
        console.log(`   📡 Connection type: ${isAtlas ? 'Cloud (Atlas)' : 'Local'}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
          console.log('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
          console.log('🔄 MongoDB reconnected');
        });
        
        return conn;
      } catch (error) {
        lastError = error;
        const displayUri = uri.replace(/\/\/.*@/, '//***@');
        console.warn(`⚠️  Failed to connect to ${displayUri}: ${error.message}`);
        continue;
      }
    }

    // If we get here, all connections failed
    console.error('❌ All MongoDB connection attempts failed');
    if (lastError) {
      console.error('   Last error:', lastError.message);
    }
    console.log('📚 Server will continue without database - sample books will still work');
    return null;
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('📚 Server will continue without database - sample books will still work');
    return null;
  }
};

// Graceful close on app termination
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
  process.exit(0);
});

module.exports = connectDB;
