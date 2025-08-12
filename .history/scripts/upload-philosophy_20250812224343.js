#!/usr/bin/env node

/**
 * رفع كتب الفلسفة للنظام مباشرة
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class PhilosophyUploader {
    constructor() {
        // URL النظام المحلي أو الإنتاج
        this.apiUrl = process.env.KITAB_API_URL || 'https://kitab-onbiiu6tn-ahmedhd123s-projects.vercel.app/api/admin/books';
        this.authUrl = process.env.KITAB_AUTH_URL || 'https://kitab-onbiiu6tn-ahmedhd123s-projects.vercel.app/api/auth';
        this.token = null; // سيتم الحصول عليه من تسجيل الدخول
        
        this.philosophyBooks = [
            {
                title: 'تهافت الفلاسفة',
                author: 'أبو حامد الغزالي',
                description: 'كتاب في نقد الفلسفة اليونانية والرد على فلاسفة الإسلام المتأثرين بأرسطو وأفلاطون. يعتبر من أهم الأعمال في الفكر الإسلامي',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1095',
                isbn: '978-977-416-000-1',
                pages: '320',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة إسلامية', 'الغزالي', 'نقد الفلسفة', 'تراث'],
                status: 'published',
                isFree: true,
                price: '0'
            },
            {
                title: 'فصل المقال فيما بين الحكمة والشريعة من الاتصال',
                author: 'ابن رشد (أفيروس)',
                description: 'مقالة فلسفية مهمة حول العلاقة بين الفلسفة والدين والتوفيق بين العقل والنقل. عمل رائد في التفكير العقلاني',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1179',
                isbn: '978-977-416-001-8',
                pages: '180',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة إسلامية', 'ابن رشد', 'حكمة', 'عقلانية'],
                status: 'published',
                isFree: true,
                price: '0'
            },
            {
                title: 'الشفاء - الإلهيات',
                author: 'ابن سينا (أفيسينا)',
                description: 'الجزء الخاص بالإلهيات من موسوعة الشفاء الفلسفية الشاملة. يتناول مسائل الوجود والعلة الأولى والنفس',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1020',
                isbn: '978-977-416-002-5',
                pages: '450',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة', 'ابن سينا', 'إلهيات', 'وجود'],
                status: 'published',
                isFree: true,
                price: '0'
            },
            {
                title: 'مقدمة ابن خلدون',
                author: 'عبد الرحمن ابن خلدون',
                description: 'عمل رائد في فلسفة التاريخ وعلم الاجتماع وتحليل ظواهر المجتمع والحضارة. يعتبر مؤسس علم الاجتماع',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1377',
                isbn: '978-977-416-003-2',
                pages: '600',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة التاريخ', 'اجتماع', 'ابن خلدون', 'علوم إنسانية'],
                status: 'published',
                isFree: true,
                price: '0'
            },
            {
                title: 'رسائل إخوان الصفا',
                author: 'إخوان الصفا وخلان الوفا',
                description: 'مجموعة رسائل فلسفية وعلمية تغطي مختلف المعارف الفلسفية والعلمية في القرن العاشر الميلادي',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '983',
                isbn: '978-977-416-004-9',
                pages: '800',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة', 'علوم', 'تراث عربي', 'موسوعة'],
                status: 'published',
                isFree: true,
                price: '0'
            },
            {
                title: 'المنقذ من الضلال',
                author: 'أبو حامد الغزالي',
                description: 'سيرة فكرية وروحية للغزالي ورحلته في البحث عن الحقيقة عبر الشك المنهجي والتجربة الصوفية',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1100',
                isbn: '978-977-416-005-6',
                pages: '200',
                publisher: 'مؤسسة هنداوي',
                tags: ['الغزالي', 'سيرة فكرية', 'طريقة الحق', 'شك منهجي'],
                status: 'published',
                isFree: true,
                price: '0'
            }
        ];
    }

    async authenticate() {
        try {
            console.log('🔐 تسجيل دخول المدير...');
            
            const response = await axios.post(this.authUrl, {
                email: 'admin@kitabi.com',
                password: 'admin123'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success && response.data.token) {
                this.token = response.data.token;
                console.log('✅ تم تسجيل الدخول بنجاح');
                return true;
            } else {
                console.log('❌ فشل في تسجيل الدخول');
                return false;
            }
            
        } catch (error) {
            console.log('❌ خطأ في تسجيل الدخول:', error.message);
            return false;
        }
    }

    async uploadBook(book) {
        try {
            console.log(`📤 رفع كتاب: ${book.title}`);
            
            // إنشاء البيانات للإرسال
            const bookData = { ...book };
            
            const response = await axios.post(this.apiUrl, bookData, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            });
            
            if (response.status === 200 && response.data.success) {
                console.log(`✅ تم رفع: ${book.title}`);
                return { success: true, book: book.title, id: response.data.data?._id };
            } else {
                console.log(`❌ فشل في رفع: ${book.title} - Status: ${response.status}`);
                console.log(`Response: ${JSON.stringify(response.data)}`);
                return { success: false, book: book.title, error: response.data };
            }
            
        } catch (error) {
            console.log(`❌ خطأ في رفع: ${book.title} - ${error.message}`);
            return { success: false, book: book.title, error: error.message };
        }
    }

    async uploadAllBooks() {
        console.log('🚀 بدء رفع كتب الفلسفة للنظام...');
        console.log(`📡 API URL: ${this.apiUrl}`);
        console.log(`📚 عدد الكتب: ${this.philosophyBooks.length}`);
        
        const results = [];
        
        for (let i = 0; i < this.philosophyBooks.length; i++) {
            const book = this.philosophyBooks[i];
            
            console.log(`\n📖 معالجة الكتاب ${i + 1}/${this.philosophyBooks.length}`);
            
            const result = await this.uploadBook(book);
            results.push(result);
            
            // توقف مؤقت بين الطلبات
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // تقرير النتائج
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log('\n📊 تقرير الرفع:');
        console.log(`✅ نجح: ${successful} كتاب`);
        console.log(`❌ فشل: ${failed} كتاب`);
        
        if (failed > 0) {
            console.log('\n❌ الكتب التي فشلت:');
            results.filter(r => !r.success).forEach(r => {
                console.log(`- ${r.book}: ${r.error}`);
            });
        }
        
        if (successful > 0) {
            console.log('\n✅ الكتب التي نجحت:');
            results.filter(r => r.success).forEach(r => {
                console.log(`- ${r.book}`);
            });
        }
        
        return results;
    }

    async saveReport(results) {
        const reportDir = path.join(__dirname, 'reports');
        await fs.mkdir(reportDir, { recursive: true });
        
        const reportPath = path.join(reportDir, `philosophy-upload-${Date.now()}.json`);
        
        const report = {
            timestamp: new Date().toISOString(),
            apiUrl: this.apiUrl,
            totalBooks: this.philosophyBooks.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results: results
        };
        
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
        console.log(`📄 تم حفظ التقرير: ${reportPath}`);
        
        return reportPath;
    }

    async run() {
        try {
            const results = await this.uploadAllBooks();
            await this.saveReport(results);
            
            console.log('\n🎉 انتهت عملية رفع كتب الفلسفة!');
            
        } catch (error) {
            console.error('💥 خطأ عام في العملية:', error);
        }
    }
}

// تشغيل الرفع
if (require.main === module) {
    const uploader = new PhilosophyUploader();
    uploader.run().then(() => {
        console.log('✨ تم الانتهاء من رفع كتب الفلسفة');
        process.exit(0);
    }).catch(error => {
        console.error('❌ فشلت عملية الرفع:', error);
        process.exit(1);
    });
}

module.exports = PhilosophyUploader;
