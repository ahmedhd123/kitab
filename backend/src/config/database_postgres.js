/**
 * 🐘 POSTGRESQL DATABASE CONFIGURATION FOR RAILWAY
 * ============================================== 
 * Connects to Railway PostgreSQL database instead of MongoDB
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway PostgreSQL Configuration
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
const DB_PORT = process.env.POSTGRES_PORT || 5432;
const DB_NAME = process.env.POSTGRES_DB || 'kitabi_db';
const DB_USER = process.env.POSTGRES_USER || 'postgres';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || '';

console.log('🔗 Configuring PostgreSQL Connection...');
console.log(`📍 Host: ${DB_HOST}:${DB_PORT}`);
console.log(`🗃️  Database: ${DB_NAME}`);
console.log(`👤 User: ${DB_USER}`);

// Create Sequelize instance
let sequelize;

if (DATABASE_URL) {
  // Use Railway DATABASE_URL (production)
  console.log('🚂 Using Railway DATABASE_URL');
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Use individual connection parameters (development)
  console.log('🔧 Using individual connection parameters');
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

// Test connection function
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    return false;
  }
}

// Initialize database and create tables
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing PostgreSQL database...');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to PostgreSQL');
    }
    
    // Import and sync models
    const { User, Book, Review } = require('../models/postgres');
    
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ 
      force: false, // Set to true to recreate tables (WARNING: deletes data)
      alter: true   // Update tables to match model definitions
    });
    
    console.log('✅ Database synchronized successfully');
    
    // Check if we have any data
    const userCount = await User.count();
    const bookCount = await Book.count();
    const reviewCount = await Review.count();
    
    console.log(`📊 Database Status:`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📚 Books: ${bookCount}`);
    console.log(`   ⭐ Reviews: ${reviewCount}`);
    
    if (userCount === 0) {
      console.log('🌱 Database appears to be empty. Consider running seed scripts.');
    }
    
    return { sequelize, models: { User, Book, Review } };
    
  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    throw error;
  }
}

// Graceful shutdown
async function closeConnection() {
  try {
    await sequelize.close();
    console.log('🔌 PostgreSQL connection closed');
  } catch (error) {
    console.error('Error closing PostgreSQL connection:', error);
  }
}

// Handle process termination
process.on('SIGTERM', closeConnection);
process.on('SIGINT', closeConnection);

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase,
  closeConnection,
  // Database info for debugging
  config: {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    hasUrl: !!DATABASE_URL
  }
};
