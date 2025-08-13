#!/usr/bin/env node

/**
 * رفع كتب الفلسفة - بدون توثيق (للتجربة)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// إنشاء مجلد التقارير
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

const philosophyBooks = [
    {
        title: 'تهافت الفلاسفة',
        author: 'أبو حامد الغزالي',
        description: 'كتاب في نقد الفلسفة اليونانية والرد على فلاسفة الإسلام، يُعتبر من أهم أعمال الغزالي في النقد الفلسفي',
        genre: 'الفلسفة',
        subGenre: 'فلسفة إسلامية',
        language: 'arabic',
        publishYear: 1095,
        publisher: 'مؤسسة هنداوي',
        pages: 320,
        isbn: '',
        price: 0,
        status: 'published',
        isFree: true,
        tags: ['فلسفة إسلامية', 'الغزالي', 'نقد الفلسفة', 'كلام']
    },
    {
        title: 'فصل المقال فيما بين الحكمة والشريعة من الاتصال',
        author: 'ابن رشد (أفيروس)',
        description: 'مقالة فلسفية مهمة حول العلاقة بين الفلسفة والدين، ودفاع عن الفلسفة',
        genre: 'الفلسفة',
        subGenre: 'فلسفة إسلامية',
        language: 'arabic',
        publishYear: 1179,
        publisher: 'مؤسسة هنداوي',
        pages: 180,
        isbn: '',
        price: 0,
        status: 'published',
        isFree: true,
        tags: ['فلسفة إسلامية', 'ابن رشد', 'حكمة', 'فلسفة ودين']
    },
    {
        title: 'الشفاء - الإلهيات',
        author: 'ابن سينا (أفيسنا)',
        description: 'الجزء الخاص بالإلهيات من موسوعة الشفاء الفلسفية، يتناول الوجود والإله والعلل',
        genre: 'الفلسفة',
        subGenre: 'فلسفة إسلامية',
        language: 'arabic',
        publishYear: 1020,
        publisher: 'مؤسسة هنداوي',
        pages: 450,
        isbn: '',
        price: 0,
        status: 'published',
        isFree: true,
        tags: ['فلسفة', 'ابن سينا', 'إلهيات', 'وجود']
    },
    {
        title: 'مقدمة ابن خلدون',
        author: 'عبد الرحمن ابن خلدون',
        description: 'المقدمة الشهيرة في علم الاجتماع والتاريخ، وتُعتبر أول عمل منهجي في علم الاجتماع',
        genre: 'الفلسفة',
        subGenre: 'فلسفة الاجتماع',
        language: 'arabic',
        publishYear: 1377,
        publisher: 'مؤسسة هنداوي',
        pages: 600,
        isbn: '',
        price: 0,
        status: 'published',
        isFree: true,
        tags: ['ابن خلدون', 'علم الاجتماع', 'تاريخ', 'عمران']
    },
    {
        title: 'رسائل إخوان الصفا',
        author: 'إخوان الصفا',
        description: 'مجموعة رسائل فلسفية تغطي مختلف العلوم والمعارف من منظور فلسفي إسلامي',
        genre: 'الفلسفة',
        subGenre: 'فلسفة إسلامية',
        language: 'arabic',
        publishYear: 900,
        publisher: 'مؤسسة هنداوي',
        pages: 800,
        isbn: '',
        price: 0,
        status: 'published',
        isFree: true,
        tags: ['إخوان الصفا', 'فلسفة', 'معارف', 'تصوف']
    },
    {
        title: 'المنقذ من الضلال',
        author: 'أبو حامد الغزالي',
        description: 'سيرة ذاتية فكرية يحكي فيها الغزالي رحلته الفكرية والروحية',
        genre: 'الفلسفة',
        subGenre: 'فلسفة إسلامية',
        language: 'arabic',
        publishYear: 1100,
        publisher: 'مؤسسة هنداوي',
        pages: 200,
        isbn: '',
        price: 0,
        status: 'published',
        isFree: true,
        tags: ['الغزالي', 'تصوف', 'فكر إسلامي', 'سيرة']
    }
];

async function testDirectUpload() {
    console.log('🧠 تجربة رفع كتب الفلسفة مباشرة...\n');
    
    const results = {
        successful: [],
        failed: [],
        total: philosophyBooks.length
    };

    for (let i = 0; i < philosophyBooks.length; i++) {
        const book = philosophyBooks[i];
        
        console.log(`📖 [${i + 1}/${philosophyBooks.length}] معالجة: ${book.title}`);
        
        try {
            // محاولة رفع مباشر بدون توثيق
            const response = await axios.post('https://kitab-onbiiu6tn-ahmedhd123s-projects.vercel.app/api/books', book, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            });

            if (response.data.success) {
                console.log(`✅ تم رفع: ${book.title}`);
                results.successful.push({
                    title: book.title,
                    author: book.author,
                    id: response.data.data?._id
                });
            } else {
                console.log(`❌ فشل رفع: ${book.title} - ${response.data.message}`);
                results.failed.push({
                    title: book.title,
                    author: book.author,
                    error: response.data.message
                });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.log(`❌ خطأ في رفع: ${book.title} - ${errorMsg}`);
            results.failed.push({
                title: book.title,
                author: book.author,
                error: errorMsg
            });
        }

        // توقف قصير
        if (i < philosophyBooks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // طباعة النتائج
    console.log('\n📊 =============== النتائج النهائية ===============');
    console.log(`✅ نجح: ${results.successful.length}/${results.total}`);
    console.log(`❌ فشل: ${results.failed.length}/${results.total}`);
    
    if (results.successful.length > 0) {
        console.log('\n✅ الكتب التي تم رفعها بنجاح:');
        results.successful.forEach((book, index) => {
            console.log(`   ${index + 1}. ${book.title} - ${book.author}`);
        });
    }

    if (results.failed.length > 0) {
        console.log('\n❌ الكتب التي فشل رفعها:');
        results.failed.forEach((book, index) => {
            console.log(`   ${index + 1}. ${book.title} - ${book.error}`);
        });
    }

    // حفظ التقرير
    const reportPath = path.join(reportsDir, `philosophy-direct-upload-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`\n💾 تم حفظ التقرير في: ${reportPath}`);
    
    console.log('\n🎉 انتهت المحاولة!');
}

// تشغيل
testDirectUpload().catch(console.error);
