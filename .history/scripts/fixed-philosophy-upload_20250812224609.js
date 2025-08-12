#!/usr/bin/env node

/**
 * رفع كتب الفلسفة - مع توثيق صحيح
 */

const axios = require('axios');

class PhilosophyBookUploader {
    constructor() {
        this.baseUrl = 'https://kitab-onbiiu6tn-ahmedhd123s-projects.vercel.app';
        this.token = null;
        
        this.philosophyBooks = [
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
                tags: ['فلسفة إسلامية', 'الغزالي', 'نقد الفلسفة', 'كلام'],
                metadata: {
                    source: 'hindawi.org',
                    category: 'philosophy',
                    difficulty: 'advanced'
                }
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
                tags: ['فلسفة إسلامية', 'ابن رشد', 'حكمة', 'فلسفة ودين'],
                metadata: {
                    source: 'hindawi.org',
                    category: 'philosophy',
                    difficulty: 'intermediate'
                }
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
                tags: ['فلسفة', 'ابن سينا', 'إلهيات', 'وجود'],
                metadata: {
                    source: 'hindawi.org',
                    category: 'philosophy',
                    difficulty: 'advanced'
                }
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
                tags: ['ابن خلدون', 'علم الاجتماع', 'تاريخ', 'عمران'],
                metadata: {
                    source: 'hindawi.org',
                    category: 'philosophy',
                    difficulty: 'intermediate'
                }
            }
        ];
    }

    async loginAsAdmin() {
        try {
            console.log('🔐 محاولة تسجيل دخول كمدير...');
            
            const response = await axios.post(`${this.baseUrl}/api/auth`, {
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
                console.log('❌ فشل تسجيل الدخول:', response.data.message);
                return false;
            }
        } catch (error) {
            console.log('❌ خطأ في تسجيل الدخول:', error.response?.data?.message || error.message);
            return false;
        }
    }

    async uploadBook(book) {
        try {
            console.log(`📤 رفع: ${book.title}`);
            
            const response = await axios.post(`${this.baseUrl}/api/admin/books`, book, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            });

            if (response.data.success) {
                console.log(`✅ تم رفع: ${book.title}`);
                return { success: true, data: response.data };
            } else {
                console.log(`❌ فشل رفع: ${book.title} - ${response.data.message}`);
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.log(`❌ خطأ في رفع: ${book.title} - ${errorMsg}`);
            return { success: false, error: errorMsg };
        }
    }

    async uploadAllBooks() {
        console.log('📚 بدء رفع كتب الفلسفة...\n');
        
        // تسجيل دخول أولاً
        const loginSuccess = await this.loginAsAdmin();
        if (!loginSuccess) {
            console.log('❌ لا يمكن المتابعة بدون تسجيل دخول');
            return;
        }

        const results = {
            successful: [],
            failed: [],
            total: this.philosophyBooks.length
        };

        for (let i = 0; i < this.philosophyBooks.length; i++) {
            const book = this.philosophyBooks[i];
            
            console.log(`\n📖 [${i + 1}/${this.philosophyBooks.length}] معالجة: ${book.title}`);
            
            const result = await this.uploadBook(book);
            
            if (result.success) {
                results.successful.push({
                    title: book.title,
                    author: book.author,
                    id: result.data?.data?._id
                });
            } else {
                results.failed.push({
                    title: book.title,
                    author: book.author,
                    error: result.error
                });
            }

            // توقف قصير بين الكتب
            if (i < this.philosophyBooks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // طباعة النتائج النهائية
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
        const reportPath = `F:/kitab/scripts/reports/philosophy-upload-${Date.now()}.json`;
        const fs = require('fs');
        const path = require('path');
        
        // إنشاء مجلد التقارير إذا لم يكن موجوداً
        const reportsDir = path.dirname(reportPath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
        console.log(`\n💾 تم حفظ التقرير في: ${reportPath}`);
        
        console.log('\n🎉 انتهت عملية رفع كتب الفلسفة!');
    }
}

// تشغيل الرفع
if (require.main === module) {
    const uploader = new PhilosophyBookUploader();
    uploader.uploadAllBooks().catch(console.error);
}

module.exports = PhilosophyBookUploader;
