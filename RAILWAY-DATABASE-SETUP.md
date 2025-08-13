# 🚀 Railway Database Configuration Guide

## خطوات إضافة متغيرات البيئة لقاعدة البيانات في Railway

### 📋 متغيرات البيئة المطلوبة:

```env
MONGODB_URI=mongodb+srv://ahmedhd123:XdDXVpePuNGKSnQu@cluster0.z5ksb.mongodb.net/kitab?retryWrites=true&w=majority
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app
PORT=8080
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,application/epub+zip,application/x-mobipocket-ebook,text/plain
```

### 🔧 خطوات الإضافة:

1. **اذهب إلى Railway Dashboard**
   - افتح: https://railway.app/dashboard
   - اختر مشروع `kitab`

2. **افتح إعدادات المشروع**
   - انقر على المشروع
   - اختر تبويب `Variables`

3. **أضف المتغيرات واحداً تلو الآخر:**
   - انقر `+ New Variable`
   - أضف اسم المتغير والقيمة
   - كرر للجميع

4. **إعادة النشر التلقائي**
   - Railway سيعيد النشر تلقائياً بعد إضافة المتغيرات

### ✅ بعد إضافة المتغيرات:

1. **اختبر الاتصال:**
   ```
   https://kitab-production.up.railway.app/health
   ```

2. **اختبر قاعدة البيانات:**
   ```
   https://kitab-production.up.railway.app/api/books
   ```

3. **جرب إضافة كتاب:**
   - اذهب إلى: https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app/auth/login
   - استخدم: admin@kitabi.com / admin123
   - اذهب إلى: https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app/admin/books/new

### 🎯 النتيجة المتوقعة:

- ✅ إضافة الكتب ستعمل
- ✅ حفظ البيانات في MongoDB Atlas
- ✅ عرض الكتب في صفحة الاستكشاف
- ✅ نظام المصادقة سيعمل بالكامل

### 🆘 في حالة وجود مشاكل:

1. تحقق من صحة متغيرات البيئة
2. تأكد من أن MongoDB Atlas يسمح بالاتصال من Railway
3. اختبر الـ health endpoint أولاً

## 📱 URLs للاختبار:

- **Frontend:** https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app
- **Backend:** https://kitab-production.up.railway.app
- **Admin Panel:** https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app/admin
- **Add Book:** https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app/admin/books/new
