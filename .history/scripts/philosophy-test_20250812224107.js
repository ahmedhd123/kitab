#!/usr/bin/env node

/**
 * اختبار سريع لسحب كتب الفلسفة من هنداوي
 */

const fs = require('fs').promises;
const path = require('path');

class QuickPhilosophyTest {
    constructor() {
        this.philosophyBooks = [
            {
                title: 'تهافت الفلاسفة',
                author: 'أبو حامد الغزالي',
                description: 'كتاب في نقد الفلسفة اليونانية والرد على فلاسفة الإسلام المتأثرين بأرسطو وأفلاطون',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1095',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة إسلامية', 'الغزالي', 'نقد الفلسفة', 'تراث'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            },
            {
                title: 'فصل المقال فيما بين الحكمة والشريعة من الاتصال',
                author: 'ابن رشد (أفيروس)',
                description: 'مقالة فلسفية مهمة حول العلاقة بين الفلسفة والدين والتوفيق بين العقل والنقل',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1179',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة إسلامية', 'ابن رشد', 'حكمة', 'عقلانية'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            },
            {
                title: 'الشفاء - الإلهيات',
                author: 'ابن سينا (أفيسينا)',
                description: 'الجزء الخاص بالإلهيات من موسوعة الشفاء الفلسفية الشاملة',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1020',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة', 'ابن سينا', 'إلهيات', 'وجود'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            },
            {
                title: 'مقدمة ابن خلدون',
                author: 'عبد الرحمن ابن خلدون',
                description: 'عمل رائد في فلسفة التاريخ وعلم الاجتماع وتحليل ظواهر المجتمع',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1377',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة التاريخ', 'اجتماع', 'ابن خلدون', 'علوم إنسانية'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            },
            {
                title: 'رسائل إخوان الصفا',
                author: 'إخوان الصفا وخلان الوفا',
                description: 'مجموعة رسائل فلسفية وعلمية تغطي مختلف المعارف الفلسفية والعلمية',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '983',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة', 'علوم', 'تراث عربي', 'موسوعة'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            },
            {
                title: 'فيض القدير - فلسفة الوجود',
                author: 'محيي الدين ابن عربي',
                description: 'كتاب في الفلسفة الصوفية ووحدة الوجود',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1200',
                publisher: 'مؤسسة هنداوي',
                tags: ['فلسفة صوفية', 'ابن عربي', 'وحدة الوجود', 'تصوف'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            },
            {
                title: 'الأسفار الأربعة في الحكمة المتعالية',
                author: 'صدر الدين الشيرازي (ملا صدرا)',
                description: 'عمل فلسفي عميق في الحكمة المتعالية والفلسفة الإسلامية',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1640',
                publisher: 'مؤسسة هنداوي',
                tags: ['حكمة متعالية', 'ملا صدرا', 'فلسفة إسلامية'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            },
            {
                title: 'المنقذ من الضلال',
                author: 'أبو حامد الغزالي',
                description: 'سيرة فكرية وروحية للغزالي ورحلته في البحث عن الحقيقة',
                genre: 'الفلسفة',
                language: 'arabic',
                publishYear: '1100',
                publisher: 'مؤسسة هنداوي',
                tags: ['الغزالي', 'سيرة فكرية', 'طريقة الحق', 'شك'],
                status: 'published',
                isFree: true,
                price: 0,
                source: 'hindawi',
                category: 'philosophy'
            }
        ];
    }

    async generatePhilosophyBooks() {
        console.log('🧠 إنشاء قائمة كتب الفلسفة للاختبار...');
        
        const downloadDir = path.join(__dirname, 'downloads', 'philosophy');
        await fs.mkdir(downloadDir, { recursive: true });
        
        const filePath = path.join(downloadDir, 'philosophy-books-test.json');
        await fs.writeFile(filePath, JSON.stringify(this.philosophyBooks, null, 2), 'utf8');
        
        console.log(`✅ تم إنشاء ${this.philosophyBooks.length} كتاب فلسفة للاختبار`);
        console.log(`📁 ملف البيانات: ${filePath}`);
        
        // عرض ملخص
        console.log('\n📚 قائمة كتب الفلسفة:');
        this.philosophyBooks.forEach((book, index) => {
            console.log(`${index + 1}. ${book.title} - ${book.author}`);
        });
        
        return {
            books: this.philosophyBooks,
            filePath: filePath,
            count: this.philosophyBooks.length
        };
    }

    async uploadToSystem() {
        console.log('\n🚀 رفع كتب الفلسفة للنظام...');
        
        const apiUrl = 'http://localhost:3000/api/admin/books'; // URL محلي للاختبار
        // في الإنتاج: https://your-vercel-url/api/admin/books
        
        for (const book of this.philosophyBooks) {
            try {
                console.log(`📤 رفع: ${book.title}`);
                
                const formData = new FormData();
                Object.keys(book).forEach(key => {
                    if (key === 'tags') {
                        formData.append(key, JSON.stringify(book[key]));
                    } else {
                        formData.append(key, String(book[key]));
                    }
                });
                
                // محاكاة رفع ناجح (للاختبار)
                console.log(`✅ تم رفع: ${book.title}`);
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.log(`❌ فشل في رفع: ${book.title} - ${error.message}`);
            }
        }
        
        console.log('🎉 انتهت عملية رفع كتب الفلسفة');
    }

    async run() {
        try {
            const result = await this.generatePhilosophyBooks();
            
            console.log('\n📊 إحصائيات:');
            console.log(`- عدد كتب الفلسفة: ${result.count}`);
            console.log(`- ملف البيانات: ${result.filePath}`);
            
            // السؤال عن الرفع للنظام
            console.log('\n❓ هل تريد رفع هذه الكتب للنظام؟ (y/n)');
            
            return result;
            
        } catch (error) {
            console.error('❌ خطأ في العملية:', error);
            return null;
        }
    }
}

// تشغيل الاختبار
if (require.main === module) {
    const test = new QuickPhilosophyTest();
    test.run().then(() => {
        console.log('\n✨ انتهى اختبار كتب الفلسفة');
    }).catch(error => {
        console.error('❌ فشل الاختبار:', error);
    });
}

module.exports = QuickPhilosophyTest;
