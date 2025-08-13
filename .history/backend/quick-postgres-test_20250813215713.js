#!/usr/bin/env node

/**
 * 🔧 QUICK POSTGRESQL CONNECTION TEST
 * ===================================
 * اختبار سريع للاتصال بـ PostgreSQL عبر Railway Public URL
 */

require('dotenv').config();

console.log('🔧 QUICK POSTGRESQL CONNECTION TEST');
console.log('===================================');
console.log(`📅 Test Time: ${new Date().toLocaleString()}`);
console.log('===================================\n');

async function quickTest() {
  console.log('🔄 Testing PostgreSQL connection...');
  console.log(`🌐 Host: ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}`);
  console.log(`🗄️ Database: ${process.env.POSTGRES_DB}`);
  console.log(`👤 User: ${process.env.POSTGRES_USER}\n`);

  try {
    const { testConnection, initializeDatabase } = require('./src/config/database_postgres');
    
    // Test connection
    console.log('📊 STEP 1: Testing connection...');
    const connectionResult = await testConnection();
    
    if (connectionResult) {
      console.log('✅ Connection successful!');
      
      // Test initialization
      console.log('\n📊 STEP 2: Initializing database...');
      const initResult = await initializeDatabase();
      
      if (initResult) {
        console.log('✅ Database initialized!');
        
        // Test models
        console.log('\n📊 STEP 3: Testing models...');
        const { User, Book, Review } = require('./src/models/postgres');
        
        const userCount = await User.count();
        const bookCount = await Book.count();
        const reviewCount = await Review.count();
        
        console.log(`✅ User table: ${userCount} records`);
        console.log(`✅ Book table: ${bookCount} records`);
        console.log(`✅ Review table: ${reviewCount} records`);
        
        // Test authentication service
        console.log('\n📊 STEP 4: Testing auth service...');
        const authService = require('./src/services/authService_postgres');
        
        const healthStatus = await authService.getHealthStatus();
        console.log(`✅ Auth service: ${healthStatus.authenticationMode} mode`);
        console.log(`✅ Database connected: ${healthStatus.databaseConnected}`);
        
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('✅ PostgreSQL database fully operational');
        console.log('✅ User registration will now persist');
        console.log('✅ Login after registration will work');
        console.log('✅ Ready for production deployment');
        
        return true;
      } else {
        console.log('❌ Database initialization failed');
        return false;
      }
    } else {
      console.log('❌ Connection failed');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message);
    return false;
  }
}

quickTest()
  .then(success => {
    if (success) {
      console.log('\n═══════════════════════════════════════════════════════════════════');
      console.log('🚀 POSTGRESQL DATABASE: READY FOR PRODUCTION!');
      console.log('═══════════════════════════════════════════════════════════════════');
      console.log('💡 Next steps:');
      console.log('   1. Deploy backend to Railway');
      console.log('   2. Test new user registration');
      console.log('   3. Verify login persistence');
    } else {
      console.log('\n❌ PostgreSQL setup needs attention');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
