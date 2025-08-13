#!/usr/bin/env node

/**
 * Script رئيسي لسحب ورفع كتب هنداوي إلى نظام كتابي
 */

const SimpleHindawiScraper = require('./simple-hindawi-scraper');
const KitabApiClient = require('./kitab-api-client');
const fs = require('fs').promises;
const path = require('path');

class HindawiToKitabImporter {
    constructor() {
        this.scraper = new SimpleHindawiScraper();
        this.apiClient = new KitabApiClient();
        this.logFile = path.join(__dirname, 'import_log.txt');
    }

    async log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        
        console.log(message);
        
        try {
            await fs.appendFile(this.logFile, logMessage, 'utf8');
        } catch (error) {
            console.error('خطأ في الكتابة للسجل:', error.message);
        }
    }

    async run() {
        try {
            await this.log('🚀 بدء عملية استيراد كتب هنداوي إلى نظام كتابي');

            // تسجيل الدخول إلى النظام
            await this.log('🔑 تسجيل الدخول إلى النظام...');
            const loginSuccess = await this.apiClient.login();
            
            if (!loginSuccess) {
                await this.log('❌ فشل تسجيل الدخول، سيتم الإنهاء');
                return;
            }

            // التحقق من عدد الكتب الحالي
            const currentBooksCount = await this.apiClient.getBooksCount();
            await this.log(`📚 عدد الكتب الحالي في النظام: ${currentBooksCount}`);

            // سحب الكتب من هنداوي
            await this.log('🔍 سحب الكتب من موقع هنداوي...');
            const books = await this.scraper.run();

            if (books.length === 0) {
                await this.log('❌ لم يتم العثور على كتب للاستيراد');
                return;
            }

            await this.log(`✅ تم العثور على ${books.length} كتاب للاستيراد`);

            // رفع الكتب إلى النظام
            let successCount = 0;
            let failureCount = 0;

            for (let i = 0; i < books.length; i++) {
                const book = books[i];
                
                await this.log(`📖 رفع الكتاب ${i + 1}/${books.length}: ${book.title}`);

                try {
                    const result = await this.apiClient.uploadBook(book);
                    
                    if (result) {
                        successCount++;
                        await this.log(`✅ تم رفع "${book.title}" بنجاح`);
                    } else {
                        failureCount++;
                        await this.log(`❌ فشل رفع "${book.title}"`);
                    }
                } catch (error) {
                    failureCount++;
                    await this.log(`❌ خطأ في رفع "${book.title}": ${error.message}`);
                }

                // تأخير بين العمليات
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // التحقق من العدد النهائي
            const finalBooksCount = await this.apiClient.getBooksCount();

            // تقرير النتائج
            await this.log('\n📊 تقرير الاستيراد:');
            await this.log(`✅ تم رفع ${successCount} كتاب بنجاح`);
            await this.log(`❌ فشل في رفع ${failureCount} كتاب`);
            await this.log(`📚 عدد الكتب قبل الاستيراد: ${currentBooksCount}`);
            await this.log(`📚 عدد الكتب بعد الاستيراد: ${finalBooksCount}`);
            await this.log(`📈 إجمالي الكتب المضافة: ${finalBooksCount - currentBooksCount}`);

            // حفظ تقرير مفصل
            const report = {
                timestamp: new Date().toISOString(),
                booksFound: books.length,
                successfulUploads: successCount,
                failedUploads: failureCount,
                booksBefore: currentBooksCount,
                booksAfter: finalBooksCount,
                booksAdded: finalBooksCount - currentBooksCount,
                books: books.map(book => ({
                    title: book.title,
                    author: book.author,
                    category: book.category
                }))
            };

            const reportFile = path.join(__dirname, `hindawi_import_report_${Date.now()}.json`);
            await fs.writeFile(reportFile, JSON.stringify(report, null, 2), 'utf8');
            
            await this.log(`📄 تم حفظ التقرير المفصل في: ${reportFile}`);
            await this.log('✨ انتهت عملية الاستيراد بنجاح!');

        } catch (error) {
            await this.log(`❌ خطأ في عملية الاستيراد: ${error.message}`);
            console.error(error);
        }
    }
}

// تشغيل السكريبت
if (require.main === module) {
    const importer = new HindawiToKitabImporter();
    importer.run().catch(console.error);
}

module.exports = HindawiToKitabImporter;
