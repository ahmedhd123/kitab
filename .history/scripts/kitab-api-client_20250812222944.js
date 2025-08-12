#!/usr/bin/env node

/**
 * محدث API للربط مع نظام كتابي
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs').promises;
const path = require('path');

class KitabApiClient {
    constructor(baseUrl = 'https://kitab-onbiiu6tn-ahmedhd123s-projects.vercel.app') {
        this.baseUrl = baseUrl;
        this.token = null;
    }

    async login(email = 'admin@kitabi.com', password = 'admin123') {
        try {
            const response = await fetch(`${this.baseUrl}/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success && data.token) {
                this.token = data.token;
                console.log('✅ تم تسجيل الدخول بنجاح');
                return true;
            } else {
                console.error('❌ فشل تسجيل الدخول:', data.message);
                return false;
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error.message);
            return false;
        }
    }

    async uploadBook(bookData) {
        if (!this.token) {
            console.error('❌ يجب تسجيل الدخول أولاً');
            return null;
        }

        try {
            const formData = new FormData();
            
            // البيانات الأساسية
            formData.append('title', bookData.title);
            formData.append('author', bookData.author || 'مؤلف مجهول');
            formData.append('description', bookData.description || 'وصف غير متوفر');
            formData.append('genre', this.mapGenre(bookData.category) || 'الأدب العربي');
            formData.append('language', 'arabic');
            formData.append('publishYear', bookData.publishYear || '');
            formData.append('isbn', bookData.isbn || '');
            formData.append('pages', bookData.pages || '');
            formData.append('publisher', 'مؤسسة هنداوي');
            formData.append('tags', JSON.stringify([
                'هنداوي',
                'كتب مجانية',
                ...(bookData.tags || [])
            ]));
            formData.append('status', 'published');
            formData.append('isFree', 'true');
            formData.append('price', '0');

            // رفع صورة الغلاف إذا كانت متوفرة
            if (bookData.coverImagePath && await this.fileExists(bookData.coverImagePath)) {
                const coverBuffer = await fs.readFile(bookData.coverImagePath);
                formData.append('coverImage', coverBuffer, 'cover.jpg');
            }

            // رفع ملفات الكتاب
            if (bookData.pdfPath && await this.fileExists(bookData.pdfPath)) {
                const pdfBuffer = await fs.readFile(bookData.pdfPath);
                formData.append('files[pdf]', pdfBuffer, path.basename(bookData.pdfPath));
            }

            if (bookData.epubPath && await this.fileExists(bookData.epubPath)) {
                const epubBuffer = await fs.readFile(bookData.epubPath);
                formData.append('files[epub]', epubBuffer, path.basename(bookData.epubPath));
            }

            const response = await fetch(`${this.baseUrl}/api/admin/books`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log(`✅ تم رفع الكتاب بنجاح: ${bookData.title}`);
                return result.data;
            } else {
                console.error(`❌ فشل رفع الكتاب ${bookData.title}:`, result.message);
                return null;
            }

        } catch (error) {
            console.error(`❌ خطأ في رفع الكتاب ${bookData.title}:`, error.message);
            return null;
        }
    }

    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    mapGenre(category) {
        const genreMap = {
            'فلسفة': 'الفلسفة',
            'تاريخ': 'التاريخ',
            'أدب': 'الأدب العربي',
            'شعر': 'الشعر',
            'علوم': 'العلوم',
            'دين': 'الدين',
            'سياسة': 'السياسة',
            'اقتصاد': 'الاقتصاد',
            'فنون': 'الفنون',
            'طب': 'الطب',
            'رياضة': 'الرياضة'
        };

        if (!category) return 'الأدب العربي';

        for (const [key, value] of Object.entries(genreMap)) {
            if (category.includes(key)) {
                return value;
            }
        }

        return 'الأدب العربي';
    }

    async getBooksCount() {
        try {
            const response = await fetch(`${this.baseUrl}/api/admin/books`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            
            if (data.success) {
                return data.data.books.length;
            }
            
            return 0;
        } catch (error) {
            console.error('❌ خطأ في جلب عدد الكتب:', error.message);
            return 0;
        }
    }
}

module.exports = KitabApiClient;
