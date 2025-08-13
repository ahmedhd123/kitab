#!/usr/bin/env node

/**
 * 🔍 DEBUG POSTGRESQL AUTH ISSUE
 * ==============================
 * تصحيح مشكلة المصادقة مع PostgreSQL
 */

require('dotenv').config();

console.log('🔍 DEBUG POSTGRESQL AUTH ISSUE');
console.log('==============================');
console.log(`📅 Test Time: ${new Date().toLocaleString()}`);
console.log('==============================\n');

async function debugAuthIssue() {
  try {
    const authService = require('./src/services/authService_postgres');
    const encryptionUtils = require('./src/utils/encryption');
    
    console.log('📊 STEP 1: TESTING PASSWORD ENCRYPTION...');
    console.log('==========================================');
    
    const testPassword = 'TestPassword123!';
    console.log(`🔒 Original Password: ${testPassword}`);
    
    // Test encryption
    const hashedPassword = await encryptionUtils.hashPassword(testPassword);
    console.log(`🔐 Hashed Password: ${hashedPassword}`);
    
    // Test comparison
    const isMatch = await encryptionUtils.comparePassword(testPassword, hashedPassword);
    console.log(`✅ Password Match: ${isMatch}`);
    
    if (!isMatch) {
      console.log('❌ Password encryption/comparison issue detected');
      return false;
    }

    console.log('\n📊 STEP 2: TESTING DIRECT DATABASE REGISTRATION...');
    console.log('==================================================');
    
    const { User } = require('./src/models/postgres');
    
    // Test user data
    const testUser = {
      email: `debugtest${Date.now()}@test.com`,
      password: testPassword,
      username: `debuguser${Date.now()}`,
      firstName: 'Debug',
      lastName: 'User'
    };

    console.log(`👤 Test User: ${testUser.email}`);
    
    // Manual registration process
    console.log('🔄 Hashing password...');
    const dbHashedPassword = await encryptionUtils.hashPassword(testUser.password);
    console.log(`🔐 DB Hashed: ${dbHashedPassword.substring(0, 20)}...`);
    
    console.log('🔄 Creating user in database...');
    const dbUser = await User.create({
      email: testUser.email,
      password: dbHashedPassword,
      username: testUser.username,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      role: 'user',
      isAdmin: false,
      favoriteGenres: [],
      isActive: true,
      preferences: {}
    });
    
    console.log(`✅ User created with ID: ${dbUser.id}`);

    console.log('\n📊 STEP 3: TESTING DIRECT DATABASE LOGIN...');
    console.log('=============================================');
    
    // Find user
    console.log('🔄 Finding user in database...');
    const foundUser = await User.findOne({ 
      where: { email: testUser.email } 
    });
    
    if (!foundUser) {
      console.log('❌ User not found in database');
      return false;
    }
    
    console.log(`✅ User found: ${foundUser.email}`);
    console.log(`🔐 Stored hash: ${foundUser.password.substring(0, 20)}...`);
    
    // Test password comparison
    console.log('🔄 Comparing passwords...');
    const passwordMatch = await encryptionUtils.comparePassword(testUser.password, foundUser.password);
    console.log(`✅ Password comparison result: ${passwordMatch}`);
    
    if (!passwordMatch) {
      console.log('❌ Password comparison failed!');
      
      // Debug password details
      console.log('\n🔍 DEBUGGING PASSWORD ISSUE:');
      console.log(`   Original: "${testUser.password}"`);
      console.log(`   Length: ${testUser.password.length}`);
      console.log(`   Hash: ${foundUser.password}`);
      console.log(`   Hash length: ${foundUser.password.length}`);
      
      // Try direct bcrypt comparison
      const bcrypt = require('bcryptjs');
      const directMatch = await bcrypt.compare(testUser.password, foundUser.password);
      console.log(`   Direct bcrypt: ${directMatch}`);
      
      return false;
    }

    console.log('\n📊 STEP 4: TESTING AUTH SERVICE...');
    console.log('===================================');
    
    // Test registration via auth service
    console.log('🔄 Testing auth service registration...');
    try {
      const regResult = await authService.register({
        email: `authservice${Date.now()}@test.com`,
        password: testPassword,
        username: `authuser${Date.now()}`,
        firstName: 'Auth',
        lastName: 'Service'
      });
      
      if (regResult.success) {
        console.log('✅ Auth service registration successful');
        
        // Test login immediately
        console.log('🔄 Testing immediate login...');
        const loginResult = await authService.login({
          email: regResult.user.email,
          password: testPassword
        });
        
        if (loginResult.success) {
          console.log('✅ Immediate login successful!');
          console.log('🎉 AUTH SERVICE WORKING CORRECTLY');
        } else {
          console.log('❌ Immediate login failed');
          console.log(`   Error: ${loginResult.message}`);
        }
      } else {
        console.log('❌ Auth service registration failed');
      }
    } catch (authError) {
      console.log('❌ Auth service error:', authError.message);
    }

    return true;

  } catch (error) {
    console.log('❌ Debug error:', error.message);
    console.log('📝 Stack:', error.stack);
    return false;
  }
}

async function runDebug() {
  try {
    console.log('🔄 Starting authentication debug...\n');
    
    const success = await debugAuthIssue();
    
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('📊 DEBUG SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════════');
    
    if (success) {
      console.log('✅ All debug tests passed');
      console.log('💡 Authentication should be working');
    } else {
      console.log('❌ Issues found in authentication system');
      console.log('💡 Review the error messages above');
    }

    // Close database connection
    const { sequelize } = require('./src/config/database_postgres');
    await sequelize.close();
    console.log('\n🔒 Database connection closed');

  } catch (error) {
    console.error('💥 Debug failed:', error.message);
  }
}

runDebug().catch(console.error);
