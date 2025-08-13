#!/usr/bin/env node

/**
 * رفع كتب الفلسفة للنظام - نسخة مبسطة
 */

const axios = require('axios');

class SimplePhilosophyUploader {
    constructor() {
        this.apiUrl = 'https://kitab-onbiiu6tn-ahmedhd123s-projects.vercel.app/api/admin/books';
        
        this.philosophyBooks = [
            {
                title: 'تهافت الفلاسفة',
                author: 'أبو حامد الغزالي',
                description: 'كتاب في نقد الفلسفة اليونانية والرد على فلاسفة الإسلام',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1095',
                publisher: 'مؤسسة هنداوي',
                tags: JSON.stringify(['فلسفة إسلامية', 'الغزالي', 'نقد']),
                status: 'published',
                isFree: 'true',
                price: '0'
            },
            {
                title: 'فصل المقال فيما بين الحكمة والشريعة من الاتصال',
                author: 'ابن رشد',
                description: 'مقالة فلسفية مهمة حول العلاقة بين الفلسفة والدين',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1179',
                publisher: 'مؤسسة هنداوي',
                tags: JSON.stringify(['فلسفة إسلامية', 'ابن رشد', 'حكمة']),
                status: 'published',
                isFree: 'true',
                price: '0'
            },
            {
                title: 'الشفاء - الإلهيات',
                author: 'ابن سينا',
                description: 'الجزء الخاص بالإلهيات من موسوعة الشفاء الفلسفية',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1020',
                publisher: 'مؤسسة هنداوي',
                tags: JSON.stringify(['فلسفة', 'ابن سينا', 'إلهيات']),
                status: 'published',
                isFree: 'true',
                price: '0'
            }
        ];
    }

    async uploadBook(book) {
        try {
            console.log(`📤 رفع: ${book.title}`);
            
            // إنشاء FormData
            const FormData = require('form-data');
            const formData = new FormData();
            
            // إضافة البيانات
            Object.keys(book).forEach(key => {
                formData.append(key, book[key]);
            });
            
            const response = await axios.post(this.apiUrl, formData, {
                headers: {
                    'Authorization': 'Bearer admin-token',
                    ...formData.getHeaders()
                },
                timeout: 30000
            });
            
            if (response.data.success) {
                console.log(`✅ تم: ${book.title}`);
                return true;
            } else {
                console.log(`❌ فشل: ${book.title}`);
                return false;
            }
            
        } catch (error) {
            console.log(`❌ خطأ: ${book.title} - ${error.response?.status || error.message}`);
            return false;
        }
    }

    async run() {
        console.log('🧠 بدء رفع كتب الفلسفة...');
        
        let success = 0;
        
        for (const book of this.philosophyBooks) {
            const result = await this.uploadBook(book);
            if (result) success++;
            
            // توقف مؤقت
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        console.log(`\n📊 النتائج: ${success}/${this.philosophyBooks.length} نجح`);
    }
}

// تشغيل
const uploader = new SimplePhilosophyUploader();
uploader.run();
