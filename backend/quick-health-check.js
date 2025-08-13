// Quick health check
async function quickHealthCheck() {
    const fetch = (await import('node-fetch')).default;
    
    try {
        const response = await fetch('https://kitab-production.up.railway.app/health');
        const data = await response.json();
        console.log('🏥 Health Check:', JSON.stringify(data, null, 2));
        
        // Also check the logs endpoint if it exists
        try {
            const logsResponse = await fetch('https://kitab-production.up.railway.app/api');
            const logsData = await logsResponse.json();
            console.log('\n📊 API Status:', JSON.stringify(logsData, null, 2));
        } catch (e) {
            console.log('📊 API check failed:', e.message);
        }
        
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
    }
}

quickHealthCheck();
