// اختبار سريع لاستيراد بيانات هنداوي
const axios = require('axios');

async function quickHindawiTest() {
    try {
        console.log('🔍 جاري اختبار الاتصال بموقع هنداوي...');
        
        // Test basic connection to Hindawi
        const response = await axios.get('https://www.hindawi.org/books/browse/', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log('✅ تم الاتصال بنجاح!');
        console.log(`Response status: ${response.status}`);
        
        // Test our local API
        console.log('\n🔧 جاري اختبار API المحلي...');
        
        // Create a mock book for testing
        const mockBook = {
            title: 'كتاب تجريبي من هنداوي',
            author: 'مؤسسة هنداوي',
            description: 'هذا كتاب تجريبي لاختبار النظام',
            genre: 'تراث',
            language: 'ar',
            isbn: '978-1234567890',
            publishedDate: '2024-01-01',
            pages: 200,
            tags: ['تراث', 'أدب عربي'],
            source: 'hindawi.org'
        };
        
        // Test adding book via API
        const apiResponse = await axios.post('https://kitab-70hznvmwa-ahmedhd123s-projects.vercel.app/api/admin/books', mockBook, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ تم إضافة الكتاب التجريبي بنجاح!');
        console.log('📖 معرف الكتاب:', apiResponse.data.id);
        
        return {
            hindawiConnection: true,
            apiWorking: true,
            bookId: apiResponse.data.id
        };
        
    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
        return {
            hindawiConnection: false,
            apiWorking: false,
            error: error.message
        };
    }
}

// Run the test if called directly
if (require.main === module) {
    quickHindawiTest().then(result => {
        console.log('\n📊 نتائج الاختبار:');
        console.log(JSON.stringify(result, null, 2));
    });
}

module.exports = { quickHindawiTest };
