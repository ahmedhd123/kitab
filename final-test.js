// Quick API Test
const backendUrl = 'https://kitab-lrqn488tv-ahmedhd123s-projects.vercel.app';

console.log('🔥 FINAL CONNECTION TEST');
console.log('========================');

async function finalTest() {
  try {
    console.log('\n🌐 Testing:', backendUrl);
    
    const healthRes = await fetch(`${backendUrl}/api/health`);
    console.log('Health status:', healthRes.status);
    
    if (healthRes.status === 401) {
      console.log('❌ Still protected by Vercel auth');
      console.log('📋 The project appears to be in a protected Vercel workspace');
      console.log('💡 Solution: Deploy to a public Vercel account or different platform');
      return;
    }
    
    if (healthRes.ok) {
      const data = await healthRes.json();
      console.log('✅ BACKEND IS ACCESSIBLE!');
      console.log('Health data:', data);
      
      // Test login
      const loginRes = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@kitabi.com',
          password: 'admin123'
        })
      });
      
      console.log('Login status:', loginRes.status);
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        console.log('🎉 AUTHENTICATION WORKING!');
        console.log('User:', loginData.user?.email);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

finalTest();
