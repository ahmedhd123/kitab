# 🔄 دليل ترحيل قاعدة البيانات - من MongoDB إلى Supabase PostgreSQL

## 🎯 لماذا Supabase PostgreSQL؟

### ✅ المزايا
- **سهولة الإعداد**: لا يتطلب خبرة متقدمة
- **واجهة بصرية**: إدارة قاعدة البيانات من المتصفح
- **مجاني**: طبقة مجانية سخية (500MB + 2 مليون استعلام شهرياً)
- **أمان عالي**: أذونات مدمجة وحماية من SQL Injection
- **استعلامات SQL**: أكثر مرونة من MongoDB
- **دعم العلاقات**: مناسب للبيانات المترابطة (مستخدمين، كتب، مراجعات)
- **دعم العربية**: ممتاز لمحتوى النصوص العربية
- **API تلقائي**: يولد REST API و GraphQL تلقائياً

### 🔗 بديل سهل الإعداد
- **Firebase Firestore**: مناسب للمبتدئين
- **PlanetScale**: MySQL مُدار في السحابة
- **Neon**: PostgreSQL مُدار مع طبقة مجانية

---

## 📊 تصميم قاعدة البيانات الجديدة

### 🏗️ هيكل الجداول (PostgreSQL)

#### جدول المستخدمين (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  bio TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'user',
  is_admin BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  favorite_genres TEXT[],
  reading_goal INTEGER DEFAULT 0,
  books_read INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### جدول الكتب (books)
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  isbn_10 VARCHAR(10),
  isbn_13 VARCHAR(13),
  publisher VARCHAR(100),
  published_date DATE,
  language VARCHAR(10) DEFAULT 'ar',
  pages INTEGER,
  cover_image_url VARCHAR(500),
  genres TEXT[],
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  added_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### جدول المؤلفين (authors)
```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  bio TEXT,
  birth_date DATE,
  nationality VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### جدول ربط الكتب بالمؤلفين (book_authors)
```sql
CREATE TABLE book_authors (
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'author', -- author, co-author, editor, translator
  PRIMARY KEY (book_id, author_id)
);
```

#### جدول المراجعات (reviews)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  content TEXT NOT NULL,
  reading_status VARCHAR(20) DEFAULT 'read',
  start_reading_date DATE,
  finish_reading_date DATE,
  is_recommended BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id) -- مراجعة واحدة لكل مستخدم لكل كتاب
);
```

#### جدول الإعجابات (review_likes)
```sql
CREATE TABLE review_likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, review_id)
);
```

#### جدول ملفات الكتب الرقمية (book_files)
```sql
CREATE TABLE book_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  file_type VARCHAR(10), -- pdf, epub, mobi
  file_url VARCHAR(500),
  file_size BIGINT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚀 خطوات الترحيل

### الخطوة 1: إنشاء حساب Supabase
```bash
# 1. اذهب إلى https://supabase.com
# 2. أنشئ حساب جديد (مجاني)
# 3. أنشئ مشروع جديد
# 4. اختر منطقة قريبة (مثل eu-west-1)
```

### الخطوة 2: إعداد قاعدة البيانات
```sql
-- نفذ هذه الاستعلامات في SQL Editor في Supabase

-- إنشاء الجداول
-- (انسخ الاستعلامات من الأعلى)

-- إنشاء الفهارس للأداء الأمثل
CREATE INDEX idx_books_title ON books USING gin(to_tsvector('arabic', title));
CREATE INDEX idx_books_genres ON books USING gin(genres);
CREATE INDEX idx_books_rating ON books(average_rating DESC);
CREATE INDEX idx_reviews_book_rating ON reviews(book_id, rating);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);

-- إعداد RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
CREATE POLICY "Users can view published reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);
```

### الخطوة 3: تحديث التطبيق
```javascript
// تثبيت Supabase client
npm install @supabase/supabase-js

// إعداد اتصال Supabase
// supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 🔄 مقارنة الكود: MongoDB vs Supabase

### إضافة مراجعة جديدة

#### MongoDB (الحالي)
```javascript
const review = new Review({
  user: userId,
  book: bookId,
  rating: 5,
  content: "كتاب رائع!"
});
await review.save();
```

#### Supabase (الجديد)
```javascript
const { data, error } = await supabase
  .from('reviews')
  .insert({
    user_id: userId,
    book_id: bookId,
    rating: 5,
    content: "كتاب رائع!"
  });
```

### جلب الكتب مع المراجعات

#### MongoDB (الحالي)
```javascript
const books = await Book.find()
  .populate('reviews')
  .populate('authors');
```

#### Supabase (الجديد)
```javascript
const { data: books } = await supabase
  .from('books')
  .select(`
    *,
    book_authors (
      authors (name, bio)
    ),
    reviews (
      id, rating, content, created_at,
      users (username, first_name)
    )
  `);
```

---

## 🛠️ نموذج API للمراجعات

### إنشاء API route جديد
```javascript
// pages/api/reviews/index.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // جلب المراجعات
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (username, first_name, last_name),
        books (title, cover_image_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ reviews });
  }

  if (req.method === 'POST') {
    // إضافة مراجعة جديدة
    const { user_id, book_id, rating, content } = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .insert({ user_id, book_id, rating, content })
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ review: data[0] });
  }
}
```

---

## 📈 مزايا إضافية لـ Supabase

### 1. أمان مدمج
- **Row Level Security**: حماية البيانات على مستوى الصف
- **JWT Authentication**: نظام مصادقة متقدم
- **API Keys**: مفاتيح API آمنة

### 2. ميزات متقدمة
- **Real-time subscriptions**: تحديثات فورية
- **Storage**: تخزين الملفات (صور الكتب، ملفات PDF)
- **Edge Functions**: وظائف خادم بدون خادم
- **Dashboard**: لوحة تحكم شاملة

### 3. أداء عالي
- **CDN**: شبكة توصيل محتوى عالمية
- **Connection pooling**: تجميع الاتصالات
- **Automatic scaling**: توسع تلقائي

---

## 🎯 خطة التنفيذ المقترحة

### الأسبوع الأول: إعداد قاعدة البيانات
1. إنشاء حساب Supabase
2. تصميم الجداول وتنفيذها
3. إدخال بيانات تجريبية

### الأسبوع الثاني: تحديث APIs
1. تحديث API routes للمصادقة
2. تحديث APIs للكتب والمراجعات
3. اختبار الوظائف الأساسية

### الأسبوع الثالث: تحديث واجهة المستخدم
1. تحديث صفحات الويب
2. تحديث تطبيق الموبايل
3. اختبار شامل

### الأسبوع الرابع: النشر والمراقبة
1. نشر النسخة الجديدة
2. مراقبة الأداء
3. إصلاح المشاكل

---

## 💡 نصائح للنجاح

1. **ابدأ بصغير**: احتفظ بـ MongoDB كـ backup أثناء الترحيل
2. **اختبر كثيراً**: تأكد من صحة البيانات بعد الترحيل
3. **استخدم Transactions**: للعمليات المعقدة
4. **راقب الأداء**: استخدم Supabase Analytics
5. **أمان أولاً**: فعل RLS و إعداد السياسات الأمنية

---

## 🚀 البدء السريع

```bash
# 1. تثبيت Supabase
npm install @supabase/supabase-js

# 2. إعداد متغيرات البيئة
echo "NEXT_PUBLIC_SUPABASE_URL=your-project-url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local

# 3. اختبار الاتصال
npm run test-supabase-connection
```

هذا الترحيل سيجعل تطبيق كتابي أكثر استقراراً وسهولة في الصيانة! 🎉
