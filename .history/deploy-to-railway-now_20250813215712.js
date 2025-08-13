#!/usr/bin/env node

/**
 * 🚀 دليل النشر المباشر على Railway - كتابي PostgreSQL
 * ====================================================
 * خطوات مفصلة للنشر الفوري
 */

console.log(`
🚂 دليل النشر المباشر على Railway

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 1: إعداد Git Repository

1️⃣ تحديث Repository:
`);

console.log('   git add .');
console.log('   git commit -m "feat: Complete PostgreSQL migration for Railway"');
console.log('   git push origin master');

console.log(`

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 2: إنشاء مشروع Railway

1️⃣ اذهب إلى: https://railway.app/dashboard
2️⃣ اضغط "New Project"
3️⃣ اختر "Deploy from GitHub repo"
4️⃣ ابحث عن: "kitab" واختر المستودع
5️⃣ اضغط "Deploy Now"

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 3: تكوين Backend Service

بعد إنشاء المشروع:

1️⃣ اضغط على الخدمة المنشأة
2️⃣ اذهب إلى "Settings" → "Service"
3️⃣ في "Root Directory" اكتب: backend
4️⃣ في "Start Command" تأكد من: npm run railway:start
5️⃣ اضغط "Save Changes"

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 4: إضافة متغيرات البيئة

اذهب إلى "Variables" واضف:

DATABASE_URL=postgresql://postgres:qKOgKtwEWLdXnIgkaeBBBMfrKPesCxBO@postgres.railway.internal:5432/railway
NODE_ENV=production
JWT_SECRET=kitabi-super-secret-production-jwt-key-2025
CLIENT_URL=https://kitab-plum.vercel.app
ALLOWED_ORIGINS=https://kitab-plum.vercel.app,http://localhost:3000
PORT=5000
USE_DATABASE=true
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 5: ربط PostgreSQL Database

1️⃣ في Railway Dashboard، اضغط "Add Service"
2️⃣ اختر "Database" → "Add PostgreSQL" 
3️⃣ انتظر حتى يتم إنشاء قاعدة البيانات
4️⃣ ستظهر متغيرات البيئة تلقائياً

بديل: قاعدة البيانات جاهزة بالفعل بالمعلومات المعطاة!

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 6: مراقبة النشر

1️⃣ اذهب إلى "Deployments" لمراقبة التقدم
2️⃣ انتظر حتى يظهر "Success" باللون الأخضر
3️⃣ احصل على رابط الخدمة من "Settings" → "Domains"

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 7: إعداد قاعدة البيانات

بعد النشر الناجح:

1️⃣ اذهب إلى Railway Dashboard
2️⃣ اضغط على Backend Service
3️⃣ اذهب إلى "Deploy Logs"
4️⃣ انتظر حتى ترى "PostgreSQL connection established"

قاعدة البيانات ستُعد تلقائياً عند أول تشغيل!

═══════════════════════════════════════════════════════════════════

🎯 الخطوة 8: تحديث Frontend

بعد الحصول على رابط Backend:

1️⃣ انسخ رابط الخدمة (مثل: https://kitab-production.up.railway.app)
2️⃣ حدث في web-app/.env.production:
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.up.railway.app

3️⃣ انشر Frontend على Vercel:
   cd web-app
   npm run build
   vercel --prod

═══════════════════════════════════════════════════════════════════

✅ توقعات النشر:

📊 وقت النشر: 3-5 دقائق
💾 حجم التطبيق: ~50MB
🚀 وقت البدء: 10-30 ثانية
💰 التكلفة: مجاني (حتى 5GB)

═══════════════════════════════════════════════════════════════════

🎉 بعد النشر الناجح:

✅ Backend URL: https://your-app.up.railway.app
✅ API Endpoint: https://your-app.up.railway.app/api
✅ Health Check: https://your-app.up.railway.app/health
✅ Frontend: https://kitab-plum.vercel.app

═══════════════════════════════════════════════════════════════════

🔧 إذا واجهت مشاكل:

1. تحقق من Logs في Railway Dashboard
2. تأكد من متغيرات البيئة
3. تحقق من Root Directory = backend

═══════════════════════════════════════════════════════════════════

🚀 جاهز للنشر! ابدأ بـ Railway.app الآن!

═══════════════════════════════════════════════════════════════════
`);

console.log('\n📋 الملفات الجاهزة للنشر:');
console.log('   ✅ backend/railway.json - تكوين النشر');
console.log('   ✅ backend/.env.railway - متغيرات البيئة');
console.log('   ✅ backend/src/config/database_postgres.js - إعداد PostgreSQL');
console.log('   ✅ backend/src/models/postgres.js - نماذج البيانات');
console.log('   ✅ backend/package.json - dependencies محدثة');

console.log('\n🎯 الآن: اذهب إلى https://railway.app/dashboard وابدأ النشر!');
