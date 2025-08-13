# 🚨 إصلاح عاجل - CORS مشكلة التسجيل

## المشكلة:
Railway backend يرفض الطلبات من الـ Frontend الجديد بسبب CORS configuration.

## الحل السريع:
يجب تحديث متغيرات البيئة في Railway Dashboard:

### 1. اذهب إلى Railway Dashboard:
https://railway.app/project/kitab-production

### 2. اختر backend service

### 3. اضغط Variables tab

### 4. أضف/حدث هذه المتغيرات:

```bash
CLIENT_URL=https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app
ALLOWED_ORIGINS=https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app,https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://vercel.app,https://localhost:3000
```

### 5. اضغط Save وانتظر إعادة التشغيل

## اختبار سريع:
بعد التحديث، افتح:
https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app/auth/register

## متغيرات Railway المطلوبة الكاملة:
```bash
NODE_ENV=production
PORT=8080
USE_DATABASE=true
CLIENT_URL=https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app
ALLOWED_ORIGINS=https://kitab-bhh92s0gi-ahmedhd123s-projects.vercel.app,https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://vercel.app
JWT_SECRET=kitabi-jwt-secret-production-2025-secure-key-minimum-32-characters
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# قاعدة البيانات (اختياري - سيعمل بدونها في demo mode)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kitabi
```

---
**⚡ هذا سيحل مشكلة التسجيل فوراً!**
