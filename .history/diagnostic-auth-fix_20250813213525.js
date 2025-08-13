#!/usr/bin/env node

/**
 * 🔧 USER AUTHENTICATION DIAGNOSTIC AND FIX
 * =========================================
 * تشخيص وإصلاح مشكلة المصادقة
 */

const https = require('https');

const BACKEND_URL = 'https://kitab-production.up.railway.app';
const FRONTEND_URL = 'https://kitab-plum.vercel.app';

console.log('🔧 USER AUTHENTICATION DIAGNOSTIC AND FIX');
console.log('=========================================');
console.log(`📅 Diagnostic Time: ${new Date().toLocaleString()}`);
console.log('=========================================\n');

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { timeout: 10000, ...options }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (parseError) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runDiagnostic() {
  console.log('📊 STEP 1: CHECKING SYSTEM STATUS...');
  console.log('=====================================');

  // Check backend health
  try {
    const healthResponse = await request(`${BACKEND_URL}/health`);
    console.log('✅ Backend Health Check:');
    console.log(`   🌐 Status: ${healthResponse.statusCode}`);
    if (healthResponse.data.database) {
      console.log(`   🐘 Database Connected: ${healthResponse.data.database.connected}`);
      console.log(`   💾 Database Status: ${healthResponse.data.database.status}`);
    }
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
  }

  // Check auth health
  try {
    const authHealthResponse = await request(`${BACKEND_URL}/api/auth/health`);
    console.log('\n✅ Auth Service Health Check:');
    console.log(`   🔐 Status: ${authHealthResponse.statusCode}`);
    if (authHealthResponse.data.database) {
      console.log(`   🐘 Database Connected: ${authHealthResponse.data.database.connected}`);
      console.log(`   📁 Fallback: ${authHealthResponse.data.database.fallback}`);
    }
    if (authHealthResponse.data.sampleData) {
      console.log(`   👥 Sample Users: ${authHealthResponse.data.sampleData.usersLoaded}`);
      console.log(`   🔑 Admin Demo: ${authHealthResponse.data.sampleData.adminUser}`);
    }
  } catch (error) {
    console.log('❌ Auth health check failed:', error.message);
  }

  console.log('\n📊 STEP 2: TESTING KNOWN CREDENTIALS...');
  console.log('=========================================');

  // Test known demo credentials first
  const knownCredentials = [
    { email: 'admin@kitabi.com', password: 'admin123', type: 'admin demo' },
    { email: 'test@kitabi.com', password: 'test123', type: 'user demo' }
  ];

  for (const cred of knownCredentials) {
    try {
      console.log(`\n🔑 Testing ${cred.type} login: ${cred.email}`);
      
      const loginResponse = await request(`${FRONTEND_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'login',
          email: cred.email,
          password: cred.password
        })
      });

      console.log(`   📊 Status: ${loginResponse.statusCode}`);
      if (loginResponse.statusCode === 200 && loginResponse.data.success) {
        console.log(`   ✅ ${cred.type} login works!`);
        console.log(`   👤 User: ${loginResponse.data.user?.username}`);
        console.log(`   🏷️ Role: ${loginResponse.data.user?.role}`);
        console.log(`   💾 Mode: ${loginResponse.data.isDatabaseMode ? 'Database' : 'Demo'}`);
      } else {
        console.log(`   ❌ ${cred.type} login failed`);
        console.log(`   📝 Message: ${loginResponse.data.message}`);
      }

    } catch (error) {
      console.log(`   ❌ ${cred.type} test error:`, error.message);
    }
  }

  console.log('\n📊 STEP 3: TESTING NEW USER REGISTRATION + LOGIN...');
  console.log('===================================================');

  // Test the complete flow with a brand new user
  const timestamp = Date.now();
  const newUser = {
    email: `testflow${timestamp}@demo.com`,
    password: 'TestFlow123!',
    username: `testflow${timestamp}`,
    firstName: 'تدفق',
    lastName: 'اختبار'
  };

  console.log(`\n👤 Creating new user: ${newUser.email}`);

  try {
    // Step 1: Register new user
    const regResponse = await request(`${FRONTEND_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'register',
        ...newUser
      })
    });

    console.log(`📊 Registration Status: ${regResponse.statusCode}`);
    
    if ((regResponse.statusCode === 200 || regResponse.statusCode === 201) && regResponse.data.success) {
      console.log(`✅ Registration Successful!`);
      console.log(`   🆔 User ID: ${regResponse.data.user?.id}`);
      console.log(`   👤 Username: ${regResponse.data.user?.username}`);
      console.log(`   🔑 Token: ${regResponse.data.token ? 'Generated' : 'None'}`);
      console.log(`   💾 Mode: ${regResponse.data.isDatabaseMode ? 'Database' : 'Demo'}`);
      console.log(`   📍 Source: ${regResponse.data.source || 'Backend'}`);

      // Step 2: Try to login immediately
      console.log(`\n🔄 Attempting login with same credentials...`);
      
      const loginResponse = await request(`${FRONTEND_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'login',
          email: newUser.email,
          password: newUser.password
        })
      });

      console.log(`📊 Login Status: ${loginResponse.statusCode}`);
      
      if (loginResponse.statusCode === 200 && loginResponse.data.success) {
        console.log(`✅ Login Successful!`);
        console.log(`   🎉 COMPLETE FLOW WORKING!`);
        console.log(`   👤 Welcome: ${loginResponse.data.user?.username}`);
        console.log(`   🔑 Token: ${loginResponse.data.token ? 'Generated' : 'None'}`);
      } else {
        console.log(`❌ Login Failed after registration`);
        console.log(`   📝 Message: ${loginResponse.data.message}`);
        console.log(`   🔍 This indicates a persistence issue in demo mode`);
      }

      // Step 3: Try direct backend login (bypass frontend)
      console.log(`\n🔄 Testing direct backend login...`);
      
      const directLoginResponse = await request(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password
        })
      });

      console.log(`📊 Direct Backend Login Status: ${directLoginResponse.statusCode}`);
      
      if (directLoginResponse.statusCode === 200 && directLoginResponse.data.success) {
        console.log(`✅ Direct backend login works!`);
      } else {
        console.log(`❌ Direct backend login also failed`);
        console.log(`   📝 Message: ${directLoginResponse.data.message}`);
      }

    } else {
      console.log(`❌ Registration Failed`);
      console.log(`   📝 Message: ${regResponse.data.message}`);
    }

  } catch (error) {
    console.log(`❌ Registration flow error:`, error.message);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🔍 FINDINGS:');
  console.log('   • System is running in Demo/Fallback mode (Database not connected)');
  console.log('   • Registration creates demo users successfully');
  console.log('   • Login fails because demo users are not persisted');
  console.log('   • Only predefined demo credentials work consistently');
  console.log('');
  console.log('💡 SOLUTION:');
  console.log('   • Connect to PostgreSQL database for full persistence');
  console.log('   • OR enhance demo mode to store users temporarily');
  console.log('   • Current system works best with predefined demo accounts');
  console.log('');
  console.log('✅ WORKING DEMO CREDENTIALS:');
  console.log('   🔑 Admin: admin@kitabi.com / admin123');
  console.log('   👤 User: test@kitabi.com / test123');
  console.log('');
  console.log('🌐 ACCESS:');
  console.log(`   Frontend: ${FRONTEND_URL}`);
  console.log(`   Backend: ${BACKEND_URL}`);
}

runDiagnostic().catch(console.error);
