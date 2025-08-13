// Debug Admin Login Issue
const backendUrl = 'https://kitab-epyukmnjn-ahmedhd123s-projects.vercel.app';
const frontendUrl = 'https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app';

console.log('🔍 Debugging Admin Login Issue');
console.log('================================');

async function debugLogin() {
  try {
    console.log('\n1. Testing backend connectivity...');
    const healthRes = await fetch(`${backendUrl}/api/health`);
    console.log('Health status:', healthRes.status);
    
    if (healthRes.ok) {
      const healthData = await healthRes.json();
      console.log('✅ Backend health:', healthData);
    }

    console.log('\n2. Testing authentication endpoint availability...');
    const authTestRes = await fetch(`${backendUrl}/api/test-auth`, {
      headers: { 'Origin': frontendUrl }
    });
    console.log('Auth test status:', authTestRes.status);
    
    if (authTestRes.ok) {
      const authTestData = await authTestRes.json();
      console.log('✅ Auth endpoint available:', authTestData);
    }

    console.log('\n3. Attempting admin login with detailed logging...');
    const loginRes = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': frontendUrl,
        'User-Agent': 'Debug-Script/1.0'
      },
      body: JSON.stringify({
        email: 'admin@kitabi.com',
        password: 'admin123'
      })
    });

    console.log('Login response status:', loginRes.status);
    console.log('Login response headers:', Object.fromEntries(loginRes.headers));
    
    const responseText = await loginRes.text();
    console.log('Login response body:', responseText);
    
    if (loginRes.ok) {
      try {
        const loginData = JSON.parse(responseText);
        console.log('✅ Login successful:', {
          user: loginData.user?.email,
          role: loginData.user?.role,
          hasToken: !!loginData.token
        });
      } catch (e) {
        console.log('⚠️ Response is not JSON:', responseText);
      }
    } else {
      console.log('❌ Login failed with status:', loginRes.status);
      console.log('Error response:', responseText);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugLogin();
