#!/usr/bin/env node

/**
 * Hindawi Books Scraper and Uploader
 * يقوم بسحب الكتب من موقع هنداوي وإضافتها للنظام
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const fetch = require('node-fetch');

class HindawiScraper {
    constructor() {
        this.baseUrl = 'https://www.hindawi.org';
        this.booksData = [];
        this.downloadDir = path.join(__dirname, 'downloads', 'hindawi');
        this.maxBooks = 50; // حد أقصى للكتب في المرة الواحدة
        this.delay = 2000; // تأخير بين الطلبات
    }

    async init() {
        // إنشاء مجلد التحميل
        await fs.mkdir(this.downloadDir, { recursive: true });
        
        console.log('🚀 بدء عملية سحب الكتب من موقع هنداوي...');
        console.log(`📁 مجلد التحميل: ${this.downloadDir}`);
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch({
            headless: false, // لمراقبة العملية
            defaultViewport: null,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.page = await this.browser.newPage();
        
        // تعيين User Agent
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        // تعيين اللغة للعربية
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
        });
    }

    async scrapeBooksCategories() {
        console.log('📚 البحث عن تصنيفات الكتب...');
        
        await this.page.goto(`${this.baseUrl}/books/`, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        // انتظار تحميل الصفحة
        await this.page.waitForTimeout(3000);

        // استخراج التصنيفات
        const categories = await this.page.evaluate(() => {
            const categoryLinks = [];
            
            // البحث عن روابط التصنيفات
            const links = document.querySelectorAll('a[href*="/books/"]');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                const text = link.textContent.trim();
                
                if (href && text && href.includes('/books/') && !href.endsWith('/books/')) {
                    categoryLinks.push({
                        name: text,
                        url: href.startsWith('http') ? href : 'https://www.hindawi.org' + href
                    });
                }
            });
            
            return categoryLinks;
        });

        console.log(`✅ تم العثور على ${categories.length} تصنيف`);
        return categories;
    }

    async scrapeBooksList(categoryUrl, categoryName) {
        console.log(`📖 سحب كتب تصنيف: ${categoryName}`);
        
        await this.page.goto(categoryUrl, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        await this.page.waitForTimeout(2000);

        // استخراج قائمة الكتب
        const books = await this.page.evaluate((category) => {
            const booksList = [];
            
            // البحث عن روابط الكتب
            const bookLinks = document.querySelectorAll('a[href*="/books/"]');
            
            bookLinks.forEach(link => {
                const href = link.getAttribute('href');
                const titleElement = link.querySelector('h3, h2, .title') || link;
                const title = titleElement.textContent.trim();
                
                if (href && title && href.includes('/books/') && 
                    !href.endsWith('/books/') && !href.includes('/categories/')) {
                    
                    booksList.push({
                        title: title,
                        url: href.startsWith('http') ? href : 'https://www.hindawi.org' + href,
                        category: category
                    });
                }
            });
            
            return booksList;
        }, categoryName);

        console.log(`📚 تم العثور على ${books.length} كتاب في تصنيف ${categoryName}`);
        return books;
    }

    async scrapeBookDetails(bookUrl) {
        try {
            await this.page.goto(bookUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            await this.page.waitForTimeout(1500);

            const bookData = await this.page.evaluate(() => {
                const data = {
                    title: '',
                    author: '',
                    description: '',
                    publishYear: '',
                    pages: '',
                    isbn: '',
                    coverImage: '',
                    downloadLinks: {},
                    tags: []
                };

                // العنوان
                const titleEl = document.querySelector('h1, .book-title, .title');
                if (titleEl) data.title = titleEl.textContent.trim();

                // المؤلف
                const authorEl = document.querySelector('.author, .book-author, [class*="author"]');
                if (authorEl) data.author = authorEl.textContent.trim().replace('المؤلف:', '').trim();

                // الوصف
                const descEl = document.querySelector('.description, .book-description, .summary, .abstract');
                if (descEl) data.description = descEl.textContent.trim();

                // صورة الغلاف
                const coverEl = document.querySelector('.book-cover img, .cover img, img[alt*="غلاف"]');
                if (coverEl) {
                    const src = coverEl.src;
                    data.coverImage = src.startsWith('http') ? src : 'https://www.hindawi.org' + src;
                }

                // روابط التحميل
                const downloadLinks = document.querySelectorAll('a[href*=".pdf"], a[href*=".epub"], a[href*="download"]');
                downloadLinks.forEach(link => {
                    const href = link.href;
                    const text = link.textContent.toLowerCase();
                    
                    if (href.includes('.pdf')) {
                        data.downloadLinks.pdf = href;
                    } else if (href.includes('.epub')) {
                        data.downloadLinks.epub = href;
                    }
                });

                // معلومات إضافية
                const infoElements = document.querySelectorAll('.book-info li, .metadata li, .book-details li');
                infoElements.forEach(el => {
                    const text = el.textContent.trim();
                    
                    if (text.includes('سنة النشر') || text.includes('تاريخ النشر')) {
                        const year = text.match(/\d{4}/);
                        if (year) data.publishYear = year[0];
                    }
                    
                    if (text.includes('عدد الصفحات')) {
                        const pages = text.match(/\d+/);
                        if (pages) data.pages = pages[0];
                    }
                    
                    if (text.includes('ISBN') || text.includes('ردمك')) {
                        const isbn = text.replace(/[^\d\-X]/g, '');
                        if (isbn) data.isbn = isbn;
                    }
                });

                // الكلمات المفتاحية
                const tagElements = document.querySelectorAll('.tags a, .keywords a, .subjects a');
                tagElements.forEach(tag => {
                    if (tag.textContent.trim()) {
                        data.tags.push(tag.textContent.trim());
                    }
                });

                return data;
            });

            if (!bookData.title) {
                console.log(`⚠️ لم يتم العثور على عنوان للكتاب: ${bookUrl}`);
                return null;
            }

            return bookData;

        } catch (error) {
            console.error(`❌ خطأ في سحب تفاصيل الكتاب ${bookUrl}:`, error.message);
            return null;
        }
    }

    async downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const buffer = await response.buffer();
            const filePath = path.join(this.downloadDir, filename);
            
            await fs.writeFile(filePath, buffer);
            console.log(`✅ تم تحميل الملف: ${filename}`);
            
            return filePath;
        } catch (error) {
            console.error(`❌ فشل تحميل الملف ${filename}:`, error.message);
            return null;
        }
    }

    async uploadBookToSystem(bookData, filePaths) {
        try {
            // إعداد بيانات الكتاب للرفع
            const formData = new FormData();
            
            formData.append('title', bookData.title);
            formData.append('author', bookData.author || 'مؤلف مجهول');
            formData.append('description', bookData.description || 'وصف غير متوفر');
            formData.append('genre', bookData.category || 'عام');
            formData.append('language', 'arabic');
            formData.append('publishYear', bookData.publishYear || '');
            formData.append('isbn', bookData.isbn || '');
            formData.append('pages', bookData.pages || '');
            formData.append('publisher', 'مؤسسة هنداوي');
            formData.append('tags', JSON.stringify(bookData.tags || []));
            formData.append('status', 'published');
            formData.append('isFree', 'true');
            formData.append('price', '0');

            // رفع الملفات إذا كانت متوفرة
            if (filePaths.pdf && await fs.access(filePaths.pdf).then(() => true).catch(() => false)) {
                const pdfBuffer = await fs.readFile(filePaths.pdf);
                formData.append('files[pdf]', new Blob([pdfBuffer]), path.basename(filePaths.pdf));
            }

            if (filePaths.epub && await fs.access(filePaths.epub).then(() => true).catch(() => false)) {
                const epubBuffer = await fs.readFile(filePaths.epub);
                formData.append('files[epub]', new Blob([epubBuffer]), path.basename(filePaths.epub));
            }

            // رفع صورة الغلاف
            if (bookData.coverImage) {
                try {
                    const coverResponse = await fetch(bookData.coverImage);
                    if (coverResponse.ok) {
                        const coverBuffer = await coverResponse.buffer();
                        formData.append('coverImage', new Blob([coverBuffer]), 'cover.jpg');
                    }
                } catch (error) {
                    console.log(`⚠️ فشل تحميل صورة الغلاف: ${error.message}`);
                }
            }

            // إرسال البيانات إلى API النظام
            const response = await fetch('http://localhost:3000/api/admin/books', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer admin-token' // يجب تعديل هذا
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ تم رفع الكتاب بنجاح: ${bookData.title}`);
                return result;
            } else {
                console.error(`❌ فشل رفع الكتاب ${bookData.title}: HTTP ${response.status}`);
                return null;
            }

        } catch (error) {
            console.error(`❌ خطأ في رفع الكتاب ${bookData.title}:`, error.message);
            return null;
        }
    }

    async processBook(book, index, total) {
        console.log(`\n📖 معالجة الكتاب ${index + 1}/${total}: ${book.title}`);
        
        // سحب تفاصيل الكتاب
        const bookData = await this.scrapeBookDetails(book.url);
        if (!bookData) return null;

        // إضافة التصنيف
        bookData.category = book.category;

        // تحميل الملفات
        const filePaths = {};
        
        if (bookData.downloadLinks.pdf) {
            const pdfFilename = `${bookData.title.replace(/[^\w\s]/gi, '').substring(0, 50)}.pdf`;
            filePaths.pdf = await this.downloadFile(bookData.downloadLinks.pdf, pdfFilename);
        }

        if (bookData.downloadLinks.epub) {
            const epubFilename = `${bookData.title.replace(/[^\w\s]/gi, '').substring(0, 50)}.epub`;
            filePaths.epub = await this.downloadFile(bookData.downloadLinks.epub, epubFilename);
        }

        // رفع الكتاب للنظام
        const uploadResult = await this.uploadBookToSystem(bookData, filePaths);

        // تأخير بين العمليات
        await this.page.waitForTimeout(this.delay);

        return {
            bookData,
            filePaths,
            uploadResult,
            success: !!uploadResult
        };
    }

    async run() {
        try {
            await this.init();
            await this.launchBrowser();

            // سحب التصنيفات
            const categories = await this.scrapeBooksCategories();
            
            if (categories.length === 0) {
                console.log('❌ لم يتم العثور على أي تصنيفات');
                return;
            }

            let totalBooks = [];
            
            // سحب الكتب من كل تصنيف
            for (const category of categories.slice(0, 5)) { // أول 5 تصنيفات فقط
                const books = await this.scrapeBooksList(category.url, category.name);
                totalBooks = totalBooks.concat(books.slice(0, 10)); // أول 10 كتب من كل تصنيف
                
                if (totalBooks.length >= this.maxBooks) break;
            }

            totalBooks = totalBooks.slice(0, this.maxBooks);
            
            console.log(`\n🎯 سيتم معالجة ${totalBooks.length} كتاب`);

            // معالجة الكتب
            const results = [];
            let successCount = 0;

            for (let i = 0; i < totalBooks.length; i++) {
                const result = await this.processBook(totalBooks[i], i, totalBooks.length);
                if (result) {
                    results.push(result);
                    if (result.success) successCount++;
                }
            }

            // تقرير النتائج
            console.log('\n📊 تقرير النتائج:');
            console.log(`✅ تم رفع ${successCount} كتاب بنجاح`);
            console.log(`❌ فشل في رفع ${results.length - successCount} كتاب`);
            console.log(`📁 الملفات المحملة في: ${this.downloadDir}`);

            // حفظ تقرير مفصل
            const report = {
                timestamp: new Date().toISOString(),
                total: totalBooks.length,
                success: successCount,
                failed: results.length - successCount,
                results: results
            };

            await fs.writeFile(
                path.join(__dirname, 'hindawi_import_report.json'),
                JSON.stringify(report, null, 2),
                'utf8'
            );

            console.log('📄 تم حفظ التقرير في: hindawi_import_report.json');

        } catch (error) {
            console.error('❌ خطأ في العملية الرئيسية:', error);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// تشغيل السكريبت
if (require.main === module) {
    const scraper = new HindawiScraper();
    scraper.run().catch(console.error);
}

module.exports = HindawiScraper;
