# 🚀 نشر Railway خلال 5 دقائق - طريقة GitHub

## الخطوات السريعة:

### 1️⃣ افتح Railway Dashboard
- اذهب إلى [railway.app](https://railway.app)
- سجل دخول بـ GitHub
- اضغط "New Project"

### 2️⃣ اختر Deploy from GitHub
- اضغط "Deploy from GitHub repo"
- اختر repository: `kitab`
- Root Directory: `backend`
- اضغط "Deploy Now"

### 3️⃣ أضف متغيرات البيئة
في Variables tab، أضف واحداً تلو الآخر:

```
NODE_ENV=production
USE_DATABASE=true
MONGODB_URI=mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority
JWT_SECRET=kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
SESSION_SECRET=kitabi-session-secret-production-2025
CLIENT_URL=https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app
ALLOWED_ORIGINS=https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://localhost:3000
SUPPORT_EMAIL=ahmedhd123@gmail.com
```

### 4️⃣ انتظر النشر
- Railway سيقوم ببناء ونشر المشروع تلقائياً
- ستظهر رسالة "Deployed" عند الانتهاء

### 5️⃣ احصل على Domain
- في Settings tab، اضغط "Generate Domain"
- انسخ الرابط (مثل: `kitabi-backend-production.up.railway.app`)

### 6️⃣ اختبر الخادم
افتح في المتصفح:
```
https://your-app.up.railway.app/health
```

يجب أن ترى:
```json
{"success":true,"message":"Kitabi Backend is running"}
```

## ✅ النتيجة المتوقعة
- ✅ خادم يعمل على Railway
- ✅ SSL تلقائي
- ✅ Domain مجاني
- ✅ اتصال MongoDB
- ✅ Admin user جاهز

## 🔧 تحديث الواجهة الأمامية
بعد الحصول على Railway URL، سأقوم بتحديث الواجهة الأمامية فوراً.

## 🆘 إذا واجهت مشاكل
- تأكد من أن repository عام (public)
- تحقق من أن المتغيرات أُدخلت بشكل صحيح
- راجع Logs في Railway لأي أخطاء

**جاهز للبدء؟** 🚀
