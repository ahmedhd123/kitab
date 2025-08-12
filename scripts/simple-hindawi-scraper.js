#!/usr/bin/env node

/**
 * script مبسط لسحب كتب هنداوي بدون puppeteer
 * يستخدم cheerio و axios للسرعة
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

class SimpleHindawiScraper {
    constructor() {
        this.baseUrl = 'https://www.hindawi.org';
        this.books = [];
        this.maxBooks = 20;
    }

    async fetchPage(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept-Language': 'ar,en;q=0.9'
                },
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            console.error(`❌ خطأ في جلب الصفحة ${url}:`, error.message);
            return null;
        }
    }

    async getBooksList() {
        console.log('📚 البحث عن الكتب في موقع هنداوي...');
        
        const html = await this.fetchPage(`${this.baseUrl}/books/`);
        if (!html) return [];

        const $ = cheerio.load(html);
        const books = [];

        // البحث عن روابط الكتب
        $('a[href*="/books/"]').each((i, element) => {
            const $link = $(element);
            const href = $link.attr('href');
            const title = $link.text().trim();

            if (href && title && !href.endsWith('/books/') && 
                !href.includes('/categories/') && title.length > 3) {
                
                const fullUrl = href.startsWith('http') ? href : this.baseUrl + href;
                
                books.push({
                    title: title,
                    url: fullUrl
                });
            }
        });

        // إزالة المكررات
        const uniqueBooks = books.filter((book, index, self) => 
            index === self.findIndex(b => b.url === book.url)
        );

        console.log(`✅ تم العثور على ${uniqueBooks.length} كتاب`);
        return uniqueBooks.slice(0, this.maxBooks);
    }

    async getBookDetails(bookUrl) {
        const html = await this.fetchPage(bookUrl);
        if (!html) return null;

        const $ = cheerio.load(html);
        
        const bookData = {
            title: '',
            author: '',
            description: '',
            publishYear: '',
            isbn: '',
            pages: '',
            coverImage: '',
            downloadLinks: {},
            tags: [],
            category: 'الأدب العربي'
        };

        // العنوان
        const title = $('h1').first().text().trim() || 
                     $('.book-title').text().trim() ||
                     $('.title').text().trim();
        bookData.title = title;

        // المؤلف
        const author = $('.author').text().trim() ||
                      $('.book-author').text().trim() ||
                      $('[class*="author"]').text().trim();
        bookData.author = author.replace('المؤلف:', '').replace('تأليف:', '').trim();

        // الوصف
        const description = $('.description').text().trim() ||
                           $('.book-description').text().trim() ||
                           $('.summary').text().trim() ||
                           $('.abstract').text().trim();
        bookData.description = description.substring(0, 500);

        // صورة الغلاف
        const coverImg = $('.book-cover img').attr('src') ||
                        $('.cover img').attr('src') ||
                        $('img[alt*="غلاف"]').attr('src');
        if (coverImg) {
            bookData.coverImage = coverImg.startsWith('http') ? coverImg : this.baseUrl + coverImg;
        }

        // روابط التحميل
        $('a[href*=".pdf"]').each((i, el) => {
            bookData.downloadLinks.pdf = $(el).attr('href');
        });

        $('a[href*=".epub"]').each((i, el) => {
            bookData.downloadLinks.epub = $(el).attr('href');
        });

        // معلومات إضافية من النص
        const fullText = $.text();
        
        // سنة النشر
        const yearMatch = fullText.match(/(\d{4})/g);
        if (yearMatch) {
            const years = yearMatch.filter(y => parseInt(y) >= 1800 && parseInt(y) <= new Date().getFullYear());
            if (years.length > 0) bookData.publishYear = years[0];
        }

        // عدد الصفحات
        const pagesMatch = fullText.match(/(\d+)\s*صفحة/);
        if (pagesMatch) bookData.pages = pagesMatch[1];

        // ISBN
        const isbnMatch = fullText.match(/ISBN[\s:]*([0-9\-X]+)/i);
        if (isbnMatch) bookData.isbn = isbnMatch[1];

        // الكلمات المفتاحية
        $('.tags a, .keywords a, .subjects a').each((i, el) => {
            const tag = $(el).text().trim();
            if (tag) bookData.tags.push(tag);
        });

        return bookData.title ? bookData : null;
    }

    async generateMockBooks() {
        console.log('🔄 إنشاء كتب تجريبية من بيانات هنداوي...');
        
        const mockBooks = [
            {
                title: 'في منزل الوحي',
                author: 'محمد الغزالي',
                description: 'كتاب يتناول سيرة النبي محمد صلى الله عليه وسلم والدروس المستفادة من حياته الشريفة',
                publishYear: '1990',
                isbn: '978-977-123-456-7',
                pages: '320',
                category: 'الدين',
                tags: ['سيرة', 'الرسول', 'إسلام', 'هنداوي'],
                downloadLinks: {
                    pdf: 'https://www.hindawi.org/books/sample.pdf'
                },
                coverImage: 'https://www.hindawi.org/covers/sample1.jpg'
            },
            {
                title: 'قصة الحضارة',
                author: 'ول ديورانت',
                description: 'موسوعة تاريخية شاملة تغطي تاريخ الحضارة الإنسانية من البدايات حتى العصر الحديث',
                publishYear: '1985',
                isbn: '978-977-234-567-8',
                pages: '480',
                category: 'التاريخ',
                tags: ['حضارة', 'تاريخ', 'ثقافة', 'هنداوي'],
                downloadLinks: {
                    pdf: 'https://www.hindawi.org/books/sample2.pdf',
                    epub: 'https://www.hindawi.org/books/sample2.epub'
                },
                coverImage: 'https://www.hindawi.org/covers/sample2.jpg'
            },
            {
                title: 'الأيام',
                author: 'طه حسين',
                description: 'السيرة الذاتية للأديب الكبير طه حسين، تحكي قصة نشأته وتعليمه وكفاحه في الحياة',
                publishYear: '1955',
                isbn: '978-977-345-678-9',
                pages: '280',
                category: 'الأدب العربي',
                tags: ['سيرة ذاتية', 'أدب', 'طه حسين', 'هنداوي'],
                downloadLinks: {
                    pdf: 'https://www.hindawi.org/books/sample3.pdf'
                },
                coverImage: 'https://www.hindawi.org/covers/sample3.jpg'
            },
            {
                title: 'فجر الإسلام',
                author: 'أحمد أمين',
                description: 'دراسة تاريخية شاملة لفترة صدر الإسلام والخلافة الراشدة وأثرها على الحضارة',
                publishYear: '1965',
                isbn: '978-977-456-789-0',
                pages: '420',
                category: 'التاريخ',
                tags: ['إسلام', 'تاريخ', 'خلافة', 'هنداوي'],
                downloadLinks: {
                    pdf: 'https://www.hindawi.org/books/sample4.pdf',
                    epub: 'https://www.hindawi.org/books/sample4.epub'
                },
                coverImage: 'https://www.hindawi.org/covers/sample4.jpg'
            },
            {
                title: 'حديث الأربعاء',
                author: 'طه حسين',
                description: 'مجموعة من المقالات الأدبية والفكرية التي تناولت قضايا الأدب والثقافة العربية',
                publishYear: '1960',
                isbn: '978-977-567-890-1',
                pages: '360',
                category: 'الأدب العربي',
                tags: ['مقالات', 'أدب', 'نقد', 'هنداوي'],
                downloadLinks: {
                    pdf: 'https://www.hindawi.org/books/sample5.pdf'
                },
                coverImage: 'https://www.hindawi.org/covers/sample5.jpg'
            }
        ];

        console.log(`✅ تم إنشاء ${mockBooks.length} كتاب تجريبي`);
        return mockBooks;
    }

    async run() {
        try {
            console.log('🚀 بدء عملية سحب الكتب من هنداوي...');
            
            // محاولة سحب الكتب الحقيقية
            let books = await this.getBooksList();
            
            if (books.length === 0) {
                console.log('⚠️ لم يتم العثور على كتب، سيتم استخدام البيانات التجريبية');
                books = await this.generateMockBooks();
            } else {
                // سحب تفاصيل الكتب
                const booksWithDetails = [];
                
                for (let i = 0; i < Math.min(books.length, 5); i++) {
                    console.log(`📖 سحب تفاصيل الكتاب ${i + 1}/${Math.min(books.length, 5)}: ${books[i].title}`);
                    
                    const details = await this.getBookDetails(books[i].url);
                    if (details) {
                        booksWithDetails.push(details);
                    }
                    
                    // تأخير بين الطلبات
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                
                books = booksWithDetails;
            }

            // حفظ البيانات
            const outputFile = path.join(__dirname, 'hindawi_books.json');
            await fs.writeFile(outputFile, JSON.stringify(books, null, 2), 'utf8');
            
            console.log(`\n✅ تم حفظ بيانات ${books.length} كتاب في: ${outputFile}`);
            console.log('\n📚 الكتب المحفوظة:');
            
            books.forEach((book, index) => {
                console.log(`${index + 1}. ${book.title} - ${book.author}`);
            });

            return books;

        } catch (error) {
            console.error('❌ خطأ في العملية:', error.message);
            return [];
        }
    }
}

// تشغيل السكريبت
if (require.main === module) {
    const scraper = new SimpleHindawiScraper();
    scraper.run().catch(console.error);
}

module.exports = SimpleHindawiScraper;
