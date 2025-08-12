#!/usr/bin/env node

/**
 * Hindawi Philosophy Books Scraper
 * يقوم بسحب كتب الفلسفة فقط من موقع هنداوي وإضافتها للنظام
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

class HindawiPhilosophyScraper {
    constructor() {
        this.baseUrl = 'https://www.hindawi.org';
        this.philosophyUrl = 'https://www.hindawi.org/books/philosophy/';
        this.booksData = [];
        this.downloadDir = path.join(__dirname, 'downloads', 'philosophy');
        this.maxBooks = 30; // حد أقصى لكتب الفلسفة
        this.delay = 2000; // تأخير بين الطلبات
        
        // URLs فرعية للفلسفة
        this.philosophyCategories = [
            'https://www.hindawi.org/books/philosophy/',
            'https://www.hindawi.org/books/philosophy/islamic-philosophy/',
            'https://www.hindawi.org/books/philosophy/ancient-philosophy/',
            'https://www.hindawi.org/books/philosophy/modern-philosophy/',
            'https://www.hindawi.org/books/philosophy/logic/',
            'https://www.hindawi.org/books/philosophy/ethics/'
        ];
    }

    async init() {
        // إنشاء مجلد التحميل
        await fs.mkdir(this.downloadDir, { recursive: true });
        
        console.log('🧠 بدء عملية سحب كتب الفلسفة من موقع هنداوي...');
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

    async scrapePhilosophyBooks() {
        console.log('🔍 البحث عن كتب الفلسفة...');
        
        const allBooks = [];
        
        for (const categoryUrl of this.philosophyCategories) {
            if (allBooks.length >= this.maxBooks) break;
            
            try {
                console.log(`📚 سحب كتب من: ${categoryUrl}`);
                
                await this.page.goto(categoryUrl, { 
                    waitUntil: 'networkidle2',
                    timeout: 30000 
                });

                await this.page.waitForTimeout(2000);

                // استخراج قائمة كتب الفلسفة
                const books = await this.page.evaluate(() => {
                    const booksList = [];
                    
                    // البحث عن روابط الكتب
                    const bookLinks = document.querySelectorAll('a[href*="/books/"]');
                    
                    bookLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        const titleElement = link.querySelector('h3, h2, .title, .book-title') || link;
                        const title = titleElement.textContent.trim();
                        
                        // التأكد من أن الرابط يخص كتاب وليس فئة
                        if (href && title && 
                            href.includes('/books/') && 
                            !href.endsWith('/books/') && 
                            !href.includes('/categories/') &&
                            !href.includes('/philosophy/')) {
                            
                            booksList.push({
                                title: title,
                                url: href.startsWith('http') ? href : 'https://www.hindawi.org' + href
                            });
                        }
                    });
                    
                    return booksList;
                });

                console.log(`📖 تم العثور على ${books.length} كتاب فلسفة`);
                
                // إضافة الكتب مع تجنب التكرار
                for (const book of books) {
                    if (allBooks.length >= this.maxBooks) break;
                    
                    if (!allBooks.some(existingBook => existingBook.title === book.title)) {
                        allBooks.push(book);
                    }
                }
                
                await this.page.waitForTimeout(this.delay);
                
            } catch (error) {
                console.log(`⚠️ خطأ في سحب كتب من ${categoryUrl}:`, error.message);
            }
        }

        console.log(`✅ تم العثور على ${allBooks.length} كتاب فلسفة إجمالي`);
        return allBooks;
    }

    async scrapePhilosophyBookDetails(bookUrl) {
        try {
            console.log(`📄 سحب تفاصيل الكتاب: ${bookUrl}`);
            
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
                    tags: ['فلسفة', 'هنداوي']
                };

                // العنوان
                const titleEl = document.querySelector('h1, .book-title, .title, .main-title');
                if (titleEl) data.title = titleEl.textContent.trim();

                // المؤلف
                const authorEl = document.querySelector('.author, .writer, .book-author, .by-author');
                if (authorEl) {
                    data.author = authorEl.textContent.replace(/تأليف|المؤلف|بقلم/g, '').trim();
                }

                // الوصف
                const descEl = document.querySelector('.description, .summary, .book-description, .content p');
                if (descEl) data.description = descEl.textContent.trim();

                // سنة النشر
                const yearEl = document.querySelector('.publish-year, .year, .date');
                if (yearEl) {
                    const yearMatch = yearEl.textContent.match(/\d{4}/);
                    if (yearMatch) data.publishYear = yearMatch[0];
                }

                // عدد الصفحات
                const pagesEl = document.querySelector('.pages, .page-count');
                if (pagesEl) {
                    const pagesMatch = pagesEl.textContent.match(/\d+/);
                    if (pagesMatch) data.pages = pagesMatch[0];
                }

                // ISBN
                const isbnEl = document.querySelector('.isbn');
                if (isbnEl) data.isbn = isbnEl.textContent.trim();

                // صورة الغلاف
                const coverEl = document.querySelector('.book-cover img, .cover img, img[alt*="غلاف"]');
                if (coverEl) {
                    data.coverImage = coverEl.src;
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

                // إضافة تاجات فلسفية محددة
                const titleLower = data.title.toLowerCase();
                if (titleLower.includes('منطق')) data.tags.push('منطق');
                if (titleLower.includes('أخلاق')) data.tags.push('أخلاق');
                if (titleLower.includes('وجود')) data.tags.push('وجودية');
                if (titleLower.includes('معرفة')) data.tags.push('نظرية المعرفة');
                if (titleLower.includes('إسلام')) data.tags.push('فلسفة إسلامية');
                if (titleLower.includes('يونان')) data.tags.push('فلسفة يونانية');

                return data;
            });

            // تنظيف البيانات
            bookData.title = this.cleanText(bookData.title);
            bookData.author = this.cleanText(bookData.author) || 'مؤلف غير محدد';
            bookData.description = this.cleanText(bookData.description) || 'كتاب فلسفي من مؤسسة هنداوي';

            console.log(`✅ تم سحب تفاصيل: ${bookData.title}`);
            
            await this.page.waitForTimeout(this.delay);
            
            return bookData;
            
        } catch (error) {
            console.log(`❌ خطأ في سحب تفاصيل الكتاب: ${error.message}`);
            return null;
        }
    }

    cleanText(text) {
        if (!text) return '';
        return text
            .replace(/\s+/g, ' ')
            .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\-\(\)]/g, '')
            .trim();
    }

    async processAllPhilosophyBooks() {
        const booksList = await this.scrapePhilosophyBooks();
        const processedBooks = [];

        console.log(`🔄 بدء معالجة ${booksList.length} كتاب فلسفة...`);

        for (let i = 0; i < booksList.length && i < this.maxBooks; i++) {
            const book = booksList[i];
            
            console.log(`📖 معالجة الكتاب ${i + 1}/${Math.min(booksList.length, this.maxBooks)}: ${book.title}`);
            
            const bookDetails = await this.scrapePhilosophyBookDetails(book.url);
            
            if (bookDetails && bookDetails.title) {
                // تحويل إلى تنسيق النظام
                const systemBook = {
                    title: bookDetails.title,
                    author: bookDetails.author,
                    description: bookDetails.description,
                    genre: 'الفلسفة',
                    language: 'arabic',
                    publishYear: bookDetails.publishYear || '',
                    isbn: bookDetails.isbn || '',
                    pages: bookDetails.pages || '',
                    publisher: 'مؤسسة هنداوي',
                    tags: bookDetails.tags,
                    status: 'published',
                    isFree: true,
                    price: 0,
                    coverImage: bookDetails.coverImage || '',
                    files: bookDetails.downloadLinks,
                    source: 'hindawi',
                    originalUrl: book.url,
                    category: 'philosophy'
                };

                processedBooks.push(systemBook);
                console.log(`✅ تمت معالجة: ${systemBook.title}`);
            }
        }

        this.booksData = processedBooks;
        console.log(`🎉 تم معالجة ${processedBooks.length} كتاب فلسفة بنجاح`);
        
        return processedBooks;
    }

    async savePhilosophyBooksData() {
        const filePath = path.join(this.downloadDir, 'philosophy-books.json');
        
        await fs.writeFile(filePath, JSON.stringify(this.booksData, null, 2), 'utf8');
        
        console.log(`💾 تم حفظ بيانات ${this.booksData.length} كتاب فلسفة في: ${filePath}`);
        
        return filePath;
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔒 تم إغلاق المتصفح');
        }
    }

    async run() {
        try {
            await this.init();
            await this.launchBrowser();
            
            const books = await this.processAllPhilosophyBooks();
            
            if (books.length > 0) {
                await this.savePhilosophyBooksData();
                console.log(`\n🎊 تم الانتهاء بنجاح! تم سحب ${books.length} كتاب فلسفة`);
                
                // عرض ملخص
                console.log('\n📊 ملخص الكتب المسحوبة:');
                books.forEach((book, index) => {
                    console.log(`${index + 1}. ${book.title} - ${book.author}`);
                });
            } else {
                console.log('❌ لم يتم العثور على أي كتب فلسفة');
            }
            
        } catch (error) {
            console.error('💥 خطأ عام في العملية:', error);
        } finally {
            await this.closeBrowser();
        }
        
        return this.booksData;
    }
}

// تشغيل السكريبت إذا تم استدعاؤه مباشرة
if (require.main === module) {
    const scraper = new HindawiPhilosophyScraper();
    scraper.run().then(() => {
        console.log('✨ انتهت عملية سحب كتب الفلسفة');
        process.exit(0);
    }).catch(error => {
        console.error('❌ فشلت عملية السحب:', error);
        process.exit(1);
    });
}

module.exports = HindawiPhilosophyScraper;
